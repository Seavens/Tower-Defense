import { type BindingOrValue } from "@rbxts/pretty-react-hooks";
import { PALETTE } from "client/ui/constants";
import { ReactiveButton } from "../reactive-button";
import { Text } from "../../basic";
import { usePx } from "client/ui/hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface CloseButtonProps {
	size: BindingOrValue<UDim2>;
	position: BindingOrValue<UDim2>;
	anchorPoint: BindingOrValue<Vector2>;
	textSize: number;
	enabled: boolean;
	sound?: RBXAssetId;
	layoutOrder?: number;
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
	sound,
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
			sound={sound}
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
