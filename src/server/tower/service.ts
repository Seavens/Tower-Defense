import { Events } from "server/network";
import { ItemKind, ItemTowerUnique, TowerItemId, isTowerItemId } from "shared/inventory/types";
import { Service } from "@flamework/core";
import { Tower } from "server/tower/class";
import { getUser } from "shared/player/utility";
import { itemDefinitions } from "shared/inventory/items";
import { mapDefinitions } from "shared/map/definitions";
import { selectCurrentMap } from "shared/game/selectors";
import { selectInventoryData } from "server/inventory/selectors";
import { selectTowersByOwner } from "shared/tower/selectors";
import { store } from "server/state/store";
import type { Entity } from "server/player/class";
import type { Item, ItemId } from "shared/inventory/types";
import type { MapId } from "shared/map/types";
import type { OnPlayerRemoving } from "../player/service";
import type { OnStart } from "@flamework/core";
import type { ReplicatedTower, TowerTargeting } from "shared/tower/types";

@Service({})
export class TowerService implements OnStart, OnPlayerRemoving {
	protected placedTowers = new Map<ItemId, number>();

	public onPlaceTower(player: Player, uuid: string, position: Vector3): void {
		const user = getUser(player);
		const { equipped } = store.getState(selectInventoryData(user));
		const map = store.getState(selectCurrentMap);
		if (map === undefined) {
			return;
		}
		let result: Option<Item> = undefined;
		// !! Rename this shit (`i`).
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

		const { towerLimits } = mapDefinitions[map];
		const limit = towerLimits[id];
		// !! Temporary, validate position.
		const { placedTowers } = this;
		const placed = placedTowers.get(id) ?? 0;

		const definition = itemDefinitions[id];
		const { kind } = definition.kind;

		if (placed >= limit || kind !== ItemKind.Tower) {
			return;
		}

		const { targeting: allowed } = definition.kind;
		const [targeting] = allowed;
		const index = placed + 1;
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
		placedTowers.set(id, index);
	}

	public onPlayerRemoving(entity: Entity): void {
		const { user } = entity;
		const towers = store.getState(selectTowersByOwner(user));
		if (towers.isEmpty()) {
			return;
		}
		const { placedTowers } = this;
		for (const { id, key } of towers) {
			const placed = placedTowers.get(id) ?? 0;
			store.sellTower({ key }, { user, broadcast: true });
			if (placed <= 0) {
				continue;
			}
			placedTowers.set(id, placed - 1);
		}
	}

	public onStart(): void {
		store.subscribe(selectCurrentMap, (map: Option<MapId>): void => {
			const { placedTowers } = this;
			placedTowers.clear();
		});
		Events.replicatePlaceTower.connect((player: Player, uuid: string, position: Vector3): void =>
			this.onPlaceTower(player, uuid, position),
		);
		Events.replicateTowerTargeting.connect((player: Player, key: string, targeting: TowerTargeting): void => {
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
		// !! Implement tower upgrading!
	}
}
