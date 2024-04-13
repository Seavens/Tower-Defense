import { ASSET_IDS } from "shared/assets/constants";
import { CharacterAnimation } from "./types";

export const CHARACTER_ANIMATIONS: { [A in CharacterAnimation]: Array<RBXAssetId> } = {
	[CharacterAnimation.Walk]: [ASSET_IDS.Walk],
	[CharacterAnimation.Jump]: [ASSET_IDS.Jump],
} as const;
