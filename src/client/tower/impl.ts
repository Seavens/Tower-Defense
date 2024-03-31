import { Events } from "client/network";
import { Players } from "@rbxts/services";
import { Tower } from "./class";
import { getUser } from "shared/player/utility";
import { itemDefinitions } from "shared/inventory/items";
import { selectCurrency } from "shared/game/selectors";
import { store } from "client/state/store";

const player = Players.LocalPlayer;
const user = getUser(player);

export namespace TowerImpl {
	export function upgradeTower(key: string): void {
		const tower = Tower.getTower(key);
		const currency = store.getState(selectCurrency(user));
		if (tower === undefined) {
			return;
		}

		const def = itemDefinitions[tower.id];
		if (def === undefined || currency <= def.kind.cost) {
			return;
		}

		const { id } = tower;
		const index = tower.getUpgrades();
		const { kind } = itemDefinitions[id];
		const { upgrades } = kind;
		if (index >= upgrades.size() || currency <= upgrades[index][2]) {
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
