import { Bin } from "@rbxts/bin";
import { Controller } from "@flamework/core";
import { VisualUtility } from "./utility";
import { selectProfileData } from "client/players/profile/selectors";
import { store } from "client/state/store";
import { towerVisualModules } from "./definitions";
import Shake from "@rbxts/rbx-sleitnick-shake";
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

	public static onShake(
		priority: number,
		camera?: Camera,
		fadeInTime: number = 0,
		fadeOutTime: number = 0.25,
		frequency: number = 0.1,
		amplitude: number = 0.01,
		sustainTime: number = 3,
	): void {
		const state = store.getState(selectProfileData);
		const { settings } = state;
		const { visual } = settings;
		const { shake: userSetting } = visual;
		if (!userSetting) {
			return;
		}

		const bin = new Bin();
		const shake = new Shake();
		shake.FadeInTime = fadeInTime;
		shake.FadeOutTime = fadeOutTime;
		shake.Frequency = frequency;
		shake.Amplitude = amplitude;
		shake.SustainTime = sustainTime;
		bin.add(shake);

		shake.Start();
		VisualUtility.connectShake(shake, priority, (delta: number, position: Vector3, rotation: Vector3): void => {
			if (camera === undefined) {
				return;
			}
			const current = camera.CFrame;
			camera.CFrame = current.Lerp(
				current.mul(new CFrame(position).mul(CFrame.Angles(rotation.X, rotation.Y, rotation.Z))),
				math.clamp(delta * 60, 0, 1),
			);
		});
		task.delay(shake.SustainTime, (): void => {
			bin.destroy();
		});
	}
}
