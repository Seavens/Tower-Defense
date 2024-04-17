import { ASSET_IDS } from "shared/assets/constants";
import { CharacterAnimation } from "./types";

export const CHARACTER_ANIMATIONS: { [A in CharacterAnimation]: Array<RBXAssetId> } = {
	[CharacterAnimation.Walk]: [ASSET_IDS.WalkR6],
	[CharacterAnimation.Jump]: [ASSET_IDS.Jump],
} as const;
