import { Character } from "./class";
import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { createListener } from "shared/utils/create-listener";
import { reuseThread } from "shared/utils/reuse-thread";
import type { OnStart } from "@flamework/core";

export interface OnCharacterAdded {
	/** @hideinherited */
	onCharacterAdded(entity: Character): void;
}

export interface OnCharacterRemoved {
	/** @hideinherited */
	onCharacterRemoved(entity: Character): void;
}

const characterAdded = createListener<OnCharacterAdded>();
const characterRemoved = createListener<OnCharacterRemoved>();

@Controller({})
export class CharacterController implements OnStart {
	public onCharacterAdded(character: Character): void {
		characterAdded.fire(character);
	}

	public onCharacterRemoved(character: Character): void {
		characterRemoved.fire(character);
	}

	public onStart(): void {
		Events.character.add.connect((user: string, rig: Model): void => {
			const character = Character.getCharacter(user);
			if (character === undefined) {
				return;
			}
			new Character(user, rig);
		});
		Events.character.remove.connect((user: string): void => {
			const character = Character.getCharacter(user);
			if (character === undefined) {
				return;
			}
			character.destroy();
		});
		Character.onCharacterAdded.Connect((entity: Character): void => this.onCharacterAdded(entity));
		Character.onCharacterRemoved.Connect((entity: Character): void => this.onCharacterRemoved(entity));
		const { characters } = Character;
		for (const [_, entity] of characters) {
			reuseThread((): void => this.onCharacterAdded(entity));
		}
	}
}
