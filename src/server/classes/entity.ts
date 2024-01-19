import { Entity as API } from "shared/api/entity";
import { Character } from "./character";
import { DATA_TEMPLATE, type Data } from "shared/types/data";
import { DataService } from "server/services/data-service";
import { Option } from "@rbxts/rust-classes";
import { Signal } from "@rbxts/beacon";
import { selectData } from "server/state/selectors";
import { serverProducer } from "server/state/producer";
import type { Bin } from "@rbxts/bin";

export class Entity extends API<Character> {
	public static readonly entities = new Map<string, Entity>();

	public static readonly onEntityAdded = new Signal<Entity>();
	public static readonly onEntityRemoved = new Signal<Entity>();

	public declare readonly user: string;
	public declare readonly id: number;

	protected declare readonly player?: Player;
	protected declare readonly bin: Bin;

	protected declare destroyed: boolean;

	protected character?: Character;
	protected respawnable = true;

	private constructor(user: string, id: number, player?: Player) {
		super(user, id, player);
		const { entities, onEntityAdded } = Entity;
		const { bin } = this;
		bin.add((): void => {
			const { character } = this;
			character?.destroy();
		});
		entities.set(user, this);
		onEntityAdded.FireDeferred(this);
		this.initialize();
	}

	public static createEntity(user: string, id: number, player?: Player): Entity {
		const { entities } = this;
		let entity = entities.get(user);
		if (entity === undefined) {
			if (player === undefined) {
				const data = DATA_TEMPLATE;
				serverProducer.dataAdded({ data }, { user, replicate: true });
			}
			entity = new Entity(user, id, player);
		}
		return entity;
	}

	public static fromPlayer(player: Player): Entity {
		const { entities } = this;
		const user = player.Name;
		const id = player.UserId;
		let entity = entities.get(user);
		if (entity === undefined) {
			entity = new Entity(user, id, player);
		}
		return entity;
	}

	public static getUser(playerOrEntity: Player | Entity): string {
		if (typeIs(playerOrEntity, "Instance")) {
			const player = playerOrEntity;
			const user = player.Name;
			return user;
		}
		const entity = playerOrEntity;
		const { user } = entity;
		return user;
	}

	public static getEntity(user: string): Option<Entity> {
		const { entities } = this;
		const entity = entities.get(user);
		return Option.wrap(entity);
	}

	public getData(): Promise<Data | void> {
		const loaded = DataService.isDataLoaded(this);
		if (!this.isPlayer() || loaded) {
			const { user } = this;
			const data = serverProducer.getState(selectData(user));
			return Promise.resolve(data);
		}
		const promise = Promise.fromEvent(DataService.onDataLoaded, (value: Entity): boolean => {
			return value === this;
		})
			.timeout(15)
			.catch(warn)
			.then((): Data => {
				const { user } = this;
				const data = serverProducer.getState(selectData(user));
				return data;
			});
		return promise;
	}

	public canRespawn(): boolean {
		// Example, check if entity is in-combat
		// or something?
		return true;
	}

	public isRespawnable(): boolean {
		const { respawnable } = this;
		return respawnable;
	}

	public setRespawnable(value: boolean): void {
		this.respawnable = value;
	}

	public loadCharacter(): Character {
		const { user } = this;
		this.removeCharacter();
		const character = new Character(user);
		if (this.isPlayer()) {
			const { player } = this;
			const rig = character.getInstance();
			player.Character = rig;
		}
		this.character = character;
		return character;
	}

	public removeCharacter(): void {
		const { character } = this;
		if (this.isDestroyed()) {
			return;
		}
		character?.destroy();
	}

	public async initialize(): Promise<void> {
		await this.getData();
	}

	public destroy(): void {
		const { entities, onEntityRemoved } = Entity;
		const { user } = this;
		if (this.isDestroyed()) {
			return;
		}
		entities.delete(user);
		onEntityRemoved.FireDeferred(this);
		super.destroy();
	}
}
