import { ContextMenu } from "./contextMenu";
import { CreateReactStory, Number } from "@rbxts/ui-labs";
import { Mocha } from "@rbxts/catppuccin";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Context Menu",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			length: Number(100, 100, undefined, 1),
			height: Number(25, 25, undefined, 1),
		},
	},
	({ controls }): Element => {
		const { length, height } = controls;
		const size = UDim2.fromOffset(length, height);
		return (
			<ContextMenu
				size={size}
				options={["One", "Two", "Three"]}
				index={1}
				onClick={warn}
				textColor={Mocha.Overlay0}
				backgroundColor={Mocha.Base}
				strokeColor={Mocha.Overlay1}
			/>
		);
	},
);
