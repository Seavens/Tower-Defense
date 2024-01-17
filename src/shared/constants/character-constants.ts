import { AnimationId } from "shared/types/ids";
import { BaseAnimation } from "shared/types/enums";

export const CHARACTER_BASE_ANIMATIONS: { [I in BaseAnimation]: RBXAssetId } = {
	[BaseAnimation.Walk]: "rbxassetid://180426354",
	[BaseAnimation.Jump]: "rbxassetid://125750702",
	[BaseAnimation.Freefall]: "rbxassetid://180436148",
	[BaseAnimation.Climbing]: "rbxassetid://180436334",
} as const;

export const CHARACTER_ANIMATIONS: { [I in AnimationId]: RBXAssetId } = {
	[AnimationId.Dance]: "rbxassetid://182436935",
} as const;

export const CHARACTER_RESPAWN_WAIT = 3;
