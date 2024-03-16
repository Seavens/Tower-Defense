import { CreateReactStory } from "@rbxts/ui-labs";
import { GenerateTowerObject } from "shared/functions/tower-functions";
import { ItemSlot } from "../components/item-slot";
import { ReflexProvider, useProducer, useSelector } from "@rbxts/react-reflex";
import { selectInventoryData } from "client/state/selectors";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

function ItemSlotStory(): Element {
	return <ItemSlot />;
}

function Story(): Element {
	return <ItemSlotStory />;
}

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, (props) => {
	return <Story />;
});
