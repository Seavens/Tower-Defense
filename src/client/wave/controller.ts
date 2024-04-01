import { Controller } from "@flamework/core";
import { GameStatus } from "shared/game/types";
import { Mob } from "client/mob/class";
import { getMobIndex, setMobIndex } from "shared/mobs/utility";
import { mapDefinitions } from "shared/map/definitions";
import { selectCurrentMap, selectCurrentWave, selectGameData, selectGameStatus } from "shared/game/selectors";
import { store } from "client/state/store";
import type { MapId } from "shared/map/types";
import type { OnMobEnded, OnMobRemoved } from "client/mob/controller";
import type { OnStart } from "@flamework/core";

@Controller({})
export class WaveController implements OnStart, OnMobEnded, OnMobRemoved {
	public getSpawnDuration(map: MapId, wave: number): number {
		const { waves } = mapDefinitions[map];
		const [definition] = waves[wave - 1];
		let longest = 0;
		// eslint-disable-next-line roblox-ts/no-array-pairs
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
		setMobIndex(0);
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
			const status = store.getState(selectGameStatus);
			if (status === GameStatus.Ended) {
				break;
			}
		}
		task.delay(longest, (): void => {
			store.gameSetStatus({ status: GameStatus.Ongoing }, { broadcast: true });
		});
	}

	public onMobEnded(mob: Mob): void {
		const { status } = store.getState(selectGameData);
		if (status !== GameStatus.Ended) {
			return;
		}
		Mob.removeAllMobs();
	}

	public onMobRemoved(mob: Mob): void {
		const count = Mob.getMobCount();
		const status = store.getState(selectGameStatus);
		if (count > 0 || status === GameStatus.Spawning || status === GameStatus.Ended) {
			return;
		}
		Mob.removeAllMobs();
	}

	public onStart(): void {
		store.subscribe(selectCurrentWave, (wave: number): void => {
			const status = store.getState(selectGameStatus);
			const map = store.getState(selectCurrentMap);
			if ((status !== GameStatus.Ongoing && status !== GameStatus.Spawning) || map === undefined) {
				if (status === GameStatus.Ended) {
					Mob.removeAllMobs();
				}
				return;
			}
			this.spawnWave(map, wave);
		});
	}
}
