import { Entity } from "server/player/class";
import { Events } from "server/network";
import { Players } from "@rbxts/services";
import { Service } from "@flamework/core";
import { createListener } from "shared/utils/create-listener";
import { reuseThread } from "shared/utils/reuse-thread";
import { store } from "server/state/store";
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

Players.CharacterAutoLoads = false;

@Service({})
export class PlayerService implements OnStart {
	private readonly removing = new Set<Entity>();
	private readonly loaded = new Set<Entity>();

	public onPlayerAdded(player: Player): void {
		const entity = Entity.fromPlayer(player);
		const { user } = entity;
		playerAdded.fire(entity);
		store.playerAdded({}, { user, replicate: true });
	}

	public onPlayerRemoved(player: Player): Promise<unknown> {
		const { removing, loaded } = this;
		const user = Entity.getUser(player);
		const entity = Entity.getEntity(user);
		store.playerRemoved({}, { user, replicate: true });
		if (entity === undefined) {
			return Promise.resolve();
		}
		const promises = playerRemoving.fire(entity);
		const promise = Promise.all(promises).finally((): void => {
			removing.delete(entity);
		});
		removing.add(entity);
		loaded.delete(entity);
		entity.destroy();
		return promise;
	}

	public onPlayerReady(player: Player): void {
		const { loaded } = this;
		const user = Entity.getUser(player);
		const entity = Entity.getEntity(user);
		if (entity === undefined) {
			return;
		}
		if (loaded.has(entity)) {
			return;
		}
		loaded.add(entity);
		entity.loadCharacter();
	}

	public onGameClosed(): void {
		const { removing } = this;
		const { entities } = Entity;
		for (const [_, entity] of entities) {
			if (!entity.isPlayer()) {
				continue;
			}
			const removed = removing.has(entity);
			if (removed) {
				continue;
			}
			const { player } = entity;
			this.onPlayerRemoved(player);
		}
		const promises = playerRemoving.resolving();
		Promise.all(promises).await();
	}

	public onStart(): void {
		Players.PlayerAdded.Connect((player: Player): void => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect((player: Player): Promise<unknown> => this.onPlayerRemoved(player));
		const players = Players.GetPlayers();
		for (const player of players) {
			reuseThread((): void => this.onPlayerAdded(player));
		}
		game.BindToClose((): void => this.onGameClosed());
		Events.replicateReady.connect((player: Player): void => this.onPlayerReady(player));
	}
}
