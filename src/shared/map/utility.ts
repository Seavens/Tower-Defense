import { Workspace } from "@rbxts/services";
import { mapDefinitions } from "shared/map/definitions";
import type { MapId } from "shared/map/types";
import type { WaveDefinition } from "shared/map/definitions";

const { map } = Workspace;

export function getMapWaypoints(): Array<BasePart> {
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

export function getMobWave(map: MapId, wave: number): Option<WaveDefinition> {
	const { waves } = mapDefinitions[map];
	const definition = waves[wave];
	return definition[0];
}

export function getWaveCount(map: MapId): number {
	const { waves } = mapDefinitions[map];
	return waves.size();
}
