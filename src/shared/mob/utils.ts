import { Collision, setCollision } from "shared/utils/collision";
import { ReplicatedStorage } from "@rbxts/services";
import type { MobId } from "./types";

const { assets } = ReplicatedStorage;
const { mobs } = assets;

let index = 0;

export namespace MobUtil {
	export function getMobModel(id: MobId): Model {
		const prefab = mobs.FindFirstChild(id);
		if (prefab === undefined || !prefab.IsA("Model")) {
			return new Instance("Model");
		}
		const model = prefab.Clone();
		setCollision(model, Collision.Mob);
		return model;
	}

	export function getMobIndex(increment = true): number {
		const current = index;
		index = index + (increment ? 1 : 0);
		return current;
	}

	export function setMobIndex(value: number): void {
		index = value;
	}
}
