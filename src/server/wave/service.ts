import { Events } from "server/network";
import { GameStatus } from "shared/game/types";
import { INTERMISSION_TIME } from "./constants";
import { Mob } from "server/mob/class";
import { PlayerUtility } from "shared/player/utility";
import { Players, Workspace } from "@rbxts/services";
import { Service } from "@flamework/core";
import { createUUID } from "shared/utility/create-uuid";
import { mapDefinitions } from "shared/map/definitions";
import { mobDefinitions } from "shared/mob/mobs";
import {
	selectBounty,
	selectCurrentMap,
	selectCurrentWave,
	selectExperience,
	selectGameData,
	selectGameStatus,
} from "shared/game/selectors";
import { store } from "server/state/store";
import type { Entity } from "shared/player/api";
import type { MapId } from "shared/map/types";
import type { MobData } from "shared/mob/types";
import type { OnMobEnded, OnMobRemoved } from "../mob/service";
import type { OnPlayerReady } from "../player/service";
import type { OnStart } from "@flamework/core";

@Service({})
export class WaveService implements OnStart, OnMobRemoved, OnMobEnded, OnPlayerReady {
	public getSpawnDuration(map: MapId, wave: number): number {
		const { waves } = mapDefinitions[map];
		const [definition] = waves[wave - 1];
		let longest = 0;
		for (const [_, { count, delay, wait }] of pairs(definition)) {
			if (count <= 0) {
				continue;
			}
			// Duration = Initial Delay + (Spawn Delay Per * Mob Count);
			const duration = delay + wait * count;
			if (duration <= longest) {
				continue;
			}
			// All spawn happen asynchronously, we only need to wait
			// as long as the longest duration for all mobs to be spawned
			longest = duration;
		}
		return longest;
	}

	public spawnWave(map: MapId, wave: number): void {
		const { waves } = mapDefinitions[map];
		const [definition] = waves[wave - 1];
		store.gameSetStatus({ status: GameStatus.Spawning }, { broadcast: true });
		const longest = this.getSpawnDuration(map, wave);
		for (const [id, { count, delay, wait }] of pairs(definition)) {
			if (count <= 0) {
				continue;
			}
			task.delay(delay, (): void => {
				let status = store.getState(selectGameStatus);
				for (const _ of $range(1, count)) {
					if (status === GameStatus.Ended) {
						break;
					}
					const uuid = createUUID();
					const mob = new Mob(uuid, id);
					const now = Workspace.GetServerTimeNow();
					Events.mob.spawned.broadcast(id, uuid, now);
					mob.start();
					if (wait < 0) {
						continue;
					}
					task.wait(wait);
					status = store.getState(selectGameStatus);
				}
			});
			const status = store.getState(selectGameStatus);
			if (status === GameStatus.Ended) {
				break;
			}
		}
		task.delay(longest, (): void => {
			store.gameSetStatus({ status: GameStatus.Ongoing }, { broadcast: true });
		});
	}

	public onMobRemoved(): void {
		// Check if all mobs are dead
		const count = Mob.getMobCount();
		const status = store.getState(selectGameStatus);
		if (count > 0 || status === GameStatus.Spawning || status === GameStatus.Ended) {
			return;
		}
		warn("Wave ended.");
		store.gameEndWave({}, { broadcast: true });

		// Reward all players with the bounty and experience
		const bounty = store.getState(selectBounty);
		const experience = store.getState(selectExperience);
		for (const player of Players.GetPlayers()) {
			const user = PlayerUtility.getUser(player);
			store.gameAddCurrency({ amount: bounty }, { user, broadcast: true });
			store.profileAddExperience({ amount: experience }, { user, replicate: true });
		}

		// Wait for intermission time before starting the next wave
		for (const index of $range(1, INTERMISSION_TIME)) {
			task.wait(1);
			warn(index, index > 1 ? "s" : "");
		}

		warn("Wave started.");
		store.gameStartWave({}, { broadcast: true });
	}

	public onMobEnded(mob: Mob): void {
		const current = mob.getHealth();
		const { id } = mob;
		const { health } = mobDefinitions[id];
		const damage = current ** 2 / (health * 2);
		store.gameBaseDamage({ damage }, { broadcast: true });
		const { health: baseHealth, status } = store.getState(selectGameData);
		warn(`Base: ${baseHealth} | Damage: -${damage} | Mobs: ${Mob.getMobCount()}`);
		if (status !== GameStatus.Ended) {
			return;
		}
		Mob.removeAllMobs();
		warn("Round ended.");
	}

	public onPlayerReady(entity: Entity): void {
		if (!entity.isPlayer()) return;
		const { player } = entity;
		const selected = store.getState(selectGameStatus);
		if (selected === GameStatus.None) return;
		const mobs = Mob.getMobs();
		const serialized = new Map<UUID, MobData>();
		for (const [uuid, mob] of mobs) {
			const data = mob.serialize();
			serialized.set(uuid, data);
		}
		warn("synchronizing");
		Events.mob.sync(player, serialized);
	}

	public onStart(): void {
		store.subscribe(selectCurrentWave, (wave: number): void => {
			const status = store.getState(selectGameStatus);
			const map = store.getState(selectCurrentMap);
			if ((status !== GameStatus.Ongoing && status !== GameStatus.Spawning) || map === undefined) {
				return;
			}
			this.spawnWave(map, wave);
		});
		task.wait(5);
		const map = store.getState(selectCurrentMap);
		if (map === undefined) {
			return;
		}
		store.gameStartRound({ health: mapDefinitions[map].baseHealth }, { broadcast: true });
		store.gameStartWave({}, { broadcast: true });
	}
}
