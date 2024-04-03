import { COLLECTION_KEY, COLLECTION_NAME } from "./constants";
import { DATA_TEMPLATE } from "shared/data/constants";
import { DataUtil } from "./utils";
import { Events } from "server/network";
import { Service } from "@flamework/core";
import { Signal } from "@rbxts/beacon";
import { USE_MOCK_DATA, WIPE_MOCK_DATA } from "shared/core/constants";
import { createCollection } from "@rbxts/lapis";
import { createListener } from "shared/utils/create-listener";
import { isData } from "shared/data/types";
import { selectData } from "./selector";
import { store } from "server/state/store";
import type { Data } from "shared/data/types";
import type { Document } from "@rbxts/lapis";
import type { Entity } from "server/player/class";
import type { OnPlayerAdded, OnPlayerRemoving } from "../player/service";

export interface OnDataLoaded {
	/** @hideinherited */
	onDataLoaded(entity: Entity): void;
}

const dataLoaded = createListener<OnDataLoaded>();

@Service({})
export class DataService implements OnPlayerAdded, OnPlayerRemoving {
	public static readonly onDataLoaded = new Signal<Entity>();

	public static readonly collection = createCollection(COLLECTION_NAME, {
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
		if (USE_MOCK_DATA && WIPE_MOCK_DATA && entity.isPlayer()) {
			const { player } = entity;
			await DataUtil.attemptDataWipe(player);
		}
		const { onDataLoaded, collection, documents, loaded } = DataService;
		const { user, id } = entity;
		const bin = entity.getBin();
		const index = `${COLLECTION_KEY}${id}`;
		try {
			const document = await collection.load(index, [id]);
			const data = document.read();
			const unsubscribe = store.subscribe(selectData(user), (data: Data): void => {
				document.write(data);
			});
			bin.add(unsubscribe);
			store.dataAdded({ data }, { user, replicate: true });
			documents.set(user, document);
		} catch (err) {
			warn(`${user} encountered an error while loading data! Error:`, err);
			const data = DATA_TEMPLATE;
			store.dataAdded({ data }, { user, replicate: true });
		}
		loaded.add(entity);
		onDataLoaded.FireDeferred(entity);
		dataLoaded.fire(entity);
		// Goofy!
		if (!entity.isPlayer()) {
			return;
		}
		const { player } = entity;
		Events.player.loaded(player);
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
