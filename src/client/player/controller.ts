import { Controller } from "@flamework/core";
import { Entity } from "./class";
import { Events, Functions } from "client/network";
import { PlayerUtility } from "shared/player/utility";
import { Players, ReplicatedStorage, StarterGui } from "@rbxts/services";
import { createListener } from "shared/utility/create-listener";
import { reuseThread } from "shared/utility/reuse-thread";
import type { OnStart } from "@flamework/core";

export interface OnPlayerAdded {
	/** @hideinherited */
	onPlayerAdded(player: Entity): void;
}

export interface OnPlayerRemoving {
	/** @hideinherited */
	onPlayerRemoving(player: Entity): void;
}

const playerAdded = createListener<OnPlayerAdded>();
const playerRemoving = createListener<OnPlayerRemoving>();

const resetBindable = new Instance("BindableEvent");
resetBindable.Parent = ReplicatedStorage;
resetBindable.Name = "resetBindable";

@Controller({})
export class PlayerController implements OnStart {
	private loaded = false;

	public onDataLoaded(): void {
		const { loaded } = this;
		if (loaded) {
			return;
		}
		this.loaded = true;
		resetBindable.Event.Connect((): void => {
			Functions.character.requestReset().await();
		});
		for (const _ of $range(1, 10)) {
			const [success] = pcall((): void => {
				StarterGui.SetCore("ResetButtonCallback", resetBindable);
			});
			if (success) {
				break;
			}
			task.wait(0.5);
		}
	}

	public onPlayerAdded(player: Player): void {
		const entity = Entity.fromPlayer(player);
		const bin = entity.getBin();
		const character = player.CharacterAdded.Connect((rig: Model): void => {
			entity.loadCharacter(rig);
		});
		bin.add(character);
		playerAdded.fire(entity);
	}

	public onPlayerRemoved(player: Player): void {
		const user = PlayerUtility.getUser(player);
		const entity = Entity.getEntity(user);
		if (entity === undefined) {
			return;
		}
		entity.destroy();
		playerRemoving.fire(entity);
	}

	public onStart(): void {
		Players.PlayerAdded.Connect((player: Player): void => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect((player: Player): void => this.onPlayerRemoved(player));
		const players = Players.GetPlayers();
		for (const player of players) {
			reuseThread((): void => this.onPlayerAdded(player));
		}
		// Temporary.
		// There is a chance that the server takes more than
		// 10 seconds to load data (or the client loads in
		// after the "replicateDataLoaded" event has fired.)
		const thread = task.delay(10, (): void => {
			Events.state.ready();
			pcall((): void => {
				connection.Disconnect();
			});
			this.onDataLoaded();
		});
		const connection = Events.player.loaded.connect((): void => {
			Events.state.ready();
			pcall((): void => {
				connection.Disconnect();
				task.cancel(thread);
			});
			this.onDataLoaded();
		});
		for (const _ of $range(1, 10)) {
			const { loaded } = this;
			if (loaded) {
				break;
			}
			const [success] = pcall((): void => {
				StarterGui.SetCore("ResetButtonCallback", false);
			});
			if (success) {
				break;
			}
			task.wait(0.5);
		}
	}
}
