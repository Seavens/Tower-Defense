import { Collision, setCollision } from "shared/utility/collision";
import { ReplicatedStorage } from "@rbxts/services";
import type { MobId } from "./types";

const { assets } = ReplicatedStorage;
const { mobs } = assets;

export namespace MobUtility {
	export function getMobModel(id: MobId): Model {
		const prefab = mobs.FindFirstChild(id);
		if (prefab === undefined || !prefab.IsA("Model")) {
			return new Instance("Model");
		}
		const model = prefab.Clone();
		setCollision(model, Collision.Mob);
		return model;
	}
}
