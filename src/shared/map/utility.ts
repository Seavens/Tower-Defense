import { MapDifficulty, type MapId } from "shared/map/types";
import { WaveImpl } from "shared/waves/impl";
import { Workspace } from "@rbxts/services";
import type { WaveDefinition } from "shared/map/definitions";

const { map } = Workspace;

export namespace MapUtility {
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

	export function getMobWave(map: MapId, wave: number): WaveDefinition {
		const definition = WaveImpl.calculateWave(map, wave, MapDifficulty.Easy);
		return definition;
	}

	export function getWaveCount(map: MapId): number {
		return math.huge;
	}
}
