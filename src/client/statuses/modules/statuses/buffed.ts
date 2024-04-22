import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { StatusId } from "shared/statuses/types";
import { Tower } from "client/tower";
import { TowerVisual } from "shared/tower/types";
import type { Mob } from "client/mob/class";
import type { Status, StatusKind } from "shared/statuses/types";
import type { StatusModule } from ".";

const { debris } = Workspace;
const { assets } = ReplicatedStorage;
const { effects } = assets;

export const buffedStatus: StatusModule<StatusId.Buffed> = {
	id: StatusId.Buffed,

	onAdded: (character: Mob | Tower, status: Status, kind: StatusKind): void => {
		warn("Buffed status added");
		const clone = effects.FindFirstChild(TowerVisual.Buff);
		if (clone === undefined || !clone.IsA("BasePart")) return;
		if (character instanceof Tower === false) return;
		clone.Parent = debris;
		clone.CFrame === character.cframe;
	},
	onTick: (character: Mob | Tower, status: Status, kind: StatusKind): void => {
		warn("Buffed status added!!!!!!!!!!!");
	},
	onRemove: (character: Mob | Tower, status: Status, kind: StatusKind): void => {
		//
	},
};
