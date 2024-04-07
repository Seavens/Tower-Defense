import { Hotbar } from "./hotbar";
import { Inventory } from "./inventory";
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

	const [visible, setVisibility] = useState(false);

	useEffect((): void => {
		setVisibility(open === UIKind.Inventory);
	}, [open]);

	return (
		<>
			<Hotbar visible={true} items={stored} equipped={equipped} />
			<Inventory
				items={stored}
				equipped={equipped}
				visible={visible}
				onClose={(): void => {
					store.closeUI({ kind: UIKind.Inventory });
				}}
			/>
		</>
	);
}
