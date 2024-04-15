import { Collision, setCollision } from "shared/utility/collision";
import { HEALTH_INCREASE, WAVE_GROWTH } from "shared/waves/constants";
import { ReplicatedStorage } from "@rbxts/services";
import { mobDefinitions } from "./definitions";
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
		setCollision(model, Collision.Mob, true);
		return model;
	}

	export function getMobHealth(id: MobId, wave: number): number {
		const { health } = mobDefinitions[id];
		return math.ceil(math.round(health + health * (HEALTH_INCREASE * wave)));
	}
}
