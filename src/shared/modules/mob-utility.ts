import { Collision } from "shared/types/enums";
import { ReplicatedStorage } from "@rbxts/services";
import { setCollision } from "shared/functions/set-collision";
import type { MobId } from "shared/types/ids";

const { assets } = ReplicatedStorage;
const { mobs } = assets;

export class MobUtility {
	protected static index = 0;

	public static getInstance(id: MobId): Model {
		const prefab = mobs.FindFirstChild(id);
		if (prefab === undefined || !prefab.IsA("Model")) {
			return new Instance("Model");
		}
		const model = prefab.Clone();
		setCollision(model, Collision.Mob);
		return model;
	}

	public static getIndex(increment = true): number {
		const { index } = this;
		this.index = index + (increment ? 1 : 0);
		return index;
	}

	public static setIndex(index: number): void {
		this.index = index;
	}
}
