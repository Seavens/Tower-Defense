import { BaseCharacterAnimation, CharacterAnimation } from "./types";

export const CHARACTER_BASE_ANIMATIONS: { [I in BaseCharacterAnimation]: RBXAssetId } = {
	[BaseCharacterAnimation.Walk]: "rbxassetid://913402848",
	[BaseCharacterAnimation.Jump]: "rbxassetid://507765000",
	[BaseCharacterAnimation.Freefall]: "rbxassetid://507767968",
	[BaseCharacterAnimation.Climbing]: "rbxassetid://507765644",
} as const;

export const CHARACTER_ANIMATIONS: { [I in CharacterAnimation]: RBXAssetId } = {
	[CharacterAnimation.Dance]: "rbxassetid://507771019",
} as const;

export const CHARACTER_RESPAWN_WAIT = 3;
