import { Events } from "client/network";
import { IS_EDIT } from "shared/constants/core-constants";
import { createBroadcastReceiver } from "@rbxts/reflex";
import type { BroadcastAction, ProducerMiddleware } from "@rbxts/reflex";

export function receiverMiddleware(): ProducerMiddleware {
	if (IS_EDIT) {
		return () => (dispatch) => dispatch;
	}
	const receiver = createBroadcastReceiver({
		start: () => {},
	});
	Events.replicateActions.connect((actions: Array<BroadcastAction>): void => {
		receiver.dispatch(actions);
	});
	Events.replicateHydration.connect((state: defined) => {
		warn(state);
		receiver.hydrate(state);
	});
	const { middleware } = receiver;
	return middleware;
}
