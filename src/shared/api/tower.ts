import type { Draft } from "@rbxts/immut/src/types-external";
import type { TowerObject } from "shared/types/objects";
export abstract class Tower {
	public constructor(towerObj: TowerObject) {}

	public attack(): void {
		// Attack logic
	}

	public targeting(): void {
		// Targeting logic
	}

	public sell(): void {
		// Sell logic
	}

	public upgrade(): void {
		// Upgrade logic
	}
}
