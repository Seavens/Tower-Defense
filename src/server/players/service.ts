import { Events } from "server/network";
import { Players } from "@rbxts/services";
import { Service } from "@flamework/core";
import { createListener } from "shared/utility/create-listener";
import { reuseThread } from "shared/utility/reuse-thread";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";

export interface OnPlayerAdded {
	/** @hideinherited */
	onPlayerAdded(player: Player): void;
}

export interface OnPlayerRemoving {
	/** @hideinherited */
	onPlayerRemoving(player: Player): void;
}

export interface OnPlayerReady {
	/** @hideinherited */
	onPlayerReady(player: Player): void;
}

const playerAdded = createListener<OnPlayerAdded>();
const playerRemoving = createListener<OnPlayerRemoving>();
const playerReady = createListener<OnPlayerReady>();

@Service({})
export class PlayerService implements OnStart {
	public onPlayerAdded(player: Player): void {
		const user = player.Name;
		store.playerAdded({}, { user, replicate: true });
		playerAdded.fire(player);
	}

	public onPlayerRemoving(player: Player): void {
		const user = player.Name;
		store.playerRemoved({}, { user, replicate: true });
		playerRemoving.fire(player);
	}

	public onPlayerReady(player: Player): void {
		playerReady.fire(player);
	}

	public onStart(): void {
		Players.PlayerAdded.Connect((player: Player): void => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect((player: Player): void => this.onPlayerRemoving(player));
		const players = Players.GetPlayers();
		for (const player of players) {
			reuseThread((): void => this.onPlayerAdded(player));
		}
		Events.state.ready.connect((player: Player): void => this.onPlayerReady(player));
	}
}
