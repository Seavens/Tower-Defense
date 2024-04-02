import { HotbarApp } from "../ui/inventory/hotbar";
import { InventoryApp } from "./inventory-app";
import { Layer } from "client/ui/components";
import { ReflexProvider } from "@rbxts/react-reflex";
import { TowerApp } from "client/ui/tower";
import { store } from "client/state/store";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function App(): Element {
	return (
		<ReflexProvider producer={store}>
			<Layer key={"app"}>
				<HotbarApp />
				<InventoryApp />
				<TowerApp />
			</Layer>
		</ReflexProvider>
	);
}
