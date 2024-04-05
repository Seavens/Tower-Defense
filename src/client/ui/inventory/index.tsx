import { Hotbar } from "./hotbar";
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
	const { stored, equipped } = useSelector(selectInventoryData);

	useEffect((): void => {
		if (!tab) {
			return;
		}
		setToggled((value: boolean): boolean => !value);
	}, [tab]);

	return (
		<>
			<Hotbar visible={true} items={stored} equipped={equipped} />
			<Inventory items={stored} equipped={equipped} visible={toggled} onClose={(): void => setToggled(false)} />
		</>
	);
}
