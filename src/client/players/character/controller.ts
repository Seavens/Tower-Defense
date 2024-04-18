import { Animator } from "shared/assets/animator";
import { Bin } from "@rbxts/bin";
import { CHARACTER_ANIMATIONS } from "./constants";
import { Collision, setCollision } from "shared/utility/collision";
import { Controller } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { createListener } from "shared/utility/functions/create-listener";
import { promiseR15 } from "@rbxts/character-promise";
import type { CharacterRigR15 } from "@rbxts/character-promise";
import type { OnPlayerAdded, OnPlayerRemoving } from "client/players/controller";

export interface OnCharacterAdded {
	/** @hideinherited */
	onCharacterAdded(player: Player, character: CharacterRigR15): void;
}

export interface OnCharacterRemoving {
	/** @hideinherited */
	onCharacterRemoving(player: Player, character: Model): void;
}

export interface OnCharacterDied {
	/** @hideinherited */
	onCharacterDied(player: Player, character: Model): void;
}

const characterAdded = createListener<OnCharacterAdded>();
const characterRemoving = createListener<OnCharacterRemoving>();
const characterDied = createListener<OnCharacterDied>();

const { characters } = Workspace;

@Controller({})
export class CharacterController implements OnPlayerAdded, OnPlayerRemoving {
	protected static readonly characters = new Map<Player, CharacterRigR15>();

	protected readonly connections = new Map<Player, Bin>();
	protected readonly bins = new Map<Player, Bin>();

	public static getCharacter(player: Player): Option<CharacterRigR15> {
		const { characters } = this;
		return characters.get(player);
	}

	public async onCharacterAdded(player: Player, model: Model): Promise<void> {
		const { characters: loaded } = CharacterController;
		const { bins } = this;
		const character = await promiseR15(model).timeout(10);
		const bin = new Bin();
		const humanoid = character.Humanoid;
		setCollision(character, Collision.Character, true);
		const ancestry = character.AncestryChanged.Connect((_: Instance, parent?: Instance): void => {
			if (parent === characters) {
				return;
			}
			task.defer((): void => {
				character.Parent = characters;
			});
		});
		const descendant = character.DescendantAdded.Connect((descendant: Instance): void => {
			setCollision(descendant, Collision.Character, true);
		});
		const died = humanoid.Died.Connect((): void => this.onCharacterDied(player, character));
		const animator = new Animator(character, CHARACTER_ANIMATIONS);
		task.defer((): void => {
			character.Parent = characters;
		});
		bin.add(ancestry);
		bin.add(descendant);
		bin.add(died);
		bin.add(animator);
		bins.set(player, bin);
		loaded.set(player, character);
		characterAdded.fire(player, character);
	}

	public onCharacterRemoving(player: Player, character: Model): void {
		const { characters } = CharacterController;
		const { bins } = this;
		const bin = bins.get(player);
		characters.delete(player);
		bins.delete(player);
		bin?.destroy();
		characterRemoving.fire(player, character);
	}

	public onCharacterDied(player: Player, character: Model): void {
		const { characters } = CharacterController;
		characters.delete(player);
		characterDied.fire(player, character);
	}

	public onPlayerAdded(player: Player): void {
		const { connections } = this;
		const bin = new Bin();
		const character = player.Character;

		if (character !== undefined) {
			this.onCharacterAdded(player, character);
		}
		const added = player.CharacterAdded.Connect(
			(model: Model): Promise<void> => this.onCharacterAdded(player, model),
		);
		const removed = player.CharacterRemoving.Connect((model: Model): void =>
			this.onCharacterRemoving(player, model),
		);
		bin.add(added);
		bin.add(removed);
		connections.set(player, bin);
	}

	public onPlayerRemoving(player: Player): void {
		const { connections, bins } = this;
		const conns = connections.get(player);
		const bin = bins.get(player);
		connections.delete(player);
		bins.delete(player);
		conns?.destroy();
		bin?.destroy();
	}
}
