import { CreateReactStory } from "@rbxts/ui-labs";
import { GenerateTowerObject } from "shared/functions/tower-functions";
import { Hotbar } from "../components";
import { Inventory } from "../components/inventory";
import { ReflexProvider, useSelector } from "@rbxts/react-reflex";
import { selectInventoryData } from "client/state/selectors";
import { useStoryProducer } from "../hooks";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { ClientState } from "client/state/producer";
import type { Element } from "@rbxts/react";
import type { TowerObject } from "shared/types/objects";

const equipped = new Map<string, TowerObject>();
for (const index of $range(1, 6)) {
	const key = `${index}`;
	const tower = GenerateTowerObject(-1);
	equipped.set(key, tower);
}

const stored = new Map<string, TowerObject>();
for (const index of $range(1, 25)) {
	const key = `${index}`;
	const tower = GenerateTowerObject(-1);
	stored.set(key, tower);
}

const playerProfile = {
	level: 9,
	experience: 50000 / 2,
	coins: 17457,
	gems: 436,
};

const state: DeepPartial<ClientState> = { inventory: { data: { equipped, stored } } };

function HotbarStory(): Element {
	const { equipped, stored } = useSelector(selectInventoryData);
	return <Hotbar inventoryData={{ equipped, stored }} profileData={{ ...playerProfile }} />;
}

function Story(): Element {
	const producer = useStoryProducer(state);

	return (
		<ReflexProvider producer={producer}>
			<HotbarStory />
		</ReflexProvider>
	);
}

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, (props) => {
	return <Story />;
});
