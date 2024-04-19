import { Flamework } from "@flamework/core";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { TowerVisual } from "shared/tower/types";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "shared/mob/api";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerVisualModule } from ".";

const { debris } = Workspace;
const { assets } = ReplicatedStorage;
const { effects } = assets;

const info = new TweenInfo(2, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);

const guard = Flamework.createGuard<
	BasePart & {
		circle: Attachment;
		fire: Attachment;
	}
>();

const prefab = effects.FindFirstChild(TowerVisual.EDSummon);

export const edSummonVisual: TowerVisualModule<TowerVisual.EDSummon> = {
	id: TowerVisual.EDSummon,
	duration: 4,
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
		const thread = task.delay(1, (): void => {
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
