import { Character as API } from "shared/api/character";
import { Animator } from "shared/classes/animator";
import { CHARACTER_ANIMATIONS } from "shared/constants/character-constants";
import { EntityUtility } from "shared/modules/entity-utility";
import { Players } from "@rbxts/services";
import { Signal } from "@rbxts/beacon";
import { isAnimationId } from "shared/types/ids";
import type { AnimationId } from "shared/types/ids";
import type { Bin } from "@rbxts/bin";

export class Character extends API {
	public static readonly characters = new Map<string, Character>();

	public static readonly onCharacterAdded = new Signal<Character>();
	public static readonly onCharacterRemoved = new Signal<Character>();

	public declare readonly user: string;
	public declare readonly humanoid?: Humanoid;

	protected declare readonly bin: Bin;
	protected declare readonly instance: Model;

	protected readonly animator?: Animator<AnimationId>;

	protected destroyed = false;

	public constructor(user: string, rig: Model) {
		super(user, rig);
		const { characters, onCharacterAdded } = Character;
		const { bin, instance } = this;
		const anim = instance.FindFirstChildWhichIsA("Animator", true);
		const humanoid = instance.FindFirstChildWhichIsA("Humanoid", true);
		characters.set(user, this);
		onCharacterAdded.FireDeferred(this);
		if (this.isPlayer() && anim !== undefined && humanoid !== undefined) {
			const animator = new Animator<AnimationId>(anim, CHARACTER_ANIMATIONS, isAnimationId);
			this.animator = animator;
			bin.add(animator);
		}
	}

	public static getCharacter(user: string): Option<Character> {
		const { characters } = this;
		const character = characters.get(user);
		return character;
	}

	public static localCharacter(): Option<Character> {
		const localPlayer = Players.LocalPlayer;
		const user = EntityUtility.getUser(localPlayer);
		return this.getCharacter(user);
	}

	public getAnimator(): Option<Animator<AnimationId>> {
		const { animator } = this;
		return animator;
	}

	public destroy(): void {
		const { characters, onCharacterRemoved } = Character;
		const { user } = this;
		if (this.isDestroyed()) {
			return;
		}
		characters.delete(user);
		onCharacterRemoved.FireDeferred(this);
		super.destroy();
	}
}
