import { $print } from "rbxts-transform-debug";
import { CreateReactStory } from "@rbxts/ui-labs";
import { GenerateTower } from "shared/functions/tower-functions";
import { ItemSlot } from "../components";
import { ReflexProvider, useProducer, useSelector } from "@rbxts/react-reflex";
import { clientProducer } from "client/state/producer";
import { selectInventoryData } from "client/state/selectors";
import { useStoryProducer } from "../hooks";
import React, { useEffect } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { ClientProducer, ClientState } from "client/state/producer";
import type { Element } from "@rbxts/react";

const state: DeepPartial<ClientState> = { inventory: { data: { equipped: [GenerateTower(-1)] } } };

function ItemSlotStory(): Element {
	const { equipped } = useSelector(selectInventoryData);
	const [tower] = equipped;
	const [slot, item] = tower;

	return <ItemSlot tower={item} />;
}

function Story(): Element {
	const producer = useStoryProducer(state);

	return (
		<ReflexProvider producer={producer}>
			<ItemSlotStory />
		</ReflexProvider>
	);
}

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, (props) => {
	return <Story />;
});
