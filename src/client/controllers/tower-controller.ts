import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { PlacementController } from "./placement-controller";
import { Workspace } from "@rbxts/services";
import { clientProducer } from "client/state/producer";
import { selectInventoryData, selectPlacementState } from "client/state/selectors";
import type { OnStart } from "@flamework/core";
import type { TowerId } from "shared/types/ids";

const { placed } = Workspace;

@Controller({})
export class TowerController implements OnStart {
	public onStart(): void {
		PlacementController.onPlaced((placing: string, asset: Model): void => {
			const { slot } = clientProducer.getState(selectPlacementState);
			if (slot === undefined) {
				return;
			}
			const { equipped } = clientProducer.getState(selectInventoryData);
			const tower = equipped.get(slot);
			if (tower === undefined) {
				return;
			}
			const cframe = asset.GetPivot();
			// !! Raycast downward to confirm valid placement location
			// ...
			// !! Replicate tower placement
			// !! Below may be unnecessary if the tower class handles models
			// !! its self (recommended).
			const model = asset.Clone();
			model.Parent = placed;
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
}
