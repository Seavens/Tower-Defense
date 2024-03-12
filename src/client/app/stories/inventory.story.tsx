import { CreateReactStory } from "@rbxts/ui-labs";
import { GenerateTower } from "shared/functions/tower-functions";
import { Inventory } from "../components/inventory";
import { ReflexProvider, useSelector } from "@rbxts/react-reflex";
import { selectInventoryData } from "client/state/selectors";
import { useStoryProducer } from "../hooks";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { ClientState } from "client/state/producer";
import type { Element } from "@rbxts/react";
import type { Tower } from "shared/types/objects";

const stored = new Map<string, Tower>();
for (const index of $range(1, 25)) {
	const key = `${index}`;
	const tower = GenerateTower(-1);
	stored.set(key, tower);
}
const state: DeepPartial<ClientState> = { inventory: { data: { stored } } };

function InventoryStory(): Element {
	const { stored } = useSelector(selectInventoryData);

	return <Inventory stored={stored} equipped={[]} />;
}

function Story(): Element {
	const producer = useStoryProducer(state);

	return (
		<ReflexProvider producer={producer}>
			<InventoryStory />
		</ReflexProvider>
	);
}

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, (props) => {
	return <Story />;
});
