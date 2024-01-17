import { Bin } from "@rbxts/bin";
import { Option } from "@rbxts/rust-classes";
import type { Character } from "./character";
import type { Data } from "shared/types/data";

export abstract class Entity {
	public readonly user: string;
	public readonly id: number;

	protected readonly player?: Player;
	protected readonly bin = new Bin();

	protected destroyed = false;

	protected abstract character?: Character;

	public constructor(user: string, id: number, player?: Player) {
		this.user = user;
		this.id = id;
		this.player = player;
	}

	public getCharacter(): Option<Character> {
		const { character } = this;
		return Option.wrap(character);
	}

	public getBin(): Bin {
		const { bin } = this;
		return bin;
	}

	public isPlayer(): this is Entity & { player: Player } {
		const { player } = this;
		return player !== undefined;
	}

	public isDestroyed(): boolean {
		const { destroyed } = this;
		return destroyed;
	}

	public destroy(): void {
		if (this.isDestroyed()) {
			return;
		}
		const { bin } = this;
		bin.destroy();
		this.destroyed = true;
	}

	public abstract getData(): Data | Promise<Data | void>;
	public abstract loadCharacter(model?: Model): Character;
	public abstract removeCharacter(): void;
}
