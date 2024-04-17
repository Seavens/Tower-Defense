import { Flamework } from "@flamework/core";

export const enum CharacterAnimation {
	Walk = "character_animation:walk",
	Jump = "character_animation:jump",
}

export const isCharacterAnimation = Flamework.createGuard<CharacterAnimation>();
