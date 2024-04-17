import { App } from "client/ui/app/app";
import { Controller } from "@flamework/core";
import { Players } from "@rbxts/services";
import { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import React from "@rbxts/react";
import type { OnStart } from "@flamework/core";

@Controller({})
export class AppController implements OnStart {
	public onStart(): void {
		const root = createRoot(new Instance("Folder"));
		const target = Players.LocalPlayer.FindFirstChild("PlayerGui") as PlayerGui;
		root.render(<StrictMode>{createPortal(<App />, target)}</StrictMode>);
	}
}
