import { TowerGrade, TowerTargeting } from "./types";

export const TOWER_TARGETING_DISPLAY: { [T in TowerTargeting]: string } = {
	[TowerTargeting.First]: "First",
	[TowerTargeting.Last]: "Last",
	[TowerTargeting.Strongest]: "Strongest",
	[TowerTargeting.Weakest]: "Weakest",
	[TowerTargeting.Closest]: "Closest",
	[TowerTargeting.Farthest]: "Farthest",
} as const;

export const TOWER_GRADE_DISPLAY: { [G in TowerGrade]: string } = {
	[TowerGrade.S]: "S",
	[TowerGrade.A]: "A",
	[TowerGrade.B]: "B",
	[TowerGrade.C]: "C",
	[TowerGrade.D]: "D",
} as const;

export const TOWER_GRADE_RANGES: { [G in TowerGrade]: [max: number, min: number] } = {
	[TowerGrade.S]: [1, 0.9],
	[TowerGrade.A]: [0.89, 0.75],
	[TowerGrade.B]: [0.74, 0.48],
	[TowerGrade.C]: [0.47, 0.18],
	[TowerGrade.D]: [0.17, 0],
} as const;

export const SELL_RATIO = 0.35;

export const MAX_TOWER_LEVEL = 100;

export const TOWER_BASE_EXPERIENCE = 100;
export const TOWER_GROWTH_RATE = 1.35;
export const TOWER_EXPERIENCE_INTERVAL = 100;

export const TOWER_LEVEL_MULTIPLIER = 0.5;
