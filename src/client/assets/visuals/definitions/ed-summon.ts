import { ASSET_IDS } from "shared/assets/constants";
import { Flamework, Modding } from "@flamework/core";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { SettingId } from "shared/players/settings";
import { SoundEmitter } from "shared/assets/sound/sound-emitter";
import { TowerVisual } from "shared/tower/types";
import { selectSettingValues } from "client/players/profile/settings";
import { store } from "client/state/store";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "shared/mob/api";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerVisualModule } from ".";

const { debris } = Workspace;
const { assets } = ReplicatedStorage;
const { effects } = assets;

type Sounds = "DownTen" | "DemonOne" | "DemonTwo" | "DemonThree" | "DemonFour" | "DemonFive";

const soundNames = Modding.inspect<Array<Sounds>>();

const info = new TweenInfo(2.25, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);

const guard = Flamework.createGuard<
	BasePart & {
		circle: Attachment;
		fire: Attachment;
	}
>();

const prefab = effects.FindFirstChild(TowerVisual.EDSummon);

const values = store.getState(selectSettingValues);
const sfxEnabled = values.get(SettingId.ToggleSfx);
const sfxVolume = values.get(SettingId.SfxVolume);

export const edSummonVisual: TowerVisualModule<TowerVisual.EDSummon> = {
	id: TowerVisual.EDSummon,
	duration: 3,
	onEffect: (bin: Bin, model: Model, target: Option<Mob>, tower: ReplicatedTower): void => {
		if (prefab === undefined || !guard(prefab)) {
			return;
		}
		const cframe = model.GetPivot();
		const size = model.GetExtentsSize();
		const height = size.Y / 2;
		const point = cframe.Position.add(Vector3.yAxis.mul(-height));
		const effect = prefab.Clone();
		effect.Position = point;
		effect.Anchored = true;
		effect.Parent = debris;

		if (sfxEnabled === true) {
			const sounds = new SoundEmitter(model, {
				DownTen: [ASSET_IDS.DownTen],
				DemonOne: [ASSET_IDS.DemonOne],
				DemonTwo: [ASSET_IDS.DemonTwo],
				DemonThree: [ASSET_IDS.DemonThree],
				DemonFour: [ASSET_IDS.DemonFour],
				DemonFive: [ASSET_IDS.DemonFive],
			});

			for (const key of soundNames) {
				const volumeScale = key === "DownTen" ? (sfxVolume as number) / 200 : (sfxVolume as number) / 100;
				const sound = sounds.playSound(key, 0, volumeScale);
				const tween = TweenService.Create(sound, info, { Volume: 0 });
				tween.Play();
				bin.add(tween);
			}

			const delay = task.delay(2.25, (): void => {
				sounds.destroy();
			});

			bin.add(sounds);
			bin.add(delay);
		}

		const thread = task.delay(1.95, (): void => {
			const emitters = effect.GetDescendants();
			for (const emitter of emitters) {
				if (!emitter.IsA("ParticleEmitter")) {
					continue;
				}
				emitter.Enabled = false;
			}
		});
		bin.add(thread);
	},
};
