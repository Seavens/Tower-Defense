import { Inventory } from "client/ui/inventory/storage/inventory";
import { useEffect, useState } from "@rbxts/react";
import { useKeyPress } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function InventoryApp(): Element {
	const tab = useKeyPress(["Tab"]);
	const [toggled, setToggled] = useState(false);

	useEffect((): void => {
		if (!tab) {
			return;
		}
		setToggled((value: boolean): boolean => !value);
	}, [tab]);

	return <Inventory visible={toggled} onClose={(): void => setToggled((value: boolean): boolean => !value)} />;
}
