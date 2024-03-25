import { Bin } from "@rbxts/bin";
import type { Character } from "shared/character/api";
import type { Data } from "shared/data/types";

export abstract class Entity<T extends Character = Character> {
	public readonly user: string;
	public readonly id: number;

	protected readonly player?: Player;
	protected readonly bin = new Bin();

	protected destroyed = false;

	protected abstract character?: T;

	public constructor(user: string, id: number, player?: Player) {
		this.user = user;
		this.id = id;
		this.player = player;
	}

	public getCharacter(): Option<T> {
		const { character } = this;
		return character;
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

	public abstract loadCharacter(model?: Model): Character;
	public abstract removeCharacter(): void;
}
