import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { Mob } from "client/classes/mob";
import { PlacementController } from "./placement-controller";
import { Tower } from "client/classes/tower";
import { clientProducer } from "client/state/producer";
import { selectInventoryData, selectPlacementState } from "client/state/selectors";
import { selectPlacedTowers } from "shared/state/selectors";
import type { OnStart, OnTick } from "@flamework/core";
import type { ReplicatedTower } from "shared/types/objects";

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
			const { uuid } = tower;
			const cframe = asset.GetPivot();
			const position = cframe.Position;
			// !! Raycast downward to confirm valid placement location
			Events.replicatePlaceTower(uuid, position);
			clientProducer.endPlacement({});
		});
		clientProducer.observe(
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
