import { CreateReactStory } from "@rbxts/ui-labs";
import { ReflexProvider, useSelector } from "@rbxts/react-reflex";
import { TowerUtility } from "shared/tower/utility";
import { selectInventoryData } from "client/inventory/selectors";
import { useStoryProducer } from "../hooks";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { ClientState } from "client/state/store";
import type { Element } from "@rbxts/react";
import type { TowerObject } from "shared/tower/types";

const stored = new Map<string, TowerObject>();
for (const index of $range(1, 25)) {
	const key = `${index}`;
	const tower = TowerUtility.generateTowerObject(-1);
	stored.set(key, tower);
}
const state: DeepPartial<ClientState> = { inventory: { data: { stored } } };

function InventoryStory(): Element {
	const { stored, equipped } = useSelector(selectInventoryData);

	// return <Inventory stored={stored} equipped={equipped} />;
	return <></>;
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
