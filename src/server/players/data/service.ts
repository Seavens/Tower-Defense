import { COLLECTION_KEY, COLLECTION_NAME } from "./constants";
import { DATA_TEMPLATE } from "shared/players/data/constants";
import { DataUtil } from "./utility";
import { Events } from "server/network";
import { IS_STUDIO, USE_MOCK_DATA, WIPE_MOCK_DATA } from "shared/core/constants";
import { Service } from "@flamework/core";
import { createCollection } from "@rbxts/lapis";
import { createListener } from "shared/utility/functions/create-listener";
import { isData } from "shared/players/data/types";
import { selectData } from "./selector";
import { store } from "server/state/store";
import type { Data } from "shared/players/data/types";
import type { Document } from "@rbxts/lapis";
import type { OnPlayerAdded, OnPlayerRemoving } from "server/players/service";

export interface OnDataLoaded {
	/** @hideinherited */
	onDataLoaded(player: Player): void;
}

const dataLoaded = createListener<OnDataLoaded>();

@Service({})
export class DataService implements OnPlayerAdded, OnPlayerRemoving {
	protected static readonly collection = createCollection(COLLECTION_NAME, {
		defaultData: DATA_TEMPLATE,
		validate: isData,
	});

	protected static readonly documents = new Map<string, Document<Data>>();
	protected static readonly subscriptions = new Map<Player, () => void>();
	private static readonly loaded = new Set<Player>();

	public static isPlayerLoaded(player: Player): boolean {
		const { loaded } = this;
		return loaded.has(player);
	}

	public async onPlayerAdded(player: Player): Promise<void> {
		const { subscriptions, collection, documents, loaded } = DataService;
		if (IS_STUDIO && USE_MOCK_DATA && WIPE_MOCK_DATA) {
			await DataUtil.attemptDataWipe(player);
		}
		const { Name, UserId } = player;
		const index = `${COLLECTION_KEY}${UserId}`;
		try {
			const document = await collection.load(index, [UserId]);
			const data = document.read();
			const unsubscribe = store.subscribe(selectData(Name), (data: Data): void => {
				document.write(data);
			});
			subscriptions.set(player, unsubscribe);
			store.dataAdded({ data }, { user: Name, replicate: true });
			documents.set(Name, document);
		} catch (err) {
			warn(`${Name} encountered an error while loading data! Error:`, err);
			const data = DATA_TEMPLATE;
			store.dataAdded({ data }, { user: Name, replicate: true });
		}
		loaded.add(player);
		dataLoaded.fire(player);
		Events.player.loaded(player);
	}

	public async onPlayerRemoving(player: Player): Promise<void> {
		const { documents, loaded } = DataService;
		const { Name } = player;
		const document = documents.get(Name);
		loaded.delete(player);
		await document
			?.close()
			.catch(warn)
			.finally((): void => {
				loaded.delete(player);
				documents.delete(Name);
			});
	}
}
