import { Events } from "server/network";
import { GameStatus } from "shared/game/types";
import { Mob } from "server/mob/class";
import { Players } from "@rbxts/services";
import { Service } from "@flamework/core";
import { getMobIndex, setMobIndex } from "shared/mobs/utility";
import { mapDefinitions } from "shared/map/definitions";
import { mobDefinitions } from "shared/mobs/mobs";
import {
	selectCurrentMap,
	selectCurrentWave,
	selectGameData,
	selectGameStatus,
	selectReward,
} from "shared/game/selectors";
import { store } from "server/state/store";
import type { Entity } from "shared/player/api";
import type { MapId } from "shared/map/types";
import type { OnMobEnded, OnMobRemoved } from "../mob/service";
import type { OnPlayerAdded } from "../player/service";
import type { OnStart } from "@flamework/core";

@Service({})
export class WaveService implements OnStart, OnMobRemoved, OnMobEnded, OnPlayerAdded {
	public spawnWave(map: MapId, wave: number): void {
		const { waves } = mapDefinitions[map];
		const definition = waves[wave - 1];
		store.gameSetStatus({ status: GameStatus.Spawning }, { broadcast: true });
		setMobIndex(0);
		let longestDuration = 0;
		for (const [id, { count, delay, wait }] of pairs(definition)) {
			if (count <= 0) {
				continue;
			}
			const duration = delay + count * wait;
			task.delay(delay, (): void => {
				let status = store.getState(selectGameStatus);
				for (const _ of $range(1, count)) {
					if (status === GameStatus.Ended) {
						break;
					}
					const index = getMobIndex();
					const mob = new Mob(index, id);
					mob.start();
					if (wait < 0) {
						continue;
					}
					task.wait(wait);
					status = store.getState(selectGameStatus);
				}
			});
			if (duration > longestDuration) {
				longestDuration = duration;
			}
			const status = store.getState(selectGameStatus);
			if (status === GameStatus.Ended) {
				break;
			}
		}
		task.delay(longestDuration, (): void => {
			store.gameSetStatus({ status: GameStatus.Ongoing }, { broadcast: true });
		});
	}

	// !! MAP PROGRESS
	public onMobRemoved(): void {
		const count = Mob.getMobCount();
		const status = store.getState(selectGameStatus);
		const wave = store.getState(selectCurrentWave);
		const mapId = store.getState(selectCurrentMap);
		if (mapId === undefined) {
			return;
		}
		const { waves } = mapDefinitions[mapId];
		const delay = waves[wave - 1]["mob_id:zombie"];
		if (delay === undefined) {
			return;
		}
		const loading = delay.delay;

		if (count > 0 || status === GameStatus.Spawning || status === GameStatus.Ended) {
			return;
		}
		store.gameEndWave({}, { broadcast: true });
		const reward = store.getState(selectReward);
		for (const player of Players.GetPlayers()) {
			store.gameAddCurrency({ amount: reward }, { user: player.Name, broadcast: true });
		}
		// !! Reward players with currency
		// Temporary...
		// We'll change this later to start after
		// either 30 seconds or whenever all players
		// vote to start the wave early.
		warn(loading);
		task.wait(loading);
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

	public onPlayerAdded(entity: Entity): void {
		if (!entity.isPlayer()) {
			return;
		}
		const { player } = entity;
		Events.mob.indexReset(player, getMobIndex(false));
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
