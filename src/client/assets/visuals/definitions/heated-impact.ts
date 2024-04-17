import { ColorUtil } from "client/ui/utility";
import { TowerVisual } from "shared/tower/types";
import { TweenService } from "@rbxts/services";
import { itemDefinitions } from "shared/inventory";
import { rarityDefinitions } from "shared/inventory/rarities";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "shared/mob/api";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerVisualModule } from ".";

const info = new TweenInfo(2, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);

export const heatedImpactVisual: TowerVisualModule<TowerVisual.HeatedImpact> = {
	id: TowerVisual.HeatedImpact,
	duration: 2,
	onEffect: (bin: Bin, model: Model, target: Option<Mob>, tower: ReplicatedTower): void => {
		const rootPart = model.FindFirstChild("HumanoidRootPart");
		if (!rootPart) return;
		rootPart.Parent = model;
		const { id } = tower;
		const def = itemDefinitions[id];
		const { rarity } = def;
		const { color } = rarityDefinitions[rarity];

		const particleEmitter = new Instance("ParticleEmitter");
		particleEmitter.Parent = rootPart;

		particleEmitter.Brightness = 0.5;
		particleEmitter.LightEmission = 0.5;
		particleEmitter.Orientation = Enum.ParticleOrientation.FacingCamera;
		particleEmitter.EmissionDirection = Enum.NormalId.Top;
		particleEmitter.Size = new NumberSequence(3, 1);
		particleEmitter.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0),
			new NumberSequenceKeypoint(0.5, 1),
			new NumberSequenceKeypoint(1, 1),
		]);
		particleEmitter.Texture = "rbxassetid://17164073691";
		particleEmitter.Color = new ColorSequence(color);
		particleEmitter.Lifetime = new NumberRange(2, 4);
		particleEmitter.Rate = 10;
		particleEmitter.Speed = new NumberRange(5, 50);
		particleEmitter.Shape = Enum.ParticleEmitterShape.Sphere;
		particleEmitter.ShapePartial = 1;
		particleEmitter.ShapeStyle = Enum.ParticleEmitterShapeStyle.Surface;
		particleEmitter.Drag = 50;
		particleEmitter.Acceleration = new Vector3(0, 50, 0);
		particleEmitter.Enabled = false;
		particleEmitter.Emit(30);

		const highlight = new Instance("Highlight");
		highlight.Parent = model;
		highlight.FillColor = color;
		highlight.OutlineColor = ColorUtil.darken(color, 0.5);
		highlight.OutlineTransparency = 0.5;
		highlight.FillTransparency = 0.5;
		highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		const tween = TweenService.Create(highlight, info, {
			FillTransparency: 1,
			OutlineTransparency: 1,
		});

		tween.Play();
		bin.add(tween);
		bin.add(highlight);
		bin.add(particleEmitter);
	},
};
