import { Entity } from "server/classes/entity";
import { Listener } from "shared/classes/listener";
import { Service } from "@flamework/core";
import { reuseThread } from "shared/functions/reuse-thread";
import type { OnStart } from "@flamework/core";

export interface OnEntityAdded {
	/** @hideinherited */
	onEntityAdded(entity: Entity): void;
}

export interface OnEntityRemoved {
	/** @hideinherited */
	onEntityRemoved(entity: Entity): void;
}

const entityAdded = new Listener<OnEntityAdded>();
const entityRemoved = new Listener<OnEntityRemoved>();

@Service({})
export class EntityService implements OnStart {
	public onEntityAdded(entity: Entity): void {
		entityAdded.fire(entity);
	}

	public onEntityRemoved(entity: Entity): void {
		entityRemoved.fire(entity);
	}

	public onStart(): void {
		Entity.onEntityAdded.Connect((entity: Entity): void => this.onEntityAdded(entity));
		Entity.onEntityRemoved.Connect((entity: Entity): void => this.onEntityRemoved(entity));
		const { entities } = Entity;
		for (const [_, entity] of entities) {
			reuseThread((): void => this.onEntityAdded(entity));
		}
	}
}
