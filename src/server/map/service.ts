import { Collision } from "shared/utils/collision";
import { ComponentTag } from "shared/components/types";
import { MapId } from "shared/map/types";
import { ServerStorage, Workspace } from "@rbxts/services";
import { Service } from "@flamework/core";
import { selectCurrentMap } from "shared/game/selectors";
import { store } from "server/state/store";
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
		store.subscribe(selectCurrentMap, (id?: MapId): void => {
			if (id === undefined) {
				return;
			}
			this.changeMap(id);
			this.setTags();
		});
		store.gameChangeMap({ map: MapId.Test }, { broadcast: true });
	}

	private setTags(): void {
		const { placeable, spawn } = map;

		spawn.AddTag(ComponentTag.SpawnLocation);
		spawn.CollisionGroup = Collision.Spawn;

		for (const instance of placeable.GetChildren()) {
			instance.AddTag(ComponentTag.Placeable);
		}
	}
}
