import { StatusId } from "shared/statuses/types";
import type { CharacterRigR15, CharacterRigR6 } from "@rbxts/promise-character";
import type { Status } from "shared/statuses/types";
import type { StatusModule } from ".";

export const healingStatus: StatusModule<StatusId.Healing> = {
	id: StatusId.Healing,

	onAdded: (character: CharacterRigR15, status: Status): void => {
		//
	},
	onTick: (character: CharacterRigR15, { stacks }: Status): void => {
		//
	},
	onRemove: (character: CharacterRigR15, status: Status): void => {
		//
	},
};
