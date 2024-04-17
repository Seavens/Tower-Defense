import { Events } from "server/network";
import { Service } from "@flamework/core";
import { Tower } from "server/tower/class";
import { TowerInventoryUtility } from "./utility";
import { TowerUtility } from "shared/tower/utility";
import { isItemTowerUnique, isTowerItemId } from "shared/inventory/types";
import { isUUID } from "shared/utility/guards";
import { itemDefinitions } from "shared/inventory";
import { selectCurrency, selectCurrentMap } from "shared/game/selectors";
import { selectTowersByOwner } from "shared/tower/selectors";
import { store } from "server/state/store";
import type { MapId } from "shared/game/map/types";
import type { OnPlayerRemoving } from "server/players/service";
import type { OnStart } from "@flamework/core";
import type { ReplicatedTower, TowerTargeting } from "shared/tower/types";
import type { TowerAbility } from "shared/inventory/towers/abilities/types";

@Service({})
export class TowerService implements OnStart, OnPlayerRemoving {
	protected placed = new Map<UUID, Array<number>>();

	public onPlaceTower(player: Player, uuid: UUID, position: Vector3): void {
		const { placed } = this;
		const { Name } = player;
		const currency = store.getState(selectCurrency(Name));
		const item = TowerInventoryUtility.getTowerItem(player, uuid);
		if (item === undefined) {
			return;
		}
		const { id, unique } = item;
		if (!isTowerItemId(id) || !isItemTowerUnique(unique)) {
			return;
		}
		const { kind } = itemDefinitions[id];
		const { cost, limit, targeting } = kind;
		let indices = placed.get(uuid);
		if (indices === undefined) {
			indices = new Array<number>();
			placed.set(uuid, indices);
		}
		const count = indices.size();
		if (count >= limit || cost > currency) {
			return;
		}
		let index: Option<number>;
		for (const i of $range(1, limit)) {
			if (indices.includes(i)) {
				continue;
			}
			index = i;
			break;
		}
		if (index === undefined) {
			return;
		}
		const key = `${uuid}_${index}`;
		const tower: ReplicatedTower = {
			id,
			index,
			key,
			owner: Name,
			position,
			targeting: targeting[0],
			unique,
			upgrades: 1,
			uuid,
		};
		new Tower(tower);
		indices.push(index);
		store.towerPlace(tower, { user: Name, broadcast: true });
		store.gameAddCurrency({ amount: -cost }, { user: Name, broadcast: true });
	}

	public onPlayerRemoving(player: Player): void {
		const { Name } = player;
		const towers = store.getState(selectTowersByOwner(Name));
		if (towers.isEmpty()) {
			return;
		}
		const { placed } = this;
		for (const { uuid, key } of towers) {
			const indices = placed.get(uuid);
			if (indices === undefined) {
				continue;
			}
			const tower = Tower.getTower(key);
			tower?.sellTower();
			placed.delete(uuid);
		}
	}

	public onStart(): void {
		store.subscribe(selectCurrentMap, (map: Option<MapId>): void => {
			const { placed: placedTowers } = this;
			placedTowers.clear();
		});
		Events.tower.place.connect((player: Player, uuid: string, position: Vector3): void => {
			if (!isUUID(uuid)) {
				return;
			}
			this.onPlaceTower(player, uuid, position);
		});
		Events.tower.targeting.connect((player: Player, key: string, targeting: TowerTargeting): void => {
			const { Name } = player;
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				return;
			}
			const { owner } = tower;
			if (Name !== owner || !tower.isTargetingValid(targeting)) {
				return;
			}
			tower.setTargeting(targeting);
		});
		Events.tower.upgrade.connect((player: Player, key: string): void => {
			const { Name } = player;
			const tower = Tower.getTower(key);
			const currency = store.getState(selectCurrency(Name));
			if (tower === undefined) {
				return;
			}
			const replicated = tower.getReplicated();
			const cost = TowerUtility.getUpgradeCost(replicated);
			const { owner } = tower;
			if (Name !== owner || cost > currency) {
				return;
			}
			store.gameAddCurrency({ amount: -cost }, { user: Name, broadcast: true });
			tower.upgradeTower();
		});
		Events.tower.sell.connect((player: Player, key: string): void => {
			const { placed: placedTowers } = this;
			const { Name } = player;
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				return;
			}
			const { uuid, owner, index } = tower;
			if (Name !== owner) {
				return;
			}
			const indices = placedTowers.get(uuid);
			if (indices === undefined) {
				return;
			}
			const i = indices.indexOf(index);
			indices.remove(i);
			tower.sellTower();
		});
		Events.tower.ability.connect((player: Player, ability: TowerAbility): void => {
			warn("Implement abilities bruh!");
		});
	}
}
