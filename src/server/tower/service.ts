import { Events } from "server/network";
import { PlayerUtility } from "shared/player/utility";
import { Service } from "@flamework/core";
import { Tower } from "server/tower/class";
import { TowerInventoryUtility } from "./util";
import { TowerUtility } from "shared/tower/utility";
import { isItemTowerUnique, isTowerItemId } from "shared/inventory/types";
import { isUUID } from "shared/guards";
import { itemDefinitions } from "shared/inventory/items";
import { selectCurrency, selectCurrentMap } from "shared/game/selectors";
import { selectTowersByOwner } from "shared/tower/selectors";
import { store } from "server/state/store";
import type { Entity } from "server/player/class";
import type { MapId } from "shared/map/types";
import type { OnPlayerRemoving } from "../player/service";
import type { OnStart } from "@flamework/core";
import type { ReplicatedTower, TowerTargeting } from "shared/tower/types";

@Service({})
export class TowerService implements OnStart, OnPlayerRemoving {
	protected placed = new Map<UUID, number>(); // Map<{Tower UUID}, number>;

	public onPlaceTower(player: Player, uuid: UUID, position: Vector3): void {
		const { placed } = this;
		const user = PlayerUtility.getUser(player);
		const currency = store.getState(selectCurrency(user));
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
		const count = placed.get(uuid) ?? 0;
		if (count >= limit || cost > currency) {
			return;
		}
		const index = count + 1;
		const key = `${uuid}_${index}`;
		const tower: ReplicatedTower = {
			id,
			index,
			key,
			owner: user,
			position,
			targeting: targeting[0],
			unique,
			upgrades: 1,
			uuid,
		};
		new Tower(tower);
		placed.set(uuid, index);
		store.towerPlace(tower, { user, broadcast: true });
		store.gameAddCurrency({ amount: -cost }, { user, broadcast: true });
	}

	public onPlayerRemoving(entity: Entity): void {
		const { user } = entity;
		const towers = store.getState(selectTowersByOwner(user));
		if (towers.isEmpty()) {
			return;
		}
		const { placed } = this;
		for (const { uuid, key } of towers) {
			const count = placed.get(uuid);
			if (count === undefined) {
				continue;
			}
			const tower = Tower.getTower(key);
			tower?.sellTower();
			placed.set(uuid, count - 1);
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
			const user = PlayerUtility.getUser(player);
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				return;
			}
			const { owner } = tower;
			if (user !== owner || !tower.isTargetingValid(targeting)) {
				return;
			}
			tower.setTargeting(targeting);
		});
		Events.tower.upgrade.connect((player: Player, key: string): void => {
			const user = PlayerUtility.getUser(player);
			const tower = Tower.getTower(key);
			const currency = store.getState(selectCurrency(user));
			if (tower === undefined) {
				return;
			}
			const replicated = tower.getReplicated();
			const cost = TowerUtility.getUpgradeCost(replicated);
			const { owner } = tower;
			if (user !== owner || cost > currency) {
				return;
			}
			store.gameAddCurrency({ amount: -cost }, { user, broadcast: true });
			tower.upgradeTower();
		});
		Events.tower.sell.connect((player: Player, key: string): void => {
			const { placed: placedTowers } = this;
			const user = PlayerUtility.getUser(player);
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				return;
			}
			const { uuid, owner } = tower;
			if (user !== owner) {
				return;
			}
			const placed = placedTowers.get(uuid) ?? 0;
			if (placed <= 0) {
				return;
			}
			placedTowers.set(uuid, placed - 1);
			tower.sellTower();
		});
	}
}
