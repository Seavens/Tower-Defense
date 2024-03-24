import { EntityUtility } from "shared/modules/entity-utility";
import { Events } from "server/network";
import { MapDefinitions } from "shared/definitions/maps";
import { Service } from "@flamework/core";
import { Tower } from "server/classes/tower";
import { TowerDefinitions } from "shared/definitions/towers";
import { selectCurrentMap, selectTowersByOwner } from "shared/state/selectors";
import { selectInventoryData } from "server/state/selectors";
import { serverProducer } from "server/state/producer";
import type { Entity } from "shared/api/entity";
import type { MapId, TargetId } from "shared/types/ids";
import type { OnPlayerRemoving } from "./player-service";
import type { OnStart } from "@flamework/core";
import type { TowerId } from "shared/types/ids";
import type { TowerObject } from "shared/types/objects";

@Service({})
export class TowerService implements OnStart, OnPlayerRemoving {
	protected placedTowers = new Map<TowerId, number>();

	public onPlaceTower(player: Player, uuid: string, position: Vector3): void {
		const user = EntityUtility.getUser(player);
		const { equipped } = serverProducer.getState(selectInventoryData(user));
		const map = serverProducer.getState(selectCurrentMap);
		if (map === undefined) {
			return;
		}
		let stats: Option<TowerObject> = undefined;
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
		const { towerLimits } = MapDefinitions[map];
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
		} = TowerDefinitions[id];
		const index = placed + 1;
		const cframe = new CFrame(position);
		const tower = new Tower(id, uuid, index, cframe, user, stats);
		const key = tower.getKey();
		serverProducer.towerPlace({ id, uuid, index, key, position, targeting }, { user, broadcast: true });
		placedTowers.set(id, index);
	}

	public onPlayerRemoving(entity: Entity): void {
		const { user } = entity;
		const towers = serverProducer.getState(selectTowersByOwner(user));
		if (towers.isEmpty()) {
			return;
		}
		const { placedTowers } = this;
		for (const { id, key } of towers) {
			const placed = placedTowers.get(id) ?? 0;
			serverProducer.towerSell({ key }, { user, broadcast: true });
			if (placed <= 0) {
				continue;
			}
			placedTowers.set(id, placed - 1);
		}
	}

	public onStart(): void {
		serverProducer.subscribe(selectCurrentMap, (map: Option<MapId>): void => {
			const { placedTowers } = this;
			placedTowers.clear();
		});
		Events.replicatePlaceTower.connect((player: Player, uuid: string, position: Vector3): void =>
			this.onPlaceTower(player, uuid, position),
		);
		Events.replicateTowerTargeting.connect((player: Player, key: string, targeting: TargetId): void => {
			const user = EntityUtility.getUser(player);
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				return;
			}
			const { owner } = tower;
			if (user !== owner || !tower.isTargetingValid(targeting)) {
				return;
			}
			serverProducer.towerSetTargeting({ key, targeting }, { user, broadcast: true });
		});
	}
}
