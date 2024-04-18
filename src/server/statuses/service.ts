import { Mob } from "server/mob/class";
import { Service } from "@flamework/core";
import { StatusKind } from "shared/statuses/types";
import { Tower } from "server/tower/class";
import { createSchedule } from "shared/utility/functions/create-schedule";
import { getTimestamp } from "shared/utility/functions/get-timestamp";
import { isUUID } from "shared/utility/guards";
import { selectStatusState, selectStatusesByUser } from "shared/statuses/selectors";
import { statusDefinitions } from "shared/statuses/definitions";
import { statusModules } from "./modules";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";
import type { Status, StatusId } from "shared/statuses/types";

@Service({})
export class StatusService implements OnStart {
	public onStart(): void {
		store.observe(
			selectStatusState,
			(_: Map<StatusId, Status>, user: string | number): defined => `${user}`,
			(_: Map<StatusId, Status>, user: string | number): (() => void) | void => {
				user = `${user}`;
				const unsubscribe = store.observe(
					selectStatusesByUser(user),
					(_: Status, id: StatusId): defined => `${user}_${id}`,
					(status: Status, id: StatusId): (() => void) | void => {
						const { timestamp } = status;
						const now = getTimestamp();
						const remaining = timestamp - now;
						const result = this.getOwner(`${user}`);
						if (remaining <= 0 || result === undefined) {
							return undefined;
						}
						const [owner, kind] = result;
						const thread = task.delay(remaining, (): void => {
							store.removeStatus({ id }, { user, broadcast: true });
						});
						const module = statusModules[id];
						// Me when typescript!
						if (kind === StatusKind.Tower) {
							module.onAdded(owner, status, kind);
						} else if (kind === StatusKind.Mob) {
							module.onAdded(owner, status, kind);
						}
						// Me when typescript!
						return (): void => {
							if (kind === StatusKind.Tower) {
								module.onRemove(owner, status, kind);
							} else if (kind === StatusKind.Mob) {
								module.onRemove(owner, status, kind);
							}
							pcall((): void => task.cancel(thread));
						};
					},
				);
				return unsubscribe;
			},
		);
		for (const [id, { name, tick }] of pairs(statusDefinitions)) {
			createSchedule({
				name: `status${name}Tick`,
				tick,
				onTick: (): void => {
					const state = store.getState(selectStatusState);
					for (const [user, statuses] of pairs(state)) {
						const result = this.getOwner(`${user}`);
						if (result === undefined) {
							continue;
						}
						const [owner, kind] = result;
						for (const [, status] of statuses) {
							if (status.id !== id) {
								continue;
							}
							const module = statusModules[id];
							// Unnecessary just so typescript can shut up
							if (kind === StatusKind.Tower) {
								module.onTick(owner, status, kind);
							} else if (kind === StatusKind.Mob) {
								module.onTick(owner, status, kind);
							}
						}
					}
				},
			});
		}
	}

	protected getOwner(user: string): Option<[Tower, StatusKind.Tower] | [Mob, StatusKind.Mob]> {
		if (isUUID(user)) {
			const mob = Mob.getMob(user);
			if (mob === undefined) {
				return undefined;
			}
			return [mob, StatusKind.Mob];
		}
		const tower = Tower.getTower(user);
		if (tower === undefined) {
			return undefined;
		}
		return [tower, StatusKind.Tower];
	}
}
