import { Controller } from "@flamework/core";
import { Players } from "@rbxts/services";
import { createListener } from "shared/utility/functions/create-listener";
import { reuseThread } from "shared/utility/functions/reuse-thread";
import type { OnStart } from "@flamework/core";

export interface OnPlayerAdded {
	/** @hideinherited */
	onPlayerAdded(player: Player): void;
}

export interface OnPlayerRemoving {
	/** @hideinherited */
	onPlayerRemoving(player: Player): void;
}

const playerAdded = createListener<OnPlayerAdded>();
const playerRemoving = createListener<OnPlayerRemoving>();

@Controller({})
export class PlayersController implements OnStart {
	public onPlayerAdded(player: Player): void {
		task.defer((): void => {
			playerAdded.fire(player);
		});
	}

	public onPlayerRemoving(player: Player): void {
		playerRemoving.fire(player);
	}

	public onStart(): void {
		Players.PlayerAdded.Connect((player: Player): void => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect((player: Player): void => this.onPlayerRemoving(player));
		const players = Players.GetPlayers();
		for (const player of players) {
			reuseThread((): void => this.onPlayerAdded(player));
		}
	}
}
