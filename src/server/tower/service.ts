import { Events } from "server/network";
import { ItemKind, isTowerItemId } from "shared/inventory/types";
import { Service } from "@flamework/core";
import { Tower } from "server/tower/class";
import { getUser } from "shared/player/utility";
import { isUUID } from "shared/guards";
import { itemDefinitions } from "shared/inventory/items";
import { selectCurrentMap } from "shared/game/selectors";
import { selectInventoryData } from "server/inventory/selectors";
import { selectTowersByOwner } from "shared/tower/selectors";
import { store } from "server/state/store";
import type { Entity } from "server/player/class";
import type { Item } from "shared/inventory/types";
import type { MapId } from "shared/map/types";
import type { OnPlayerRemoving } from "../player/service";
import type { OnStart } from "@flamework/core";
import type { ReplicatedTower, TowerTargeting } from "shared/tower/types";

@Service({})
export class TowerService implements OnStart, OnPlayerRemoving {
	protected placed = new Map<UUID, number>(); // Map<{Tower UUID}, number>;

	public onPlaceTower(player: Player, uuid: UUID, position: Vector3): void {
		const user = getUser(player);
		const { equipped } = store.getState(selectInventoryData(user));
		let result: Option<Item>;
		for (const [_, item] of equipped) {
			if (item.uuid !== uuid) {
				continue;
			}
			result = item;
			break;
		}
		if (result === undefined || !isTowerItemId(result.id) || result.unique.kind !== ItemKind.Tower) {
			return;
		}
		const { id, unique } = result;
		// !! Temporary, validate position.
		const { placed } = this;
		const count = placed.get(uuid) ?? 0;
		const { kind } = itemDefinitions[id];
		const { limit } = kind;
		if (count >= limit) {
			return;
		}
		const { targeting: allowed } = kind;
		const [targeting] = allowed;
		const index = count + 1;
		const key = `${uuid}_${index}`;
		const tower: ReplicatedTower = {
			id,
			uuid,
			index,
			key,
			position,
			targeting,
			unique,
			owner: user,
			upgrades: 1,
		};
		new Tower(tower);
		store.placeTower({ id, uuid, index, key, position, targeting, unique }, { user, broadcast: true });
		placed.set(uuid, index);
	}

	public onPlayerRemoving(entity: Entity): void {
		const { user } = entity;
		const towers = store.getState(selectTowersByOwner(user));
		if (towers.isEmpty()) {
			return;
		}
		const { placed } = this;
		for (const { uuid, key } of towers) {
			const count = placed.get(uuid) ?? 0;
			store.sellTower({ key }, { user, broadcast: true });
			if (count <= 0) {
				continue;
			}
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
			const user = getUser(player);
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				return;
			}
			const { owner } = tower;
			if (user !== owner || !tower.isTargetingValid(targeting)) {
				return;
			}
			store.setTowerTargeting({ key, targeting }, { user, broadcast: true });
		});
		Events.tower.upgrade.connect((player: Player, key: string): void => {
			const user = getUser(player);
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				return;
			}
			const { owner } = tower;
			if (user !== owner) {
				return;
			}
			store.upgradeTower({ key }, { user, broadcast: true });
		});
		Events.tower.sell.connect((player: Player, key: string): void => {
			const { placed: placedTowers } = this;
			const user = getUser(player);
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
			store.sellTower({ key }, { user, broadcast: true });
		});
	}
}
