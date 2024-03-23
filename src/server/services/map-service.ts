import { Collision, Tag } from "shared/types/enums";
import { MapId } from "shared/types/ids";
import { ServerStorage, Workspace } from "@rbxts/services";
import { Service } from "@flamework/core";
import { selectCurrentMap } from "shared/state/selectors";
import { serverProducer } from "server/state/producer";
import type { OnStart } from "@flamework/core";

const { maps } = ServerStorage;
const { map } = Workspace;

@Service({})
export class MapService implements OnStart {
	public changeMap(id: MapId): void {
		const prefab = maps.FindFirstChild(id);
		if (prefab === undefined) {
			warn(`${id} has an invalid map: map does not exist!`);
			return;
		}
		map.ClearAllChildren();
		const folders = prefab.GetChildren();
		for (const folder of folders) {
			const cloned = folder.Clone();
			cloned.Parent = map;
		}
	}
	public onStart(): void {
		serverProducer.subscribe(selectCurrentMap, (id?: MapId): void => {
			if (id === undefined) {
				return;
			}
			this.changeMap(id);
			this.setTags();
		});
		serverProducer.gameChangeMap({ map: MapId.Test }, { broadcast: true });
	}

	private setTags(): void {
		const { placeable, spawnLocation } = map;

		spawnLocation.AddTag(Tag.SpawnLocation);
		spawnLocation.CollisionGroup = Collision.Spawn;

		for (const instance of placeable.GetChildren()) {
			instance.AddTag(Tag.Placeable);
		}
	}
}
