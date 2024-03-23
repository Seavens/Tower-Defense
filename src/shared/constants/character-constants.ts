import { AnimationId } from "shared/types/ids";
import { BaseAnimation } from "shared/types/enums";

export const CHARACTER_BASE_ANIMATIONS: { [I in BaseAnimation]: RBXAssetId } = {
	[BaseAnimation.Walk]: "rbxassetid://913402848",
	[BaseAnimation.Jump]: "rbxassetid://507765000",
	[BaseAnimation.Freefall]: "rbxassetid://507767968",
	[BaseAnimation.Climbing]: "rbxassetid://507765644",
} as const;

export const CHARACTER_ANIMATIONS: { [I in AnimationId]: RBXAssetId } = {
	[AnimationId.Dance]: "rbxassetid://507771019",
} as const;

export const CHARACTER_RESPAWN_WAIT = 3;
