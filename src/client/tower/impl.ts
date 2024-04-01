import { Events } from "client/network";
import { PlayerUtil } from "shared/player/utils";
import { Players } from "@rbxts/services";
import { Tower } from "./class";
import { TowerUtil } from "shared/tower/utils";
import { itemDefinitions } from "shared/inventory/items";
import { selectCurrency } from "shared/game/selectors";
import { store } from "client/state/store";

const player = Players.LocalPlayer;
const user = PlayerUtil.getUser(player);

export namespace TowerImpl {
	export function upgradeTower(key: string): void {
		const tower = Tower.getTower(key);
		const currency = store.getState(selectCurrency(user));
		if (tower === undefined) {
			return;
		}
		const replicated = tower.getReplicated();
		const cost = TowerUtil.getUpgradeCost(replicated);
		if (cost > currency) {
			return;
		}
		Events.tower.upgrade(key);

		// const def = itemDefinitions[tower.id];
		// if (def === undefined || currency < def.kind.cost) {
		// 	return;
		// }

		// const { id } = tower;
		// const index = tower.getUpgrades();
		// const { kind } = itemDefinitions[id];
		// const { upgrades } = kind;
		// if (index >= upgrades.size()) {
		// 	return;
		// }

		// tower.upgradeRange();
		// Events.tower.upgrade(key);
	}

	export function changeTargeting(key: string): void {
		const tower = Tower.getTower(key);
		if (tower === undefined) {
			return;
		}

		const { kind } = itemDefinitions[tower.id];
		const { targeting: allowed } = kind;

		let index = allowed.indexOf(tower.getTargeting());
		if (index >= allowed.size()) {
			index = 0;
		}
		const targeting = allowed[(index + 1) % allowed.size()];
		Events.tower.targeting(key, targeting);
	}

	export function sellTower(key: string): void {
		const tower = Tower.getTower(key);
		if (tower === undefined) {
			return;
		}
		Events.tower.sell(key);
		store.deselectTower({});
	}
}
