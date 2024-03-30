import { Character as API } from "shared/character/api";
import { CHARACTER_ANIMATIONS } from "shared/character/constants";
import { Events } from "server/network";
import { Signal } from "@rbxts/beacon";

import { Animator } from "shared/character/animator";
import { isCharacterAnimation } from "shared/character/types";
import type { Bin } from "@rbxts/bin";
import type { CharacterAnimation } from "shared/character/types";

export class Character extends API {
	public static readonly characters = new Map<string, Character>();

	public static readonly onCharacterAdded = new Signal<Character>();
	public static readonly onCharacterRemoved = new Signal<Character>();
	public static readonly onCharacterDied = new Signal<Character>();

	public declare readonly user: string;
	public declare readonly humanoid?: Humanoid;

	protected declare readonly bin: Bin;
	protected declare readonly instance: Model;

	protected readonly animator?: Animator<CharacterAnimation>;

	protected destroyed = false;

	public constructor(user: string) {
		super(user);
		const { characters, onCharacterAdded } = Character;
		const { instance, bin } = this;
		const anim = instance.FindFirstChildWhichIsA("Animator", true);
		const humanoid = instance.FindFirstChildWhichIsA("Humanoid", true);
		characters.set(user, this);
		onCharacterAdded.FireDeferred(this);
		if (!this.isPlayer() && anim !== undefined && humanoid !== undefined) {
			const animator = new Animator<CharacterAnimation>(anim, CHARACTER_ANIMATIONS, isCharacterAnimation);
			this.animator = animator;
			bin.add(animator);
		}
		if (!this.isPlayer()) {
			Events.character.add.broadcast(user, instance);
		}
	}

	public static getCharacter(user: string): Option<Character> {
		const { characters } = this;
		const character = characters.get(user);
		return character;
	}

	public getAnimator(): Option<Animator<CharacterAnimation>> {
		const { animator: characterAnimator } = this;
		return characterAnimator;
	}

	public setHealth(health: number, max?: number): void {
		const { onCharacterDied } = Character;
		if (!this.isHumanoid()) {
			return;
		}
		const { humanoid } = this;
		max ??= humanoid.MaxHealth;
		const clamped = math.clamp(health, 0, max);
		humanoid.Health = clamped;
		humanoid.MaxHealth = max;
		if (clamped > 0) {
			return;
		}
		onCharacterDied.FireDeferred(this);
	}

	public takeDamage(damage: number): void {
		const { onCharacterDied } = Character;
		if (!this.isHumanoid() || damage <= 0) {
			return;
		}
		const { humanoid } = this;
		const health = humanoid.Health;
		const max = humanoid.MaxHealth;
		const clamped = math.clamp(health - damage, 0, max);
		humanoid.Health = clamped;
		if (clamped > 0) {
			return;
		}
		onCharacterDied.FireDeferred(this);
	}

	public teleportTo(cframe: CFrame): void {
		const { instance } = this;
		instance.PivotTo(cframe);
	}

	public destroy(): void {
		const { characters, onCharacterRemoved } = Character;
		const { user } = this;
		if (this.isDestroyed()) {
			return;
		}
		if (!this.isPlayer()) {
			Events.character.remove.broadcast(user);
		}
		characters.delete(user);
		onCharacterRemoved.FireDeferred(this);
		super.destroy();
	}
}
