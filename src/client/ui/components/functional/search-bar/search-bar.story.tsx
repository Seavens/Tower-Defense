import { Boolean, CreateReactStory } from "@rbxts/ui-labs";
import { FONTS, PALETTE } from "client/ui/constants";
import { ItemUtility } from "shared/inventory/utility";
import { SearchBar } from ".";
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
		<SearchBar
			size={UDim2.fromOffset(px(200), px(20))}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={Vector2.one.mul(0.5)}
			cornerRadius={new UDim(0, px(3))}
			backgroundColor={PALETTE.black}
			backgroundTransparency={0.35}
			textXAlignment={"Left"}
			textSize={px(16)}
			textColor={PALETTE.white}
			font={FONTS.nunito.regular}
			clearTextOnFocus={true}
			queries={ItemUtility.getAllItemNames()}
			onSearch={warn}
			enabled={enabled}
		/>
	);
}

export = CreateReactStory(
	{
		name: "Search Bar",
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
