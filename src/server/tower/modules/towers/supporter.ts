import { ItemId } from "shared/inventory/types";
import { StatusId } from "shared/statuses/types";
import { getTimestamp } from "shared/utility/functions/get-timestamp";
import { store } from "server/state/store";
import type { Tower } from "server/tower/class";
import type { TowerModule } from ".";

export const supporterTower: TowerModule<ItemId.Supporter> = {
	id: ItemId.Supporter,

	onAttack: (tower: Tower): void => {
		const towers = tower.getTowersInRange();
		for (const tower of towers) {
			const key = tower.getKey();
			const timestamp = getTimestamp();
			store.addStatus({ duration: 5, timestamp, id: StatusId.Buffed, stacks: 2 }, { user: key, broadcast: true });
		}
	},
};
