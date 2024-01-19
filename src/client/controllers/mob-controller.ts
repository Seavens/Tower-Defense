import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { Listener } from "shared/classes/listener";
import { Mob } from "client/classes/mob";
import { MobUtility } from "shared/modules/mob-utility";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import type { DamageKind } from "shared/types/kinds";
import type { OnStart } from "@flamework/core";
import type { StatusId } from "shared/types/ids";

/** @hideinherited */
export interface OnMobAdded {
	onMobAdded(mob: Mob): void;
}

/** @hideinherited */
export interface OnMobRemoved {
	onMobRemoved(mob: Mob): void;
}

/** @hideinherited */
export interface OnMobEnded {
	onMobEnded(mob: Mob): void;
}

/** @hideinherited */
export interface OnMobDied {
	onMobDied(mob: Mob): void;
}

const mobAdded = new Listener<OnMobAdded>();
const mobRemoved = new Listener<OnMobRemoved>();
const mobEnded = new Listener<OnMobEnded>();
const mobDied = new Listener<OnMobDied>();

const mobUnreliable = ReplicatedStorage.FindFirstChild("mobResyncUnreliable");
const isMobData = t.strictArray(t.Vector2int16, t.Vector2int16);

@Controller({})
export class MobController implements OnStart {
	public onStart(): void {
		Mob.onMobAdded.Connect((mob: Mob): void => {
			mobAdded.fire(mob);
		});
		Mob.onMobRemoved.Connect((mob: Mob): void => {
			mobRemoved.fire(mob);
		});
		Mob.onMobEnded.Connect((mob: Mob): void => {
			mobEnded.fire(mob);
		});
		Mob.onMobDied.Connect((mob: Mob): void => {
			mobDied.fire(mob);
		});
		Events.replicateIndexReset.connect((index: number): void => {
			MobUtility.setIndex(index);
		});
		Events.replicateMobDamage.connect((data: Vector2int16, kind: DamageKind): void => {
			const index = data.X;
			const damage = data.Y;
			const option = Mob.getMob(index);
			if (option.isNone()) {
				return;
			}
			const mob = option.unwrap();
			mob.takeDamage(damage, kind);
		});
		Events.replicateMobDeath.connect((index: number): void => {
			const option = Mob.getMob(index);
			if (option.isNone()) {
				return;
			}
			const mob = option.unwrap();
			mob.forceKill();
		});
		Events.replicateMobStatusAdded.connect((data: Vector2int16, status: StatusId, timestamp: number): void => {
			const index = data.X;
			const duration = data.Y;
			const option = Mob.getMob(index);
			if (option.isNone()) {
				return;
			}
			const now = Workspace.GetServerTimeNow();
			const delta = now - timestamp;
			const mob = option.unwrap();
			mob.applyStatus(status, duration - delta);
		});
		Events.replicateMobStatusRemoved.connect((index: number, status: StatusId): void => {
			const option = Mob.getMob(index);
			if (option.isNone()) {
				return;
			}
			const mob = option.unwrap();
			mob.removeStatus(status);
		});
		if (mobUnreliable === undefined || !mobUnreliable.IsA("UnreliableRemoteEvent")) {
			return;
		}
		mobUnreliable.OnClientEvent.Connect((...args: Array<unknown>): void => {
			if (!isMobData(args)) {
				return;
			}
			const [first, second] = args;
			const index = first.X;
			const current = first.Y;
			const target = second.X;
			const alpha = second.Y / 1000;
			const option = Mob.getMob(index);
			if (option.isNone()) {
				return;
			}
			const mob = option.unwrap();
		});
	}
}