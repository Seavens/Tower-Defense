import { CreateReactStory } from "@rbxts/ui-labs";
import { GenerateTowerObject } from "shared/functions/tower-functions";
import { Item } from "../components";
import { ReflexProvider, useProducer, useSelector } from "@rbxts/react-reflex";
import { clientProducer } from "client/state/producer";
import { selectInventoryData } from "client/state/selectors";
import { useStoryProducer } from "../hooks";
import React, { useEffect } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { ClientProducer, ClientState } from "client/state/producer";
import type { Element } from "@rbxts/react";

const state: DeepPartial<ClientState> = { inventory: { data: { equipped: [GenerateTowerObject(-1)] } } };

function ItemStory(): Element {
	const { equipped } = useSelector(selectInventoryData);
	const [tower] = equipped;
	const [key, item] = tower;

	return <Item itemKey={key} tower={item} />;
}

function Story(): Element {
	const producer = useStoryProducer(state);

	return (
		<ReflexProvider producer={producer}>
			<ItemStory />
		</ReflexProvider>
	);
}

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, (props) => {
	return <Story />;
});
