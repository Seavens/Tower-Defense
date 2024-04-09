import { MobStatus } from "shared/mob/types";
import { RunService } from "@rbxts/services";
import { statusDefinitions } from "shared/mob/definitions";
import type { Mob } from "shared/mob/api";
import type { StatusModule } from ".";

const isClient = RunService.IsClient();

export const judgementStatus: StatusModule<MobStatus.Judgement> = {
	status: MobStatus.Judgement,

	onTick: (mob: Mob): void => {
		if (isClient) {
			return;
		}
		const { damageKind } = statusDefinitions[MobStatus.Judgement];
		mob.takeDamage(0.25, damageKind);
	},
};
