import { Events } from "client/network";
import { Tower } from "./class";
import { itemDefinitions } from "shared/inventory/items";
import { useTowerDefintion } from "client/ui/tower/hooks";

export namespace TowerImpl {
	export function upgradeTower(key: string): void {
		const tower = Tower.getTower(key);
		if (tower === undefined) {
			return;
		}

		const upgrades = tower.getUpgrades();
		const { kind } = itemDefinitions[tower.id];

		if (upgrades >= kind.upgrades.size()) {
			warn("TowerImpl.upgradeTower: Upgrades exceed maximum.");
			return;
		}

		tower.upgradeRange();
		Events.tower.upgrade(key);
	}
}
