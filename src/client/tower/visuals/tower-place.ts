import { TowerVisual } from "shared/tower/types";
import { TweenService } from "@rbxts/services";
import type { Bin } from "@rbxts/bin";
import type { TowerVisualModule } from ".";

const info = new TweenInfo(2, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);

export const towerPlaceModule: TowerVisualModule<TowerVisual.TowerPlace> = {
	id: TowerVisual.TowerPlace,
	duration: 2,
	onEffect: (bin: Bin, model: Model): void => {
		const rootPart = model.FindFirstChild("HumanoidRootPart");
		if (!rootPart) return;
		rootPart.Parent = model;

		warn("TowerPlace effect");
		const particleEmitter = new Instance("ParticleEmitter");
		particleEmitter.Parent = rootPart;

		particleEmitter.Brightness = 1;
		particleEmitter.LightEmission = 1;
		particleEmitter.Orientation = Enum.ParticleOrientation.VelocityPerpendicular;
		particleEmitter.Size = new NumberSequence(0.1, 30);
		particleEmitter.Transparency = new NumberSequence([
			new NumberSequenceKeypoint(0, 0),
			new NumberSequenceKeypoint(0.5, 1),
			new NumberSequenceKeypoint(1, 1),
		]);
		particleEmitter.Texture = "rbxassetid://17097745234";
		particleEmitter.Color = new ColorSequence(new Color3(1, 1, 1));
		particleEmitter.Lifetime = new NumberRange(2);
		particleEmitter.Rate = 1;
		particleEmitter.EmissionDirection = Enum.NormalId.Top;
		particleEmitter.Speed = new NumberRange(35);
		particleEmitter.Shape = Enum.ParticleEmitterShape.Disc;
		particleEmitter.ShapePartial = 1;
		particleEmitter.ShapeStyle = Enum.ParticleEmitterShapeStyle.Surface;
		particleEmitter.Drag = 5;
		particleEmitter.Acceleration = new Vector3(0, -180, 0);
		particleEmitter.ZOffset = -2;
		particleEmitter.Enabled = false;
		particleEmitter.Emit(1);

		const highlight = new Instance("Highlight");
		highlight.Parent = model;
		highlight.FillColor = new Color3(1, 1, 1);
		highlight.OutlineTransparency = 1;
		highlight.FillTransparency = 0.5;
		highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		const tween = TweenService.Create(highlight, info, {
			FillTransparency: 1,
		});
		tween.Play();

		bin.add(tween);
		bin.add(highlight);
		bin.add(particleEmitter);
	},
};
