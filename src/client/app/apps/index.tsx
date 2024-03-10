import { HotbarApp } from "./hotbar-app";
import { ReflexProvider } from "@rbxts/roact-reflex";
import { clientProducer } from "client/state/producer";
import Roact from "@rbxts/roact";
import type { Element } from "@rbxts/roact";

export function App(): Element {
	return (
		<screengui IgnoreGuiInset={true} ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling} Key={"app"}>
			<ReflexProvider producer={clientProducer}>
				<HotbarApp />
			</ReflexProvider>
		</screengui>
	);
}
