import { CreateReactStory, Number } from "@rbxts/ui-labs";
import { DropDown } from ".";
import { Mocha } from "@rbxts/catppuccin";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Dropdown",
		react: React,
		reactRoblox: ReactRoblox,
		controls: {
			length: Number(200, 100, undefined, 1),
			height: Number(12, 12, undefined, 1),
		},
	},
	({ controls }): Element => {
		const { length, height } = controls;
		const size = UDim2.fromOffset(length, height);

		return (
			<DropDown
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
