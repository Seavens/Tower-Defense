import { DATA_TEMPLATE, isData } from "shared/types/data";
import { Events } from "server/network";
import { Listener } from "shared/classes/listener";
import { Service } from "@flamework/core";
import { Signal } from "@rbxts/beacon";
import { createCollection } from "@rbxts/lapis";
import { selectData } from "server/state/selectors";
import { serverProducer } from "server/state/producer";
import type { Data } from "shared/types/data";
import type { Document } from "@rbxts/lapis";
import type { Entity } from "server/classes/entity";
import type { OnPlayerAdded, OnPlayerRemoving } from "./player-service";

export interface OnDataLoaded {
	/** @hideinherited */
	onDataLoaded(entity: Entity): void;
}

const dataLoaded = new Listener<OnDataLoaded>();

@Service({})
export class DataService implements OnPlayerAdded, OnPlayerRemoving {
	public static readonly onDataLoaded = new Signal<Entity>();

	public static readonly collection = createCollection("Data|#1", {
		defaultData: DATA_TEMPLATE,
		validate: isData,
	});

	private static readonly documents = new Map<string, Document<Data>>();
	private static readonly loaded = new Set<Entity>();

	public static isDataLoaded(entity: Entity): boolean {
		const { loaded } = this;
		return loaded.has(entity);
	}

	public async onPlayerAdded(entity: Entity): Promise<void> {
		const { onDataLoaded, collection, documents, loaded } = DataService;
		const { user, id } = entity;
		const bin = entity.getBin();
		const index = `Player|#${id}`;
		try {
			const document = await collection.load(index, [id]);
			const data = document.read();
			const unsubscribe = serverProducer.subscribe(selectData(user), (data: Data): void => {
				document.write(data);
			});
			bin.add(unsubscribe);
			serverProducer.dataAdded({ data }, { user, replicate: true });
			documents.set(user, document);
		} catch (err) {
			warn(`${user} encountered an error while loading data! Error:`, err);
			const data = DATA_TEMPLATE;
			serverProducer.dataAdded({ data }, { user, replicate: true });
		}
		loaded.add(entity);
		onDataLoaded.FireDeferred(entity);
		dataLoaded.fire(entity);
		// Goofy!
		if (!entity.isPlayer()) {
			return;
		}
		const { player } = entity;
		Events.replicateDataLoaded(player);
	}

	public async onPlayerRemoving(entity: Entity): Promise<void> {
		const { documents, loaded } = DataService;
		const { user } = entity;
		const document = documents.get(user);
		loaded.delete(entity);
		await document
			?.close()
			.catch(warn)
			.finally((): void => {
				documents.delete(user);
			});
	}
}
