import { Boolean, CreateReactStory } from "@rbxts/ui-labs";
import { CloseButton } from ".";
import { store } from "client/state/store";
import { usePx } from "client/ui/hooks";
import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import type { Element } from "@rbxts/react";

interface StoryProps {
	enabled: boolean;
}

function Story({ enabled }: StoryProps): Element {
	const px = usePx();

	return (
		<CloseButton
			size={UDim2.fromOffset(px(20), px(20))}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={Vector2.one.mul(0.5)}
			textSize={px(25)}
			onClose={(): void => warn("Closed")}
			enabled={enabled}
		/>
	);
}

export = CreateReactStory(
	{
		name: "Close Button",
		controls: {
			enabled: Boolean(true),
		},
		react: React,
		reactRoblox: ReactRoblox,
		cleanup: (): void => {
			store.resetState();
		},
	},
	({ controls }): Element => {
		const { enabled } = controls;

		return <Story enabled={enabled} />;
	},
);
