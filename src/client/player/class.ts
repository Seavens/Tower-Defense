import { Entity as API } from "shared/player/api";
import { Bin } from "@rbxts/bin";
import { Character } from "client/character/class";
import { PlayerUtil } from "shared/player/utils";
import { Players, Workspace } from "@rbxts/services";
import { Signal } from "@rbxts/beacon";

const camera = Workspace.CurrentCamera;
const localPlayer = Players.LocalPlayer;

export class Entity extends API<Character> {
	public static readonly entities = new Map<string, Entity>();

	public static readonly onEntityAdded = new Signal<Entity>();
	public static readonly onEntityRemoved = new Signal<Entity>();

	public readonly user: string;
	public readonly id: number;

	protected readonly player?: Player;
	protected readonly bin = new Bin();

	protected character?: Character;
	protected destroyed = false;

	private constructor(user: string, id: number, player?: Player) {
		super(user, id, player);
		const { entities, onEntityAdded } = Entity;
		const { bin } = this;
		this.user = user;
		this.id = id;
		this.player = player;
		bin.add((): void => {
			const { character } = this;
			character?.destroy();
		});
		entities.set(user, this);
		onEntityAdded.FireDeferred(this);
	}

	public static createEntity(user: string, id: number, player?: Player): Entity {
		const { entities } = this;
		let entity = entities.get(user);
		if (entity === undefined) {
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

	public static localEntity(): Entity {
		const localPlayer = Players.LocalPlayer;
		return this.fromPlayer(localPlayer);
	}

	public static getEntity(user: string): Option<Entity> {
		const { entities } = this;
		const entity = entities.get(user);
		return entity;
	}

	public isLocal(): boolean {
		const { user } = this;
		const localUser = PlayerUtil.getUser(localPlayer);
		return user === localUser;
	}

	public loadCharacter(rig: Model): Character {
		const { user } = this;
		this.removeCharacter();
		const character = new Character(user, rig!);
		if (this.isPlayer()) {
			const { humanoid } = character;
			const { player } = this;
			const rig = character.getInstance();
			const primary = rig.PrimaryPart;
			if (primary !== undefined && camera !== undefined && this.isLocal()) {
				camera.CameraSubject = humanoid ?? primary;
			}
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
