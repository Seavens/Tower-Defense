import { CreateReactStory } from "@rbxts/ui-labs";
import { GenerateTowerObject } from "shared/functions/tower-functions";
import { ItemSlot } from "../components/item-slot";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";

// const tower = GenerateTowerObject(-1);

// function ItemSlotStory(): Element {
// 	return <ItemSlot {...tower} />;
// }

// function Story(): Element {
// 	return <ItemSlotStory />;
// }

export = CreateReactStory({ react: React, reactRoblox: ReactRoblox }, (props) => {
	return <ItemSlot />;
});
