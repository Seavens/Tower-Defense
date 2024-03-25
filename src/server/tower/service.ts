import { Events } from "server/network";
import { Service } from "@flamework/core";
import { Tower } from "server/tower/class";
import { getUser } from "shared/player/utility";
import { mapDefinitions } from "shared/map/definitions";
import { selectCurrentMap } from "shared/game/selectors";
import { selectInventoryData } from "server/inventory/selectors";
import { selectTowersByOwner } from "shared/tower/selectors";
import { store } from "server/state/store";
import { towerDefinitions } from "shared/tower/definitions";
import type { Entity } from "server/player/class";
import type { Item } from "shared/item/types";
import type { MapId } from "shared/map/types";
import type { OnPlayerRemoving } from "../player/service";
import type { OnStart } from "@flamework/core";
import type { TowerId, TowerTargeting } from "shared/tower/types";

@Service({})
export class TowerService implements OnStart, OnPlayerRemoving {
	protected placedTowers = new Map<TowerId, number>();

	public onPlaceTower(player: Player, uuid: string, position: Vector3): void {
		const user = getUser(player);
		const { equipped } = store.getState(selectInventoryData(user));
		const map = store.getState(selectCurrentMap);
		if (map === undefined) {
			return;
		}
		let stats: Option<Item> = undefined;
		for (const [_, tower] of equipped) {
			if (tower.uuid !== uuid) {
				continue;
			}
			stats = tower;
			break;
		}
		if (stats === undefined) {
			return;
		}
		const { towerLimits } = mapDefinitions[map];
		// !! Temporary, validate position.
		const { id } = stats;
		const { placedTowers } = this;
		const limit = towerLimits[id];
		const placed = placedTowers.get(id) ?? 0;
		if (placed >= limit) {
			return;
		}
		const {
			targeting: [targeting],
		} = towerDefinitions[id];
		const index = placed + 1;
		const cframe = new CFrame(position);
		const tower = new Tower(id, uuid, index, cframe, user, stats);
		const key = tower.getKey();
		store.placeTower({ id, uuid, index, key, position, targeting }, { user, broadcast: true });
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
	}
}
