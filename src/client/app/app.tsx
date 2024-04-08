import { InventoryApp } from "client/ui/inventory";
import { Layer } from "client/ui/components";
import { MobApp } from "client/ui/mob";
import { ReflexProvider } from "@rbxts/react-reflex";
import { TowerApp } from "client/ui/tower";
import { store } from "client/state/store";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function App(): Element {
	return (
		<ReflexProvider producer={store}>
			<Layer key={"app"}>
				{/* <HotbarApp /> */}
				<InventoryApp />
				<TowerApp />
				<MobApp />
			</Layer>
		</ReflexProvider>
	);
}
