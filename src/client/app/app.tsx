import { HotbarApp } from "../ui/inventory";
import { Layer } from "client/ui/components";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/state/store";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function App(): Element {
	return (
		<ReflexProvider producer={store}>
			<Layer key={"app"}>
				<HotbarApp />
			</Layer>
		</ReflexProvider>
	);
}
