import { TowerAbility } from "shared/inventory/towers/abilities/types";
import { atomicVoidAbility } from "./atomic-void";
import { godSpeakAbility } from "./god-speak";
import type { Mob } from "server/mob/class";
import type { Tower } from "server/tower/class";

export interface AbilityModule<I extends TowerAbility> {
	id: I;

	getTarget: (tower: Tower) => Option<Mob | Tower>;
	useAbility: (tower: Tower, target: Option<Mob | Tower>) => void;
}

export const abilityModules: { [A in TowerAbility]?: AbilityModule<A> } = {
	[TowerAbility.GodSpeak]: godSpeakAbility,
	[TowerAbility.AtomicVoid]: atomicVoidAbility,
};
