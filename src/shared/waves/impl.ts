import { GAME_TICK_RATE } from "shared/core/constants";
import { INITIAL_WAVE_ALLOCATION, WAVE_GROWTH } from "./constants";
import { MAP_DIFFICULTY_MULTIPLIERS } from "shared/map/constants";
import { MapDifficulty } from "shared/map/types";
import { MapId } from "shared/map/types";
import { mapDefinitions } from "shared/map/definitions";
import { mobDefinitions } from "shared/mob/definitions";
import type { WaveDefinition } from "shared/map/definitions";

export class WaveImpl {
	public static generateWaves(map: MapId, count: number, difficulty: MapDifficulty): Array<WaveDefinition> {
		const waves = new Array<WaveDefinition>();
		const { testing } = mapDefinitions[map];
		const { first } = testing!;
		for (const index of $range(2, count)) {
			const definition = this.calculateWave(map, index, difficulty);
			waves.push(definition);
		}
		waves.unshift(first);
		return waves;
	}

	public static calculateWave(map: MapId, index: number, difficulty: MapDifficulty): WaveDefinition {
		const multiplier = MAP_DIFFICULTY_MULTIPLIERS[difficulty];
		let allocated = index ** (WAVE_GROWTH + multiplier) + INITIAL_WAVE_ALLOCATION;
		const wave: WaveDefinition = {};
		const { testing } = mapDefinitions[map];
		const { first, appearances } = testing!;
		let delay = -1;
		for (const [id, { health }] of pairs(mobDefinitions)) {
			delay += 1;
			if (allocated <= 0) {
				break;
			}
			const appearance = appearances[id];
			const entry = first[id];
			const initial = entry?.count ?? 0;
			if (health > allocated || appearance > index) {
				continue;
			}
			const max = math.ceil(30 + 5 ** WAVE_GROWTH);
			const adding = math.clamp(initial + math.ceil((index - appearance) ** WAVE_GROWTH), 1, max);
			let definition = wave[id];
			if (definition !== undefined) {
				const { count } = definition;
				const clamped = math.clamp(count + adding, 1, max);
				const added = adding - count;
				definition.count = clamped;
				added > 0 && (allocated -= health * added);
				continue;
			}
			const count = adding;
			definition = { count, delay, wait: count / max };
			allocated -= health * count;
			wave[id] = definition;
		}
		return wave;
	}
}

warn(WaveImpl.generateWaves(MapId.Test, 100, MapDifficulty.Hard));
