import { MapDefinitions } from "shared/definitions/maps";
import { Workspace } from "@rbxts/services";
import type { MapId } from "shared/types/ids";
import type { WaveDefinition } from "shared/types/definitions";

const { map } = Workspace;

export class MapUtility {
	public static getWaypoints(): Array<BasePart> {
		const { waypoints } = map;
		const ordered = new Array<BasePart>();
		const instances = waypoints.GetChildren();
		const total = instances.size();
		for (const index of $range(1, total)) {
			const waypoint = waypoints.FindFirstChild(`${index}`);
			if (waypoint === undefined || !waypoint.IsA("BasePart")) {
				warn("Waypoints are not ordered!");
				continue;
			}
			ordered.push(waypoint);
		}
		return ordered;
	}

	public static getWave(map: MapId, wave: number): WaveDefinition | undefined {
		const { waves } = MapDefinitions[map];
		return waves[wave];
	}

	public static getWaveCount(map: MapId): number {
		const { waves } = MapDefinitions[map];
		return waves.size();
	}
}
