import { CharacterService } from "server/players/character/service";
import { Service } from "@flamework/core";
import { createSchedule } from "shared/utility/functions/create-schedule";
import { getPlayer } from "shared/utility/functions/get-player";
import { getTimestamp } from "shared/utility/functions/get-timestamp";
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
				const player = getPlayer(user);
				if (player === undefined) {
					return undefined;
				}
				const unsubscribe = store.observe(
					selectStatusesByUser(user),
					(_: Status, id: StatusId): defined => `${user}_${id}`,
					(status: Status, id: StatusId): (() => void) | void => {
						const { timestamp } = status;
						const now = getTimestamp();
						const remaining = timestamp - now;
						const character = CharacterService.getCharacter(player);
						if (remaining <= 0 || character === undefined) {
							return undefined;
						}
						const thread = task.delay(remaining, (): void => {
							store.removeStatus({ id }, { user, broadcast: true });
						});
						const module = statusModules[id];
						module.onAdded(character, status);
						return (): void => {
							module.onRemove(character, status);
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
						const character = CharacterService.getCharacter(`${user}`);
						if (character === undefined) {
							continue;
						}
						for (const [, status] of statuses) {
							if (status.id !== id) {
								continue;
							}
							const module = statusModules[id];
							module.onTick(character, status);
						}
					}
				},
			});
		}
	}
}
