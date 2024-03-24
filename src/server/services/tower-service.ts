import { EntityUtility } from "shared/modules/entity-utility";
import { Events } from "server/network";
import { MapDefinitions } from "shared/definitions/maps";
import { Service } from "@flamework/core";
import { Tower } from "server/classes/tower";
import { selectCurrentMap } from "shared/state/selectors";
import { selectInventoryData } from "server/state/selectors";
import { serverProducer } from "server/state/producer";
import type { MapId } from "shared/types/ids";
import type { OnStart } from "@flamework/core";
import type { TowerId } from "shared/types/ids";
import type { TowerObject } from "shared/types/objects";

@Service({})
export class TowerService implements OnStart {
	protected placedTowers = new Map<TowerId, number>();

	public onStart(): void {
		serverProducer.subscribe(selectCurrentMap, (map: Option<MapId>): void => {
			const { placedTowers } = this;
			placedTowers.clear();
		});
		Events.replicatePlaceTower.connect((player: Player, uuid: string, position: Vector3): void => {
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
			const index = placed + 1;
			const cframe = new CFrame(position);
			new Tower(id, uuid, index, cframe, user, stats);
			serverProducer.towerPlace({ id, position, uuid, index }, { user, broadcast: true });
			placedTowers.set(id, index);
		});
	}
}
