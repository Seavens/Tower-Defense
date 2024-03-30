import { Events } from "client/network";
import { Tower } from "./class";
import { itemDefinitions } from "shared/inventory/items";
import { store } from "client/state/store";

export namespace TowerImpl {
	export function upgradeTower(key: string): void {
		const tower = Tower.getTower(key);
		if (tower === undefined) {
			return;
		}
		const { id } = tower;
		const index = tower.getUpgrades();
		const { kind } = itemDefinitions[id];
		const { upgrades } = kind;
		if (index >= upgrades.size()) {
			return;
		}

		tower.upgradeRange();
		Events.tower.upgrade(key);
	}

	export function changeTargeting(key: string): void {
		const tower = Tower.getTower(key);
		if (tower === undefined) {
			return;
		}

		const { kind } = itemDefinitions[tower.id];
		const { targeting: valid } = kind;

		let index = valid.indexOf(tower.getTargeting());
		if (index >= valid.size()) {
			index = 0;
		}

		const targeting = valid[(index + 1) % valid.size()];
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
