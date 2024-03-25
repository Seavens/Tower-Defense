import { Flamework } from "@flamework/core";

export const enum CharacterAnimation {
	Dance = "character_animation:dance",
}

export const enum BaseCharacterAnimation {
	Walk = "base_character_animation:walk",
	Jump = "base_character_animation:jump",
	Freefall = "base_character_animation:freefall",
	Climbing = "base_character_animation:climbing",
}

export const isCharacterAnimation = Flamework.createGuard<CharacterAnimation>();
export const isBaseCharacterAnimation = Flamework.createGuard<BaseCharacterAnimation>();
