import { Controller } from "@flamework/core";
import { GameStatus } from "shared/game/types";
import { Mob } from "client/mob/class";
import { getMobIndex, setMobIndex } from "shared/mobs/utility";
import { mapDefinitions } from "shared/map/definitions";
import { selectCurrentMap, selectCurrentWave, selectGame, selectGameStatus } from "shared/game/selectors";
import { store } from "client/state/store";
import type { MapId } from "shared/map/types";
import type { OnMobEnded, OnMobRemoved } from "client/mob/controller";
import type { OnStart } from "@flamework/core";

@Controller({})
export class WaveController implements OnStart, OnMobEnded, OnMobRemoved {
	public spawnWave(map: MapId, wave: number): void {
		const { waves } = mapDefinitions[map];
		const definition = waves[wave - 1];
		Mob.removeAllMobs();
		setMobIndex(0);
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
					task.wait(wait);
					if (wait < 0) {
						continue;
					}
					status = store.getState(selectGameStatus);
				}
			});
			const status = store.getState(selectGameStatus);
			if (status === GameStatus.Ended) {
				Mob.removeAllMobs();
				break;
			}
		}
	}

	public onMobEnded(mob: Mob): void {
		const { status } = store.getState(selectGame);
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
