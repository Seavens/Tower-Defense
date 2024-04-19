import { Bin } from "@rbxts/bin";
import { Controller } from "@flamework/core";
import { selectProfileData } from "client/players/profile/selectors";
import { store } from "client/state/store";
import { towerVisualModules } from "./definitions";
import type { Mob } from "client/mob/class";
import type { ReplicatedTower, TowerVisual } from "shared/tower/types";

@Controller({})
export class VisualController {
	public static onEffect(effect: TowerVisual, tower: Model, target: Option<Mob>, replicated: ReplicatedTower): void {
		const state = store.getState(selectProfileData);
		const { settings } = state;
		const { visual } = settings;
		const { vfx } = visual;
		if (!vfx) {
			return;
		}

		const module = towerVisualModules[effect];
		const { duration } = module;
		const bin = new Bin();

		task.delay(duration, (): void => {
			bin.destroy();
		});
		module.onEffect(bin, tower, target, replicated);
	}
}
