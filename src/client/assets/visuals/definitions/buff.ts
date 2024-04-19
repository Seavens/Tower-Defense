import { ASSET_IDS } from "shared/assets/constants";
import { Collision, setCollision } from "shared/utility/collision";
import { Flamework, Modding } from "@flamework/core";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { SettingId, SettingKind } from "shared/players/settings";
import { SoundEmitter } from "shared/assets/sound";
import { TowerVisual } from "shared/tower/types";
import { params } from "../utility";
import { selectSettingValues, settingSlice } from "client/players/profile/settings";
import { store } from "client/state/store";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "client/mob/class";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerVisualModule } from ".";

const { assets } = ReplicatedStorage;
const { effects } = assets;

type Sounds = "TwinkleMagic" | "LightSpell";

const soundNames = Modding.inspect<Array<Sounds>>();

const guard = Flamework.createGuard<
	BasePart & {
		blue: ParticleEmitter;
		green: ParticleEmitter;
		yellow: ParticleEmitter;
	}
>();
const prefab = effects.FindFirstChild(TowerVisual.Buff);

const info = new TweenInfo(0.5, Enum.EasingStyle.Exponential, Enum.EasingDirection.Out, 0, false, 2.5);

const { debris } = Workspace;

const values = store.getState(selectSettingValues);
const sfxEnabled = values.get(SettingId.ToggleSfx);
const sfxVolume = values.get(SettingId.SfxVolume);

export const buffVisual: TowerVisualModule<TowerVisual.Buff> = {
	id: TowerVisual.Buff,
	duration: 4,

	onEffect: (bin: Bin, model: Model, target: Option<Mob>, tower: ReplicatedTower): void => {
		if (prefab === undefined || !guard(prefab) || target === undefined) {
			return;
		}
		const instance = target.getInstance();
		const pivot = instance.GetPivot();
		const point = pivot.Position;
		const origin = point.add(Vector3.yAxis.mul(5));
		const direction = Vector3.yAxis.mul(-10);
		const raycast = Workspace.Raycast(origin, direction, params);
		if (raycast === undefined) {
			return;
		}
		const effect = prefab.Clone();

		setCollision(effect, Collision.Debris, true);
		const normal = raycast.Normal;
		const position = raycast.Position;
		const look = position.add(normal).Unit;
		const cframe = CFrame.fromMatrix(position, look.Cross(normal), normal.mul(-1));
		effect.CFrame = cframe;
		effect.Name = `(${model.Name})-${TowerVisual.Neutron}`;
		effect.Parent = debris;

		if (sfxEnabled === true) {
			const sounds = new SoundEmitter(model, {
				TwinkleMagic: [ASSET_IDS.TwinkleMagic],
				LightSpell: [ASSET_IDS.LightSpell],
			});

			for (const key of soundNames) {
				const sound = sounds.playSound(key, 0, (sfxVolume as number) / 100);
				const tween = TweenService.Create(sound, info, { Volume: 0 });
				tween.Play();
				bin.add(tween);
			}

			const delay = task.delay(3.25, (): void => {
				sounds.destroy();
			});

			bin.add(sounds);
			bin.add(delay);
		}

		const thread = task.delay(2.5, (): void => {
			const emitters = effect.GetDescendants();
			for (const emitter of emitters) {
				if (!emitter.IsA("ParticleEmitter")) {
					continue;
				}
				emitter.Enabled = false;
			}
		});

		bin.add(thread);
		bin.add(effect);
	},
};
