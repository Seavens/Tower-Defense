import { Bin } from "@rbxts/bin";
import { TowerDefinitions } from "shared/definitions/towers";
import type { TowerDefinition } from "shared/types/definitions";
import type { TowerId } from "shared/types/ids";
import type { TowerObject } from "shared/types/objects";
export abstract class Tower {
	protected placed = false;
	protected bin = new Bin();

	public constructor(towerObj: TowerObject) {
		this.placed = true;
	}

	public destory(): void {
		if (this.placed !== true) {
			return;
		}
		this.bin.destroy();
		this.placed = false;
	}
}
