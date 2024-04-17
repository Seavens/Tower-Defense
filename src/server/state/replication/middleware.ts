import { Events } from "server/network";
import { IS_EDIT } from "shared/core/constants";
import { createBroadcaster } from "@rbxts/reflex";
import { isBroadcastMetadata, isReplicationMetadata, isUserMetadata } from "shared/state/replication/metadata";
import { selectState } from "./selector";
import type { BroadcastAction, ProducerMiddleware } from "@rbxts/reflex";
import type { BroadcastMetadata, ReplicationMetadata, UserMetadata } from "shared/state/replication/metadata";
import type { ServerSlices } from "server/state/slices";
import type { ServerState } from "../store";
import type { SharedSlices } from "shared/state/slices";

function getMetadata(args: Array<unknown>): (UserMetadata & ReplicationMetadata & BroadcastMetadata) | undefined {
	for (const arg of args) {
		if (!isUserMetadata(arg) && !isReplicationMetadata(arg) && !isBroadcastMetadata(arg)) {
			continue;
		}
		return arg as UserMetadata & ReplicationMetadata & BroadcastMetadata;
	}
	return undefined;
}

function getActions(producers: ServerSlices): Set<string> {
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
		if (user === player.Name) {
			return true;
		}
		return false;
	};
}

export function broadcastMiddleware(slices: SharedSlices & ServerSlices, filtered: ServerSlices): ProducerMiddleware {
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
			const { Name } = player;
			const selector = selectState(Name);
			const selected = selector(state);
			const hydration: Writable<Partial<ServerState>> = {
				...state,
				...selected,
			};
			delete hydration.data;
			return hydration;
		},
		dispatch: (player: Player, actions: Array<BroadcastAction>): void => {
			Events.state.actions(player, actions);
		},
	});
	Events.state.ready.connect((player: Player): void => {
		broadcaster.start(player);
	});
	const { middleware } = broadcaster;
	return middleware;
}
