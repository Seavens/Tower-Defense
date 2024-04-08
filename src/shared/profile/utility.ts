import { PROFILE_BASE_EXPERIENCE, PROFILE_GROWTH_RATE } from "./constants";
import { TOWER_BASE_EXPERIENCE, TOWER_GROWTH_RATE } from "shared/tower/constants";

export namespace LevelUtility {
	export function getMaxExp(level: number, tower = false): number {
		if (level >= 100) return level;

		const baseExperience = tower ? TOWER_BASE_EXPERIENCE : PROFILE_BASE_EXPERIENCE;
		const growthRate = tower ? TOWER_GROWTH_RATE : PROFILE_GROWTH_RATE;

		return math.floor(baseExperience * math.pow(growthRate, level - 1));
	}

	export function calculateIncrease(startLevel: number, exp: number, tower = false): [level: number, exp: number] {
		if (exp === math.huge) {
			return [1, 0];
		}
		let level = startLevel;
		let required = getMaxExp(level, tower);
		let leftover = exp;
		while (leftover >= required) {
			level += 1;
			leftover -= required;
			required = getMaxExp(level, tower);
		}
		return [level, leftover];
	}
}
