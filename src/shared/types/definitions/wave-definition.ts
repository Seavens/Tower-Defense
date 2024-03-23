import type { MobId } from "../ids";

export type WaveDefinition = {
	[I in MobId]?: {
		count: number;
		wait: number;
		delay: number;
	};
};
