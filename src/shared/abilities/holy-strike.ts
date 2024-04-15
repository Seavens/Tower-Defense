import { TowerAbility } from ".";
import { TowerVisual } from "shared/tower/types";
import type { AbilityDefinition } from ".";

export const holyStrikeAbility: AbilityDefinition<TowerAbility.HolyStrike> = {
	id: TowerAbility.HolyStrike,
	name: "Holy Strike",
	desc: "...",

	visual: [TowerVisual.HolyStrike],
	damage: 1,
	cooldown: 1,
	range: 1,
};
