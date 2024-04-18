import { StatusId } from "shared/statuses/types";
import type { CharacterRigR15 } from "@rbxts/promise-character";
import type { Status } from "shared/statuses/types";
import type { StatusModule } from ".";

export const stunnedStatus: StatusModule<StatusId.Stunned> = {
	id: StatusId.Stunned,

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
