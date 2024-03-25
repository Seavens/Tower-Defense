import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { Mob } from "client/mob/class";
import { PlacementController } from "client/placement/controller";
import { Tower } from "client/tower/class";
import { selectInventoryData } from "client/inventory/selectors";
import { selectPlacedTowers } from "shared/tower/selectors";
import { selectPlacementState } from "client/placement/selectors";
import { store } from "client/state/store";
import type { OnStart, OnTick } from "@flamework/core";
import type { ReplicatedTower } from "shared/tower/types";

@Controller({})
export class TowerController implements OnStart, OnTick {
	public onStart(): void {
		PlacementController.onPlaced(async (placing: string, asset: Model): Promise<void> => {
			const { slot } = store.getState(selectPlacementState);
			if (slot === undefined) {
				return;
			}
			const { equipped } = store.getState(selectInventoryData);
			const tower = equipped.get(slot);
			if (tower === undefined) {
				return;
			}
			const { uuid } = tower;
			const cframe = asset.GetPivot();
			const position = cframe.Position;
			// !! Raycast downward to confirm valid placement location
			Events.replicatePlaceTower(uuid, position);
			store.endPlacement({});
		});
		store.observe(
			selectPlacedTowers,
			(_: ReplicatedTower, key: string): defined => key,
			({ id, uuid, index, owner, position, upgrades }: ReplicatedTower, key: string): (() => void) => {
				const cframe = new CFrame(position);
				const tower = new Tower(id, uuid, index, cframe, upgrades);
				return (): void => {
					tower.destroy();
				};
			},
		);
		Events.replicateTowerTarget.connect((key: string, target?: number): void => {
			if (target === undefined) {
				return;
			}
			const tower = Tower.getTower(key);
			const mob = Mob.getMob(target);
			if (tower === undefined || mob === undefined) {
				return;
			}
			const cframe = mob.getCFrame();
			const position = cframe.Position;
			tower.rotateToTarget(position);
		});
		// !! Consider allowing for hotkey'ing to towers, ie; pressing `1` would select the 1st tower and begin placement.
	}

	public onTick(): void {}
}
