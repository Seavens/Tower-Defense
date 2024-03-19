import { Dictionary } from "@rbxts/sift";
import { clientProducer } from "client/state/producer";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect, useMemo } from "@rbxts/react";
import type { ClientProducer, ClientState } from "client/state/producer";
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
		const producer = clientProducer.clone();
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
