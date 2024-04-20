import { ASSET_IDS } from "shared/assets/constants";
import { Collision, setCollision } from "shared/utility/collision";
import { Flamework } from "@flamework/core";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { SoundEmitter } from "shared/assets/sound";
import { TowerVisual } from "shared/tower/types";
import { VisualUtility, params } from "../utility";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "client/mob/class";
import type { TowerVisualModule } from ".";

const { assets } = ReplicatedStorage;
const { effects } = assets;

const guard = Flamework.createGuard<BasePart & { sky: Attachment; ground: Attachment & { light: PointLight } }>();
const prefab = effects.FindFirstChild(TowerVisual.HolyStrike);

const reverses = new TweenInfo(0.25, Enum.EasingStyle.Circular, Enum.EasingDirection.InOut, 0, true);
const fast = new TweenInfo(0.5, Enum.EasingStyle.Circular, Enum.EasingDirection.Out);
const info = new TweenInfo(2, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);
const priority = Enum.RenderPriority.Last.Value;

const { debris } = Workspace;
const camera = Workspace.CurrentCamera;

export const holyStrikeVisual: TowerVisualModule<TowerVisual.HolyStrike> = {
	id: TowerVisual.HolyStrike,
	duration: 4,

	onEffect: (bin: Bin, model: Model, target: Option<Mob>): void => {
		if (prefab === undefined || !guard(prefab) || target === undefined) {
			return;
		}
		const instance = target.getInstance();
		const pivot = instance.GetPivot();
		const point = pivot.Position;
		const origin = point.add(Vector3.yAxis.mul(30));
		const direction = Vector3.yAxis.mul(-35);
		const raycast = Workspace.Raycast(origin, direction, params);
		if (raycast === undefined) return;

		const effect = prefab.Clone();
		setCollision(effect, Collision.Debris, true);
		const { sky, ground } = effect;
		const { light } = ground;
		const incoming = new SoundEmitter(sky, {
			ThunderSpear: [ASSET_IDS.ThunderSpear],
			ElectricExplosion: [ASSET_IDS.ElectricExplosion],
		});
		incoming.playSound("ThunderSpear");

		const normal = raycast.Normal;
		const position = raycast.Position;
		const look = position.add(normal).Unit;
		const cframe = CFrame.fromMatrix(position, look.Cross(normal), normal);
		effect.CFrame = pivot;
		sky.WorldPosition = origin;
		ground.WorldCFrame = cframe;
		effect.Name = `(${model.Name})-${TowerVisual.HolyStrike}`;
		effect.Parent = debris;
		light.Enabled = true;
		const beams = sky.GetChildren();
		for (const beam of beams) {
			if (!beam.IsA("Beam")) {
				continue;
			}
			const tween = TweenService.Create(beam, reverses, {
				Width0: 65,
				Width1: 25,
			});
			tween.Play();
			bin.add(tween);
		}

		VisualUtility.onShake(priority, camera, 0, 0.25, 0.1, 0.1, 0.25);
		VisualUtility.emitRocks(bin, position, 15, 1, 1);

		const soundDelay = task.delay(0.1, (): void => {
			incoming.playSound("ElectricExplosion");
		});

		const highlight = new Instance("Highlight");
		highlight.Name = `(${model.Name})-${TowerVisual.HolyStrike}`;
		highlight.FillColor = Color3.fromRGB(250, 255, 176);
		highlight.OutlineColor = Color3.fromRGB(250, 255, 176);
		highlight.FillTransparency = 0.5;
		highlight.OutlineTransparency = 1;
		highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		highlight.Adornee = instance;
		highlight.Parent = debris;
		bin.add(highlight);

		const emitters = ground.GetChildren();
		for (const emitter of emitters) {
			if (!emitter.IsA("ParticleEmitter")) {
				continue;
			}
			VisualUtility.emitParticle(emitter, 25);
		}
		const lightning = TweenService.Create(light, fast, {
			Brightness: 0,
		});
		lightning.Play();
		const tween = TweenService.Create(highlight, info, {
			FillTransparency: 1,
		});
		const delay = task.delay(1, (): void => tween.Play());

		bin.add(incoming);
		bin.add(soundDelay);
		bin.add(tween);
		bin.add(delay);
		bin.add(effect);
	},
};
