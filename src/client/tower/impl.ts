import { Events } from "client/network";
import { Players } from "@rbxts/services";
import { Tower } from ".";
import { TowerUtility } from "shared/tower/utility";
import { itemDefinitions } from "shared/inventory";
import { selectCurrency } from "shared/game/selectors";
import { store } from "client/state/store";

const player = Players.LocalPlayer;
const { Name } = player;

export namespace TowerImpl {
	export function upgradeTower(key: string): void {
		const tower = Tower.getTower(key);
		const currency = store.getState(selectCurrency(Name));
		if (tower === undefined) {
			return;
		}
		const replicated = tower.getReplicated();
		const cost = TowerUtility.getUpgradeCost(replicated);
		if (cost > currency) {
			return;
		}
		Events.tower.upgrade(key);
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
