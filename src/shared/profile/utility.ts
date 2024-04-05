import { PROFILE_BASE_EXPERIENCE, PROFILE_EXPERIENCE_INTERVAL, PROFILE_GROWTH_RATE } from "./constants";
import { TOWER_BASE_EXPERIENCE, TOWER_EXPERIENCE_INTERVAL, TOWER_GROWTH_RATE } from "shared/tower/constants";

export namespace LevelUtility {
	export function getMaxExp(level: number, tower?: boolean): number {
		if (level >= 100) {
			return level;
		}
		const required =
			math.floor((tower === undefined ? PROFILE_BASE_EXPERIENCE : TOWER_BASE_EXPERIENCE) * level) **
			(tower === undefined ? PROFILE_GROWTH_RATE : TOWER_GROWTH_RATE);
		const interval =
			tower === undefined
				? PROFILE_EXPERIENCE_INTERVAL
				: TOWER_EXPERIENCE_INTERVAL *
					math.ceil(
						required / (tower === undefined ? PROFILE_EXPERIENCE_INTERVAL : TOWER_EXPERIENCE_INTERVAL),
					);
		return interval;
	}

	export function calculateIncrease(startLevel: number, exp: number, tower?: boolean): [level: number, exp: number] {
		if (exp === math.huge) {
			return [1, 0];
		}
		let level = startLevel;
		let required = getMaxExp(level, tower === undefined ? false : true);
		let leftover = exp;
		while (leftover >= required) {
			level += 1;
			leftover -= required;
			required = getMaxExp(level, tower === undefined ? false : true);
		}
		return [level, leftover];
	}
}
