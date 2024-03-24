import { Controller } from "@flamework/core";
import { Events, Functions } from "client/network";
import { PlacementController } from "./placement-controller";
import { Tower } from "client/classes/tower";
import { Workspace } from "@rbxts/services";
import { clientProducer } from "client/state/producer";
import { selectInventoryData, selectPlacementState } from "client/state/selectors";
import type { OnStart, OnTick } from "@flamework/core";
import type { TowerId } from "shared/types/ids";

const { placed } = Workspace;

@Controller({})
export class TowerController implements OnStart, OnTick {
	public onStart(): void {
		PlacementController.onPlaced(async (placing: string, asset: Model): Promise<void> => {
			const { slot } = clientProducer.getState(selectPlacementState);
			if (slot === undefined) {
				return;
			}
			const { equipped } = clientProducer.getState(selectInventoryData);
			const tower = equipped.get(slot);
			if (tower === undefined) {
				return;
			}
			const { id, uuid } = tower;
			const cframe = asset.GetPivot();
			// !! Raycast downward to confirm valid placement location
			// ...
			// !! Replicate tower placement
			// !! Below may be unnecessary if the tower class handles models
			// !! its self (recommended).
			Functions.requestPlaceTower(id, cframe).then((success: boolean): void => {
				if (!success) {
					return;
				}
				new Tower(id, uuid, cframe, tower);
			});
			//
			clientProducer.endPlacement({});
		});
		// !! Listen to server confirmation of a tower placement.
		Events.replicateTowerPlacement.connect((id: TowerId, position: Vector3, owner: string): void => {
			// ...
			// !! Create new tower instance.
			// !! new Tower(...);
		});
		// !! Consider allowing for hotkey'ing to towers, ie; pressing `1` would select the 1st tower and begin placement.
	}
	public onTick(): void {}
}
