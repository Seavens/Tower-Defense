import { Hotbar } from "./hotbar";
import { Inventory } from "./inventory";
import { SettingsMenu } from "../settings";
import { UIKind } from "../types";
import { selectInventoryData } from "client/inventory/selectors";
import { selectOpenUI } from "../selectors";
import { useEffect, useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useStore } from "../hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function InventoryApp(): Element {
	const store = useStore();
	const open = useSelector(selectOpenUI);
	const { stored, equipped } = useSelector(selectInventoryData);

	const [inventoryVisible, setInventoryVisibility] = useState(false);
	const [settingsVisible, setSettingsVisibility] = useState(false);

	useEffect((): void => {
		setInventoryVisibility(open === UIKind.Inventory);
		setSettingsVisibility(open === UIKind.Settings);
	}, [open]);

	return (
		<>
			<Hotbar visible={true} items={stored} equipped={equipped} />
			<Inventory
				items={stored}
				equipped={equipped}
				visible={inventoryVisible}
				onClose={(): void => {
					store.closeUI({ kind: UIKind.Inventory });
				}}
			/>
			<SettingsMenu
				visible={settingsVisible}
				onClose={(): void => {
					store.closeUI({ kind: UIKind.Settings });
				}}
			/>
		</>
	);
}
