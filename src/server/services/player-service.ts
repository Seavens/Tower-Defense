import { Entity } from "server/classes/entity";
import { Events } from "server/network";
import { Listener } from "shared/classes/listener";
import { Players } from "@rbxts/services";
import { Service } from "@flamework/core";
import { reuseThread } from "shared/functions/reuse-thread";
import type { OnStart } from "@flamework/core";

export interface OnPlayerAdded {
	/** @hideinherited */
	onPlayerAdded(player: Entity): void;
}

export interface OnPlayerRemoving {
	/** @hideinherited */
	onPlayerRemoving(player: Entity): void;
}

const playerAdded = new Listener<OnPlayerAdded>();
const playerRemoving = new Listener<OnPlayerRemoving>();

Players.CharacterAutoLoads = false;

@Service({})
export class PlayerService implements OnStart {
	private readonly removing = new Set<Entity>();
	private readonly loaded = new Set<Entity>();

	public onPlayerAdded(player: Player): void {
		const entity = Entity.fromPlayer(player);
		playerAdded.fire(entity);
	}

	public onPlayerRemoved(player: Player): Promise<unknown> {
		const { removing, loaded } = this;
		const user = Entity.getUser(player);
		const option = Entity.getEntity(user);
		if (option.isNone()) {
			return Promise.resolve();
		}
		const entity = option.unwrap();
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
		const option = Entity.getEntity(user);
		if (option.isNone()) {
			return;
		}
		const entity = option.unwrap();
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
		const promises = playerRemoving.getResolving();
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
