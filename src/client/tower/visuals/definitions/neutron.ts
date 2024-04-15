import { ASSET_IDS } from "shared/assets/constants";
import { Collision, setCollision } from "shared/utility/collision";
import { Flamework } from "@flamework/core";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { SoundEmitter } from "shared/assets/sound";
import { TowerUtility } from "shared/tower/utility";
import { TowerVisual } from "shared/tower/types";
import { VisualUtility, params } from "../utility";
import Shake from "@rbxts/rbx-sleitnick-shake";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "client/mob/class/class";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerVisualModule } from ".";

const { assets } = ReplicatedStorage;
const { effects } = assets;

const guard = Flamework.createGuard<
	BasePart & {
		top1: Attachment & { ParticleEmitter: ParticleEmitter };
		top2: Attachment & { ParticleEmitter: ParticleEmitter };
		bottom: Attachment & { ParticleEmitter: ParticleEmitter };
	}
>();
const prefab = effects.FindFirstChild(TowerVisual.Neutron);

const priority = Enum.RenderPriority.Last.Value;

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
		const origin = point.add(Vector3.yAxis.mul(30));
		const direction = Vector3.yAxis.mul(-35);
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
		const shake = new Shake();
		shake.FadeInTime = 0;
		shake.FadeOutTime = 0.25;
		shake.Frequency = 0.1;
		shake.Amplitude = 0.01;
		shake.SustainTime = 3;
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
		const thread = task.delay(2.5, (): void => {
			const emitters = effect.GetDescendants();
			for (const emitter of emitters) {
				if (!emitter.IsA("ParticleEmitter")) {
					continue;
				}
				emitter.Enabled = false;
			}
		});

		const incoming = new SoundEmitter(model, {
			WhooshSuction: [ASSET_IDS.WhooshSuction],
			ElectricSpark: [ASSET_IDS.ElectricSpark],
			LightningFlashes: [ASSET_IDS.LightningFlashes],
			SilentGlitcher: [ASSET_IDS.SilentGlitcher],
		});

		incoming.playSound("SilentGlitcher");
		incoming.playSound("LightningFlashes");
		incoming.playSound("ElectricSpark");

		task.delay(0.2, (): void => {
			incoming.playSound("WhooshSuction");
		});

		// const highlight = new Instance("Highlight");
		// highlight.Name = `(${model.Name})-${TowerVisual.Tornado}`;
		// highlight.FillColor = Color3.fromRGB(250, 255, 176);
		// highlight.OutlineColor = Color3.fromRGB(250, 255, 176);
		// highlight.FillTransparency = 0.5;
		// highlight.OutlineTransparency = 1;
		// highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		// highlight.Adornee = instance;
		// highlight.Parent = debris;
		// bin.add(highlight);
		// const tween = TweenService.Create(highlight, info, {
		// 	FillTransparency: 1,
		// });
		// const delay = task.delay(1, (): void => tween.Play());
		// bin.add(soundDelay);
		// bin.add(tween);
		// bin.add(delay);
		bin.add(incoming);
		bin.add(shake);
		bin.add(thread);
		bin.add(effect);
	},
};
