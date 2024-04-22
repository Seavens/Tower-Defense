import { AssetController } from "client/assets/controller";
import { CollectionService } from "@rbxts/services";
import { Collision } from "shared/utility/collision";
import { StatusId } from "shared/statuses/types";
import { t } from "@rbxts/t";
import type { Mob } from "client/mob/class";
import type { Status, StatusKind } from "shared/statuses/types";
import type { StatusModule } from ".";
import type { Tower } from "client/tower";

const isBasePart = t.instanceIsA("BasePart");

export const buffedStatus: StatusModule<StatusId.Buffed> = {
	id: StatusId.Buffed,

	onAdded: (object: Mob | Tower, { id }: Status, kind: StatusKind): void => {
		const asset = AssetController.getAsset("effects", id, isBasePart);
		if (asset === undefined) {
			return;
		}
		const effects = CollectionService.GetTagged(id);
		const instance = object.getInstance();
		for (const effect of effects) {
			if (!effect.IsDescendantOf(instance)) {
				continue;
			}
			return;
		}
		const effect = asset.Clone();
		effect.CollisionGroup = Collision.Debris;
		effect.CanCollide = false;
		effect.Anchored = true;
		effect.CFrame = instance.GetPivot();
		effect.Parent = instance;
		effect.AddTag(id);
	},
	onTick: (object: Mob | Tower, status: Status, kind: StatusKind): void => {
		//
	},
	onRemove: (object: Mob | Tower, { id }: Status, kind: StatusKind): void => {
		const effects = CollectionService.GetTagged(id);
		const instance = object.getInstance();
		for (const effect of effects) {
			if (!effect.IsDescendantOf(instance)) {
				continue;
			}
			effect.Destroy();
			break;
		}
	},
};
