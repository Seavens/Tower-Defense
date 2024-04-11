import { Character as API } from "shared/character/api";
import { Animator } from "shared/character/animator";
import { CHARACTER_ANIMATIONS } from "shared/character/constants";
import { PlayerUtility } from "shared/player/utility";
import { Players } from "@rbxts/services";
import { Signal } from "@rbxts/beacon";
import { SoundEffect } from "shared/classes/sound";
import { isCharacterAnimation } from "shared/character/types";
import type { Bin } from "@rbxts/bin";
import type { CharacterAnimation } from "shared/character/types";

export class Character extends API {
	public static readonly characters = new Map<string, Character>();

	public static readonly onCharacterAdded = new Signal<Character>();
	public static readonly onCharacterRemoved = new Signal<Character>();

	public declare readonly user: string;
	public declare readonly humanoid?: Humanoid;

	protected declare readonly bin: Bin;
	protected declare readonly instance: Model;

	protected readonly animator?: Animator<CharacterAnimation>;

	protected destroyed = false;

	public constructor(user: string, rig: Model) {
		super(user, rig);
		const { characters, onCharacterAdded } = Character;
		const { bin, instance } = this;
		const anim = instance.FindFirstChildWhichIsA("Animator", true);
		const humanoid = instance.FindFirstChildWhichIsA("Humanoid", true);
		const sound = new SoundEffect(instance, "rbxassetid://9046740461");
		sound.destroyAfterPlay(0.2);
		characters.set(user, this);
		onCharacterAdded.FireDeferred(this);
		if (this.isPlayer() && anim !== undefined && humanoid !== undefined) {
			const animator = new Animator<CharacterAnimation>(anim, CHARACTER_ANIMATIONS, isCharacterAnimation);
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
		const user = PlayerUtility.getUser(localPlayer);
		return this.getCharacter(user);
	}

	public getAnimator(): Option<Animator<CharacterAnimation>> {
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
