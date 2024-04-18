import { CharacterController } from "client/players/character/controller";
import { Controller } from "@flamework/core";
import { createSchedule } from "shared/utility/functions/create-schedule";
import { getPlayer } from "shared/utility/functions/get-player";
import { selectStatusState, selectStatusesByUser } from "shared/statuses/selectors";
import { statusDefinitions } from "shared/statuses/definitions/statuses";
import { statusModules } from "./modules/statuses";
import { store } from "client/state/store";
import type { OnStart } from "@flamework/core";
import type { Status, StatusId } from "shared/statuses/types";

@Controller({})
export class StatusController implements OnStart {
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
					({ stacks }: Status, id: StatusId): defined => `${user}-(${id}_${stacks})`,
					(status: Status, id: StatusId): (() => void) | void => {
						const character = CharacterController.getCharacter(player);
						if (character === undefined) {
							return undefined;
						}
						const module = statusModules[id];
						module.onAdded(character, status);
						return (): void => {
							module.onRemove(character, status);
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
						const character = CharacterController.getCharacter(`${user}`);
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
