import { Events } from "server/network";
import { GameStatus } from "shared/types/enums";
import { MapDefinitions } from "shared/definitions/maps";
import { Mob } from "server/classes/mob";
import { MobUtility } from "shared/modules/mob-utility";
import { Service } from "@flamework/core";
import { mobDefinitions } from "shared/definitions/mobs";
import { selectCurrentMap, selectCurrentWave, selectGame, selectGameStatus } from "shared/state/selectors";
import { serverProducer } from "server/state/producer";
import type { Entity } from "shared/api/entity";
import type { MapId } from "shared/types/ids";
import type { OnMobEnded, OnMobRemoved } from "./mob-service";
import type { OnPlayerAdded } from "./player-service";
import type { OnStart } from "@flamework/core";

@Service({})
export class WaveService implements OnStart, OnMobRemoved, OnMobEnded, OnPlayerAdded {
	public spawnWave(map: MapId, wave: number): void {
		const { waves } = MapDefinitions[map];
		const definition = waves[wave - 1];
		serverProducer.gameSetStatus({ status: GameStatus.Spawning }, { broadcast: true });
		MobUtility.setIndex(0);
		let longestDuration = 0;
		for (const [id, { count, delay, wait }] of pairs(definition)) {
			if (count <= 0) {
				continue;
			}
			const duration = delay + count * wait;
			task.delay(delay, (): void => {
				let status = serverProducer.getState(selectGameStatus);
				for (const _ of $range(1, count)) {
					if (status === GameStatus.Ended) {
						break;
					}
					const index = MobUtility.getIndex();
					const mob = new Mob(index, id);
					mob.start();
					if (wait < 0) {
						continue;
					}
					task.wait(wait);
					status = serverProducer.getState(selectGameStatus);
				}
			});
			if (duration > longestDuration) {
				longestDuration = duration;
			}
			const status = serverProducer.getState(selectGameStatus);
			if (status === GameStatus.Ended) {
				break;
			}
		}
		task.delay(longestDuration, (): void => {
			serverProducer.gameSetStatus({ status: GameStatus.Ongoing }, { broadcast: true });
		});
	}

	public onMobRemoved(): void {
		const count = Mob.getMobCount();
		const status = serverProducer.getState(selectGameStatus);
		if (count > 0 || status === GameStatus.Spawning || status === GameStatus.Ended) {
			return;
		}
		serverProducer.gameEndWave({}, { broadcast: true });
		warn("Wave ended.");
		// !! Reward players with currency
		// Temporary...
		// We'll change this later to start after
		// either 30 seconds or whenever all players
		// vote to start the wave early.
		task.wait(3);
		warn("Wave started.");
		serverProducer.gameStartWave({}, { broadcast: true });
	}

	public onMobEnded(mob: Mob): void {
		const current = mob.getHealth();
		const { id } = mob;
		const { health } = mobDefinitions[id];
		const damage = current ** 2 / (health * 2);
		serverProducer.gameBaseDamage({ damage }, { broadcast: true });
		const { health: baseHealth, status } = serverProducer.getState(selectGame);
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
		Events.replicateIndexReset(player, MobUtility.getIndex(false));
	}

	public onStart(): void {
		serverProducer.subscribe(selectCurrentWave, (wave: number): void => {
			const status = serverProducer.getState(selectGameStatus);
			const map = serverProducer.getState(selectCurrentMap);
			if ((status !== GameStatus.Ongoing && status !== GameStatus.Spawning) || map === undefined) {
				return;
			}
			this.spawnWave(map, wave);
		});
		task.wait(5);
		const map = serverProducer.getState(selectCurrentMap);
		if (map === undefined) {
			return;
		}
		serverProducer.gameStartRound({ health: MapDefinitions[map].baseHealth }, { broadcast: true });
		serverProducer.gameStartWave({}, { broadcast: true });
	}
}
