import { type Element, useEffect, useState } from "@rbxts/react";
import { Inventory } from "client/ui/inventory/inventory";
import { useKeyPress } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

export function InventoryApp(): Element {
	const tab = useKeyPress(["Tab"]);
	const [toggled, setToggled] = useState(false);

	useEffect((): void => {
		if (!tab) {
			return;
		}
		setToggled((value: boolean): boolean => !value);
	}, [tab]);

	return <Inventory visable={toggled} onClose={(): void => setToggled((value: boolean): boolean => !value)} />;
}
