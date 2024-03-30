import { Events } from "client/network";
import { Tower } from "./class";
import { itemDefinitions } from "shared/inventory/items";

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
			warn("TowerImpl.upgradeTower: Upgrades exceed maximum.");
			return;
		}

		tower.upgradeRange();
		Events.tower.upgrade(key);
	}
}
