import { CreateReactStory } from "@rbxts/ui-labs";
import { Hotbar } from "./hotbar";
import { ReflexProvider } from "@rbxts/react-reflex";
import { TowerUtility } from "shared/tower/utility";
import { useStoryProducer } from "../hooks";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { ClientState } from "client/state/store";
import type { Element } from "@rbxts/react";
import type { TowerObject } from "shared/tower/types";

const equipped = new Map<string, TowerObject>();
for (const index of $range(1, 6)) {
	const key = `${index}`;
	const tower = TowerUtility.generateTowerObject(-1);
	equipped.set(key, tower);
}

const stored = new Map<string, TowerObject>();
for (const index of $range(1, 25)) {
	const key = `${index}`;
	const tower = TowerUtility.generateTowerObject(-1);
	stored.set(key, tower);
}

const state: DeepPartial<ClientState> = {
	inventory: { data: { equipped, stored } },
	profile: { data: { level: 1_000_000, experience: 250_000_000_000, coins: 17457, gems: 436 } },
};

function HotbarStory(): Element {
	return <Hotbar />;
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
