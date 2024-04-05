import { Inventory } from "./inventory";
import { selectInventoryData } from "client/inventory/selectors";
import { useEffect, useState } from "@rbxts/react";
import { useKeyPress } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function InventoryApp(): Element {
	const tab = useKeyPress(["Tab"]);
	const [toggled, setToggled] = useState(false);
	const { stored } = useSelector(selectInventoryData);

	useEffect((): void => {
		if (!tab) {
			return;
		}
		setToggled((value: boolean): boolean => !value);
	}, [tab]);

	return (
		<>
			{/* <Hotbar visible={!toggled} /> */}
			<Inventory items={stored} visible={toggled} />
		</>
	);
}
