import { TowerTargeting } from "./types";

export const TOWER_TARGETING_DISPLAY: { [T in TowerTargeting]: string } = {
	[TowerTargeting.First]: "First",
	[TowerTargeting.Last]: "Last",
	[TowerTargeting.Strongest]: "Strongest",
	[TowerTargeting.Weakest]: "Weakest",
	[TowerTargeting.Closest]: "Closest",
	[TowerTargeting.Farthest]: "Farthest",
} as const;
