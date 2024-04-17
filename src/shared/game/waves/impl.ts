import { Dictionary } from "@rbxts/sift";
import { INITIAL_WAVE_ALLOCATION, SPEED_FACTOR, WAVE_GROWTH } from "./constants";
import { MAP_DIFFICULTY_MULTIPLIERS } from "../map/constants";
import { MobUtility } from "shared/mob/utility";
import { mapDefinitions } from "../map/definitions";
import { mobDefinitions } from "shared/mob/definitions";
import type { AnyMobDefinition } from "shared/mob/definitions/mobs";
import type { MapDifficulty, MapId } from "../map/types";
import type { WaveDefinition } from "../map/definitions";

export class WaveImpl {
	public static generateWaves(map: MapId, count: number, difficulty: MapDifficulty): Array<WaveDefinition> {
		const waves = new Array<WaveDefinition>();
		const { waves: testing } = mapDefinitions[map];
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
		let allocated = math.round((index ** (WAVE_GROWTH + multiplier) + INITIAL_WAVE_ALLOCATION) / 4) * 4;
		const wave: WaveDefinition = {};
		const { waves } = mapDefinitions[map];
		const { first, appearances } = waves!;
		const definitions = this.orderDefinitions();
		let delay = -1;
		for (const { id } of definitions) {
			if (allocated <= 0) {
				break;
			}
			const health = MobUtility.getMobHealth(id, index);
			warn(health, allocated);
			const appearance = appearances[id];
			const entry = first[id];
			const initial = entry?.count ?? 0;
			if (health > allocated || appearance > index) {
				continue;
			}
			delay += 1;
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
			definition = { count, delay, wait: (count / max) * SPEED_FACTOR };
			allocated -= health * count;
			wave[id] = definition;
		}
		return wave;
	}

	protected static orderDefinitions(): Array<AnyMobDefinition> {
		const definitions = new Array<AnyMobDefinition>();
		for (const [, definition] of pairs(mobDefinitions)) {
			definitions.push(definition);
		}
		definitions.sort(({ health: a }, { health: b }): boolean => a > b);
		return definitions;
	}
}
