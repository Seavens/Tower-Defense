import { CHARACTER_RESPAWN_WAIT } from "shared/constants/character-constants";
import { Character } from "server/classes/character";
import { Entity } from "server/classes/entity";
import { Events, Functions } from "server/network";
import { Listener } from "shared/classes/listener";
import { Service } from "@flamework/core";
import { reuseThread } from "shared/functions/reuse-thread";
import type { OnPlayerAdded } from "./player-service";
import type { OnStart } from "@flamework/core";

export interface OnCharacterAdded {
	/** @hideinherited */
	onCharacterAdded(character: Character): void;
}

export interface OnCharacterRemoved {
	/** @hideinherited */
	onCharacterRemoved(character: Character): void;
}

export interface OnCharacterDied {
	/** @hideinherited */
	onCharacterDied(character: Character): void;
}

const characterAdded = new Listener<OnCharacterAdded>();
const characterRemoved = new Listener<OnCharacterRemoved>();
const characterDied = new Listener<OnCharacterDied>();

@Service({})
export class CharacterService implements OnStart, OnPlayerAdded {
	public onCharacterAdded(character: Character): void {
		characterAdded.fire(character);
	}

	public onCharacterRemoved(character: Character): void {
		characterRemoved.fire(character);
	}

	public onCharacterDied(character: Character): void {
		characterDied.fire(character);
		const { user } = character;
		const entity = Entity.getEntity(user);
		if (entity === undefined) {
			return;
		}
		task.delay(CHARACTER_RESPAWN_WAIT, (): void => {
			if (!entity.isRespawnable() || !entity.canRespawn()) {
				character.destroy();
				return;
			}
			entity.loadCharacter();
		});
	}

	public onPlayerAdded(entity: Entity): void {
		if (!entity.isPlayer()) {
			return;
		}
		const { player } = entity;
		const { characters } = Character;
		for (const [user, character] of characters) {
			const instance = character.getInstance();
			Events.replicateCharacterAdded(player, user, instance);
		}
	}

	public onStart(): void {
		Functions.requestResetCharacter.setCallback((player: Player): void => {
			const entity = Entity.fromPlayer(player);
			if (!entity.isRespawnable() || !entity.canRespawn()) {
				return;
			}
			entity.loadCharacter();
		});
		Character.onCharacterAdded.Connect((character: Character): void => this.onCharacterAdded(character));
		Character.onCharacterRemoved.Connect((character: Character): void => this.onCharacterRemoved(character));
		Character.onCharacterDied.Connect((character: Character): void => this.onCharacterDied(character));
		const { characters } = Character;
		for (const [_, character] of characters) {
			reuseThread((): void => this.onCharacterAdded(character));
		}
	}
}
