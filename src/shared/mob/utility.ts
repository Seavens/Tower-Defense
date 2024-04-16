import { Collision, setCollision } from "shared/utility/collision";
import { MAP_DIFFICULTY_MULTIPLIERS } from "shared/map/constants";
import { MapDifficulty } from "shared/map/types";
import { ReplicatedStorage } from "@rbxts/services";
import { WAVE_GROWTH } from "shared/waves/constants";
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

	export function getMobHealth(id: MobId, wave: number, difficulty = MapDifficulty.Easy): number {
		const multiplier = MAP_DIFFICULTY_MULTIPLIERS[difficulty];
		const { health } = mobDefinitions[id];
		return math.round((health + wave ** (WAVE_GROWTH + multiplier)) / 5) * 5;
	}
}
