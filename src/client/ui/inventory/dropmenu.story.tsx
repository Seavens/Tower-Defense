import { Button } from "../components";
import { CreateReactStory } from "@rbxts/ui-labs";
import { DropMenu } from "../components/drop-menu";
import { usePx } from "../hooks";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

export = CreateReactStory(
	{
		name: "Drop Menu",
		react: React,
		reactRoblox: ReactRoblox,
	},
	(): Element => {
		return (
			<DropMenu
				backgroundColor={new Color3(1, 1, 1)}
				anchorPoint={new Vector2(0.5, 0.5)}
				cornerRadius={new UDim(0.1)}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromOffset(200, 200)}
				children={
					<>
						<Button backgroundColor={new Color3(0, 0, 0)} size={UDim2.fromScale(1, 0.2)} />
						<Button backgroundColor={new Color3(1, 0, 0)} size={UDim2.fromScale(1, 0.2)} />
						<Button backgroundColor={new Color3(0, 0, 0)} size={UDim2.fromScale(1, 0.2)} />
						<Button backgroundColor={new Color3(1, 0, 0)} size={UDim2.fromScale(1, 0.2)} />
						<Button backgroundColor={new Color3(0, 0, 0)} size={UDim2.fromScale(1, 0.2)} />
					</>
				}
			/>
		);
	},
);
