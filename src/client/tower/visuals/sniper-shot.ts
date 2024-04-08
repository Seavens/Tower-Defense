import { TowerVisual } from "shared/tower/types";
import { Workspace } from "@rbxts/services";
import { mobDefinitions } from "shared/mob/mobs";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "shared/mob/api";
import type { TowerVisualModule } from ".";

const terrain = Workspace.Terrain;

export const sniperShotModule: TowerVisualModule<TowerVisual.SniperShot> = {
	id: TowerVisual.SniperShot,
	duration: 1,
	onEffect: (bin: Bin, model: Model, target: Option<Mob>): void => {
		if (target === undefined) {
			return;
		}
		const mobDef = mobDefinitions[target.id];
		const { height } = mobDef;
		const pivot = model.GetPivot();
		const cframe = target?.getCFrame().mul(new CFrame(0, height, 0));
		const attachment0 = new Instance("Attachment");
		attachment0.Name = "sniper-shot-attachment0";
		attachment0.WorldCFrame = pivot;
		attachment0.Parent = terrain;
		const attachment1 = new Instance("Attachment");
		attachment1.Name = "sniper-shot-attachment1";
		attachment1.WorldCFrame = cframe;
		attachment1.Parent = terrain;
		const beam = new Instance("Beam");
		beam.Name = "sniper-shot-beam";
		beam.Attachment0 = attachment0;
		beam.Attachment1 = attachment1;
		beam.Width0 = 0.1;
		beam.Width1 = 0.1;
		beam.Brightness = 10;
		beam.Parent = attachment0;

		bin.add(beam);
		bin.add(attachment0);
		bin.add(attachment1);
	},
};
