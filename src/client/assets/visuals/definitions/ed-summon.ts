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
		circle: Attachment & { inner: ParticleEmitter; outter: ParticleEmitter; circle: ParticleEmitter };
		fire: Attachment & { emitter: ParticleEmitter };
	}
>();

const prefab = effects.FindFirstChild(TowerVisual.EDSummon);

export const edSummonVisual: TowerVisualModule<TowerVisual.EDSummon> = {
	id: TowerVisual.EDSummon,
	duration: 2,
	onEffect: (bin: Bin, model: Model, target: Option<Mob>, tower: ReplicatedTower): void => {
		if (prefab === undefined || !guard(prefab) || target === undefined) {
			return;
		}
		const instance = model.GetPivot();
		const point = instance.Position;
		const effect = prefab.Clone();
		effect.Parent = debris;
		effect.Position = point;
	},
};
