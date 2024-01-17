import { IS_STUDIO } from "shared/constants/core-constants";
import { ReplicatedStorage } from "@rbxts/services";
import type { ProducerMiddleware } from "@rbxts/reflex";

const event = ReplicatedStorage.FindFirstChild("REFLEX_DEVTOOLS") as RemoteEvent;

export function devToolsMiddleware(): ProducerMiddleware {
	return () =>
		(dispatch, name) =>
		(...args) => {
			const state = dispatch(...args);
			if (IS_STUDIO && event !== undefined) {
				event.FireServer({ name, args: [...args], state });
			}
			return state;
		};
}
