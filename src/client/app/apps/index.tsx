import { HotbarApp } from "./hotbar-app";
import { ReflexProvider } from "@rbxts/react-reflex";
import { clientProducer } from "client/state/producer";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function App(): Element {
	return (
		<screengui IgnoreGuiInset={true} ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling} key={"app"}>
			<ReflexProvider producer={clientProducer}>
				<HotbarApp />
			</ReflexProvider>
		</screengui>
	);
}
