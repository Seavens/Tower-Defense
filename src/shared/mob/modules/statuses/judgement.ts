import { MobStatus } from "shared/mob/types";
import { RunService } from "@rbxts/services";
import { statusDefinitions } from "shared/mob/definitions";
import type { Mob as ClientMob } from "client/mob/class/class";
import type { Mob } from "shared/mob/api";
import type { StatusModule } from ".";

const isClient = RunService.IsClient();

function hasGetInstance(value: unknown): value is ClientMob {
	if (!typeIs(value, "table") || !("getInstance" in value)) {
		return false;
	}
	return true;
}

export const judgementStatus: StatusModule<MobStatus.Judgement> = {
	status: MobStatus.Judgement,

	onTick: (mob: Mob): void => {
		if (isClient && hasGetInstance(mob)) {
			const instance = mob.getInstance();
			// const sound = new SoundEffect(instance, "rbxassetid://9116278356");
			// sound.destroyAfterPlay(0.25);
			// Play sounds?
			return;
		}
		const { damageKind } = statusDefinitions[MobStatus.Judgement];
		mob.takeDamage(0.25, damageKind);
	},
};
