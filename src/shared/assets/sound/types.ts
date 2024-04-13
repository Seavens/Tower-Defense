import { Flamework } from "@flamework/core";

export const enum SoundGroup {
	Environment = "sound_group:environment",
	Player = "sound_group:player",
}

export const isSoundGroup = Flamework.createGuard<SoundGroup>();
