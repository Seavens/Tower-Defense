import { Events } from "client/network";
import { IS_EDIT } from "shared/core/core-constants";
import { createBroadcastReceiver } from "@rbxts/reflex";
import type { BroadcastAction, ProducerMiddleware } from "@rbxts/reflex";

export function receiverMiddleware(): ProducerMiddleware {
	if (IS_EDIT) {
		return () => (dispatch) => dispatch;
	}
	const receiver = createBroadcastReceiver({
		start: () => Events.state.ready(),
	});
	Events.state.actions.connect((actions: Array<BroadcastAction>): void => {
		warn(actions);
		receiver.dispatch(actions);
	});
	Events.state.hydrate.connect((state: defined) => {
		warn(state);
		receiver.hydrate(state);
	});
	const { middleware } = receiver;
	return middleware;
}
