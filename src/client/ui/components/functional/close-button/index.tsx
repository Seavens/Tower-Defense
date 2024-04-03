import { type BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element } from "@rbxts/react";
import React from "@rbxts/react";
import { PALETTE } from "client/ui/constants";
import { usePx } from "client/ui/hooks";
import { Text } from "../../basic";
import { ReactiveButton } from "../reactive-button";

interface CloseButtonProps {
	size: BindingOrValue<UDim2>;
	position: BindingOrValue<UDim2>;
	anchorPoint: BindingOrValue<Vector2>;
	textSize: number;
	layoutOrder?: number;
	enabled: boolean;
	onClose?: () => void;
}

export function CloseButton({
	size,
	position,
	anchorPoint,
	textSize,
	layoutOrder,
	enabled,
	onClose,
}: CloseButtonProps): Element {
	const px = usePx();

	return (
		<ReactiveButton
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			cornerRadius={new UDim(0, px(3))}
			backgroundColor={PALETTE.red}
			backgroundTransparency={0}
			rotation={true}
			enabled={enabled}
			onClick={onClose}
			layoutOrder={layoutOrder}
			key={"close-button"}
		>
			<Text
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0.5, 0.435)}
				anchorPoint={Vector2.one.mul(0.5)}
				text={"×"}
				textColor={PALETTE.white}
				textSize={textSize}
				textWrapped={true}
				key={"close-text"}
			/>
		</ReactiveButton>
	);
}
