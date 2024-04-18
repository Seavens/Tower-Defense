import { ItemId } from "shared/inventory/types";
import { itemDefinitions } from "shared/inventory";
import { store } from "server/state/store";
import type { Tower } from "server/tower/class";
import type { TowerModule } from ".";

export const farmerTower: TowerModule<ItemId.Farmer> = {
	id: ItemId.Farmer,

	onAttack: (tower: Tower): void => {
		const replicated = tower.getReplicated();
		const { id, upgrades: upgrade, owner: user } = replicated;
		const { kind } = itemDefinitions[id];
		const { income, upgrades } = kind;
		let multiplier: Option<number>;
		if (upgrade > 0) {
			({
				multiplier: { income: multiplier },
			} = upgrades[upgrade - 1]);
		}
		multiplier ??= 0;
		const amount = income! * (1 + multiplier);
		store.gameAddCurrency({ amount }, { user, broadcast: true });
	},
};
