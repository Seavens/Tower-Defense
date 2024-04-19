import { ASSET_IDS } from "shared/assets/constants";
import { Collision, setCollision } from "shared/utility/collision";
import { Flamework, Modding } from "@flamework/core";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { SoundEmitter } from "shared/assets/sound";
import { TowerUtility } from "shared/tower/utility";
import { TowerVisual } from "shared/tower/types";
import { VisualUtility, params } from "../utility";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "client/mob/class";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerVisualModule } from ".";

const { assets } = ReplicatedStorage;
const { effects } = assets;

type Sounds = "WhooshSuction" | "ElectricSpark" | "LightningFlashes" | "SilentGlitcher";

const soundNames = Modding.inspect<Array<Sounds>>();

const guard = Flamework.createGuard<
	BasePart & {
		top1: Attachment & { ParticleEmitter: ParticleEmitter };
		top2: Attachment & { ParticleEmitter: ParticleEmitter };
		bottom: Attachment & { ParticleEmitter: ParticleEmitter };
	}
>();
const prefab = effects.FindFirstChild(TowerVisual.Neutron);

const priority = Enum.RenderPriority.Last.Value;

const info = new TweenInfo(0.5, Enum.EasingStyle.Exponential, Enum.EasingDirection.Out, 0, false, 2.5);

const { debris } = Workspace;
const camera = Workspace.CurrentCamera;

export const neutronVisual: TowerVisualModule<TowerVisual.Neutron> = {
	id: TowerVisual.Neutron,
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
		const { bottom } = effect;
		const { ParticleEmitter: emitter } = bottom;
		setCollision(effect, Collision.Debris, true);
		const range = TowerUtility.getTotalRange(tower) / 3;
		emitter.Size = new NumberSequence(range);
		const normal = raycast.Normal;
		const position = raycast.Position;
		const look = position.add(normal).Unit;
		const cframe = CFrame.fromMatrix(position, look.Cross(normal), normal.mul(-1));
		effect.CFrame = cframe;
		effect.Name = `(${model.Name})-${TowerVisual.Neutron}`;
		effect.Parent = debris;

		VisualUtility.onShake(priority, camera);

		const thread = task.delay(2.5, (): void => {
			const emitters = effect.GetDescendants();
			for (const emitter of emitters) {
				if (!emitter.IsA("ParticleEmitter")) {
					continue;
				}
				emitter.Enabled = false;
			}
		});

		const sounds = new SoundEmitter(model, {
			WhooshSuction: [ASSET_IDS.WhooshSuction],
			ElectricSpark: [ASSET_IDS.ElectricSpark],
			LightningFlashes: [ASSET_IDS.LightningFlashes],
			SilentGlitcher: [ASSET_IDS.SilentGlitcher],
		});

		for (const key of soundNames) {
			const sound = sounds.playSound(key);
			const tween = TweenService.Create(sound, info, { Volume: 0 });
			tween.Play();
			bin.add(tween);
		}

		const delay = task.delay(3.25, (): void => {
			sounds.destroy();
		});

		bin.add(sounds);
		bin.add(delay);
		bin.add(thread);
		bin.add(effect);
	},
};
