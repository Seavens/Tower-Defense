import { ASSET_IDS } from "shared/assets/constants";
import { Group, ReactiveButton, Text } from "client/ui/components";
import { PALETTE } from "client/ui/constants";
import { usePx } from "client/ui/hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface SlotActionProps {
	text: string;
	enabled: boolean;
	options: number;
	layoutOrder?: number;
	onClick?: () => void;
}

export function SlotAction({ text, enabled, options, layoutOrder = 1, onClick }: SlotActionProps): Element {
	const px = usePx();

	return (
		<Group
			size={UDim2.fromScale(1, 1 / options)}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={Vector2.one.mul(0.5)}
			layoutOrder={layoutOrder}
			key={"action-group"}
		>
			<ReactiveButton
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={Vector2.one.mul(0.5)}
				cornerRadius={new UDim(0, px(3))}
				backgroundColor={PALETTE.black}
				backgroundTransparency={0.35}
				enabled={enabled}
				onClick={onClick}
				sound={ASSET_IDS.UIClick}
				key={"action-button"}
			>
				<Text
					size={UDim2.fromScale(1, 1)}
					position={UDim2.fromScale(0.5, 0.5)}
					anchorPoint={Vector2.one.mul(0.5)}
					text={text}
					textColor={PALETTE.white}
					textSize={px(16)}
					textWrapped={true}
					richText={true}
					zIndex={2}
					key={"slot-cost"}
				/>
			</ReactiveButton>
			<uipadding
				PaddingBottom={new UDim(0, px(1))}
				PaddingLeft={new UDim(0, px(1))}
				PaddingRight={new UDim(0, px(1))}
				PaddingTop={new UDim(0, px(1))}
				key={"action-padding"}
			/>
		</Group>
	);
}
