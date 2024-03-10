import { LEVEL_BASE_EXPERIENCE, LEVEL_EXPERIENCE_INTERVAL, LEVEL_GROWTH_RATE } from "shared/constants/level-constants";

export namespace LevelFunctions {
	export function getMaxExp(level: number): number {
		const required = math.floor(LEVEL_BASE_EXPERIENCE * level) ** LEVEL_GROWTH_RATE;
		const interval = LEVEL_EXPERIENCE_INTERVAL * math.ceil(required / LEVEL_EXPERIENCE_INTERVAL);
		return interval;
	}

	export function levelUp(start: number, exp: number): [level: number, exp: number] {
		if (exp === math.huge) {
			return [1, 0];
		}
		let level = start;
		let required = getMaxExp(level);
		let leftover = exp;
		while (leftover >= required) {
			level += 1;
			leftover -= required;
			required = getMaxExp(level);
		}
		return [level, leftover];
	}
}
