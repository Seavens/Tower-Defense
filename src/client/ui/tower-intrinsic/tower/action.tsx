import { Button, Text } from "client/ui/components";
import { FONTS, PALETTE } from "client/ui/constants";
import { Latte } from "@rbxts/catppuccin";
import { composeBindings, map } from "@rbxts/pretty-react-hooks";
import { useButtonAnimation } from "client/ui/hooks/use-button-animation";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { useMotion, usePx } from "client/ui/hooks";
import React, { useEffect } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element } from "@rbxts/react";

export interface TowerActionProps {
	size?: UDim2;
	position: UDim2;
	anchorPoint: Vector2;
	backgroundColor: BindingOrValue<Color3>;
	text: string;
	textColor?: BindingOrValue<Color3>;
	textSize?: number;
	enabled: boolean;
	layoutOrder: number;
	onClick?: () => void;
}

export function TowerAction({
	size,
	position,
	anchorPoint,
	backgroundColor,
	text,
	textColor = Latte.Base,
	textSize,
	enabled,
	layoutOrder,
	onClick,
}: TowerActionProps): Element {
	const px = usePx();

	const [pressed, hovering, events] = useButtonState(enabled);
	const { position: clicked, hover } = useButtonAnimation(pressed, hovering);

	const [transparency, transparencyMotion] = useMotion(0);

	useEffect((): void => {
		transparencyMotion.spring(enabled ? 0 : 1);
	}, [enabled]);

	return (
		<Button
			size={size ?? new UDim2(0.5, -px(2), 1, 0)}
			position={clicked.map(
				(value: number): UDim2 => position.Lerp(position.add(UDim2.fromOffset(0, -px(1))), value),
			)}
			anchorPoint={anchorPoint}
			cornerRadius={new UDim(0, px(3))}
			backgroundColor={composeBindings(
				hover,
				backgroundColor,
				(value: number, color: Color3): Color3 => color.Lerp(PALETTE.lightWhite, value / 3),
			)}
			backgroundTransparency={transparency.map((value: number): number => map(value, 0, 1, 0, 0.4))}
			layoutOrder={layoutOrder}
			onClick={enabled ? onClick : undefined}
			{...events}
			key={"action-button"}
		>
			<Text
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0, 0)}
				anchorPoint={Vector2.zero}
				backgroundTransparency={1}
				text={text}
				textColor={textColor}
				textSize={textSize ?? px(18)}
				font={FONTS.nunito.regular}
				richText={true}
				layoutOrder={2}
				key={"action-text"}
			/>
		</Button>
	);
}
