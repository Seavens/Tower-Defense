import { Dictionary } from "@rbxts/sift";
import { store } from "client/state/store";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect, useMemo } from "@rbxts/react";
import type { ClientProducer, ClientState } from "client/state/store";
import type { Element } from "@rbxts/react";

export function useStoryProducer(state?: DeepPartial<ClientState>): ClientProducer {
	const update = useCallback(
		(producer: ClientProducer): void => {
			if (state === undefined || producer === undefined) {
				return;
			}
			const initial = producer.getState();
			const combined = Dictionary.mergeDeep(initial, state);
			producer.setState(combined);
		},
		[state],
	);

	const producer = useMemo((): ClientProducer => {
		const producer = store.clone();
		update(producer);
		return producer;
	}, []);

	useEffect((): void => {
		update(producer);
	}, [state]);

	useUnmountEffect((): void => {
		producer.destroy();
	});

	return producer;
}
