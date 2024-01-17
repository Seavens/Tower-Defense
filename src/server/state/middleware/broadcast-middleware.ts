import { EntityUtility } from "shared/modules/entity-utility";
import { Events } from "server/network";
import { IS_EDIT } from "shared/constants/core-constants";
import { createBroadcaster } from "@rbxts/reflex";
import { isBroadcastMetadata, isEntityMetadata, isReplicationMetadata } from "shared/state/metadata";
import { selectState } from "../selectors";
import type { BroadcastAction, ProducerMiddleware } from "@rbxts/reflex";
import type { BroadcastMetadata, EntityMetadata, ReplicationMetadata } from "shared/state/metadata";
import type { ServerProducers, ServerState } from "../producer";
import type { SharedProducers } from "shared/state/slices";

function getMetadata(args: Array<unknown>): (EntityMetadata & ReplicationMetadata & BroadcastMetadata) | undefined {
	for (const arg of args) {
		if (!isEntityMetadata(arg) && !isReplicationMetadata(arg) && !isBroadcastMetadata(arg)) {
			continue;
		}
		// Allows deconstructing.
		return arg as EntityMetadata & ReplicationMetadata & BroadcastMetadata;
	}
	return undefined;
}

function getActions(producers: ServerProducers): Set<string> {
	const filtered = new Set<string>();
	for (const [_, producer] of pairs(producers)) {
		const actions = producer.getActions();
		for (const [name] of pairs(actions)) {
			filtered.add(name);
		}
	}
	return filtered;
}

function createFilter(filtered: Set<string>): (player: Player, actions: BroadcastAction) => boolean {
	return (player: Player, action: BroadcastAction): boolean => {
		const { name, arguments: args } = action;
		if (!filtered.has(name)) {
			return true;
		}
		const metadata = getMetadata(args);
		if (metadata === undefined) {
			return true;
		}
		const { user, broadcast, replicate } = metadata;
		if (replicate !== undefined && !replicate) {
			return false;
		}
		if (broadcast !== undefined && broadcast) {
			return true;
		}
		if (user === EntityUtility.getUser(player)) {
			return true;
		}
		return false;
	};
}

export function broadcastMiddleware(
	slices: SharedProducers & ServerProducers,
	filtered: ServerProducers,
): ProducerMiddleware {
	if (IS_EDIT) {
		return () => (dispatch) => dispatch;
	}
	const actions = getActions(filtered);
	const filter = createFilter(actions);
	const broadcaster = createBroadcaster({
		producers: slices,
		beforeDispatch: (player: Player, action: BroadcastAction): BroadcastAction | undefined => {
			const allowed = filter(player, action);
			return allowed ? action : undefined;
		},
		beforeHydrate: (player: Player, state: ServerState): Partial<ServerState> => {
			const user = EntityUtility.getUser(player);
			const selector = selectState(user);
			const selected = selector(state);
			const hydration: Writable<Partial<ServerState>> = {
				...state,
				...selected,
			};
			delete hydration.data;
			return hydration;
		},
		dispatch: (player: Player, actions: Array<BroadcastAction>): void => {
			Events.replicateActions(player, actions);
		},
	});
	Events.replicateReady.connect((player: Player): void => {
		broadcaster.start(player);
	});
	const { middleware } = broadcaster;
	return middleware;
}
