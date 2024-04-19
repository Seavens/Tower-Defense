import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { GameStatus } from "shared/game/types";
import { Mob } from "client/mob/class";
import { Workspace } from "@rbxts/services";
import { selectCurrentWave, selectGameData, selectGameStatus } from "shared/game/selectors";
import { store } from "client/state/store";
import type { MobData } from "shared/mob/types";
import type { OnMobEnded, OnMobRemoved } from "client/mob/controller";
import type { OnStart } from "@flamework/core";

@Controller({})
export class WaveController implements OnStart, OnMobEnded, OnMobRemoved {
	public onMobEnded(): void {
		const { status } = store.getState(selectGameData);
		if (status !== GameStatus.Ended) {
			return;
		}
		Mob.removeAllMobs();
	}

	public onMobRemoved(): void {
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
			if (status !== GameStatus.Ended) {
				return;
			}
			Mob.removeAllMobs();
		});

		Events.mob.sync.connect((data: Map<UUID, MobData>): void => {
			const now = Workspace.GetServerTimeNow();
			for (const [uuid, { id, current, alpha, health, timestamp }] of data) {
				const delta = now - timestamp;
				const mob = new Mob(uuid, id);
				mob.start(current);
				mob.setAlpha(alpha, delta);
				mob.setHealth(health);
			}
		});
	}
}
