import { CreateReactStory } from "@rbxts/ui-labs";
import { GenerateTowerObject } from "shared/functions/tower-functions";
import { Inventory } from "../components/inventory";
import { ReflexProvider, useSelector } from "@rbxts/react-reflex";
import { selectInventoryData } from "client/state/selectors";
import { useStoryProducer } from "../hooks";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { ClientState } from "client/state/producer";
import type { Element } from "@rbxts/react";
import type { TowerObject } from "shared/types/objects";

const stored = new Map<string, TowerObject>();
for (const index of $range(1, 25)) {
	const key = `${index}`;
	const tower = GenerateTowerObject(-1);
	stored.set(key, tower);
}
const state: DeepPartial<ClientState> = { inventory: { data: { stored } } };

function InventoryStory(): Element {
	const { stored, equipped } = useSelector(selectInventoryData);

	return <Inventory stored={stored} equipped={equipped} />;
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
