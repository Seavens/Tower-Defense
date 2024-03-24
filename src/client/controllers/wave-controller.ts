import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { GameStatus } from "shared/types/enums";
import { MapDefinitions } from "shared/definitions/maps";
import { Mob } from "client/classes/mob";
import { MobUtility } from "shared/modules/mob-utility";
import { clientProducer } from "client/state/producer";
import { selectCurrentMap, selectCurrentWave, selectGame, selectGameStatus } from "shared/state/selectors";
import type { MapId } from "shared/types/ids";
import type { OnMobEnded, OnMobRemoved } from "./mob-controller";
import type { OnStart } from "@flamework/core";

@Controller({})
export class WaveController implements OnStart, OnMobEnded, OnMobRemoved {
	public spawnWave(map: MapId, wave: number): void {
		const { waves } = MapDefinitions[map];
		const definition = waves[wave - 1];
		Mob.removeAllMobs();
		MobUtility.setIndex(0);
		for (const [id, { count, delay, wait }] of pairs(definition)) {
			if (count <= 0) {
				continue;
			}
			task.delay(delay, (): void => {
				let status = clientProducer.getState(selectGameStatus);
				for (const _ of $range(1, count)) {
					if (status === GameStatus.Ended) {
						break;
					}
					const index = MobUtility.getIndex();
					const mob = new Mob(index, id);
					mob.start();
					task.wait(wait);
					if (wait < 0) {
						continue;
					}
					status = clientProducer.getState(selectGameStatus);
				}
			});
			const status = clientProducer.getState(selectGameStatus);
			if (status === GameStatus.Ended) {
				Mob.removeAllMobs();
				break;
			}
		}
	}

	public onMobEnded(mob: Mob): void {
		const { status } = clientProducer.getState(selectGame);
		if (status !== GameStatus.Ended) {
			return;
		}
		Mob.removeAllMobs();
	}

	public onMobRemoved(mob: Mob): void {
		const count = Mob.getMobCount();
		const status = clientProducer.getState(selectGameStatus);
		if (count > 0 || status === GameStatus.Spawning || status === GameStatus.Ended) {
			return;
		}
		Mob.removeAllMobs();
	}

	public onStart(): void {
		clientProducer.subscribe(selectCurrentWave, (wave: number): void => {
			const status = clientProducer.getState(selectGameStatus);
			const map = clientProducer.getState(selectCurrentMap);
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
