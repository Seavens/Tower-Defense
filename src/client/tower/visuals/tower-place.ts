import { TowerVisual } from "shared/tower/types";
import type { Bin } from "@rbxts/bin";
import type { TowerVisualModule } from ".";

export const towerPlaceModule: TowerVisualModule<TowerVisual.TowerPlace> = {
	id: TowerVisual.TowerPlace,
	duration: 0.4,
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
		particleEmitter.Lifetime = new NumberRange(0.4);
		particleEmitter.Rate = 1;
		particleEmitter.EmissionDirection = Enum.NormalId.Top;
		particleEmitter.Speed = new NumberRange(18);
		particleEmitter.Shape = Enum.ParticleEmitterShape.Disc;
		particleEmitter.ShapePartial = 1;
		particleEmitter.ShapeStyle = Enum.ParticleEmitterShapeStyle.Surface;
		particleEmitter.Drag = 5;
		particleEmitter.Acceleration = new Vector3(0, -225, 0);
		particleEmitter.ZOffset = -2;
		particleEmitter.Emit(1);

		bin.add(particleEmitter);
	},
};
