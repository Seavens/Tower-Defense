import { Button, Frame, Group, Image, Text } from "..";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element } from "@rbxts/react";

import { Darken } from "@rbxts/colour-utils";
import { DropdownOption } from "../drop-down/option";
import { FONTS } from "client/ui/constants";
import { Latte } from "@rbxts/catppuccin";
import { useButtonAnimation } from "client/ui/hooks/use-button-animation";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { usePx } from "client/ui/hooks";

export interface ContextMenuProps {
	size?: UDim2;
	position?: BindingOrValue<UDim2>;
	anchorPoint?: BindingOrValue<Vector2>;
	cornerRadius?: BindingOrValue<UDim>;
	options: Array<string>;
	index: number;
	enabled?: boolean;
	onClick: (option: string) => void;
	backgroundColor: Color3;
	textColor: Color3;
	strokeColor?: Color3;
	dislayHeader?: boolean;
}

export function ContextMenuText({
	size,
	position = UDim2.fromScale(0.5, 0.5),
	anchorPoint = Vector2.one.mul(0.5),
	cornerRadius,
	options,
	index,
	enabled,
	onClick,
	backgroundColor,
	textColor,
	strokeColor,
	dislayHeader,
}: ContextMenuProps): Element {
	const px = usePx();

	const OUTLINE = Darken(backgroundColor, 0.25);

	size ??= UDim2.fromOffset(px(200), px(16));

	const height = size?.Y.Offset ?? px(16);

	const [open, setOpen] = useState(false);
	const [pressed, hovering, events] = useButtonState(enabled);
	const { hover } = useButtonAnimation(pressed, hovering);

	const [selected, setSelected] = useState(1);

	const elements = useMemo((): Array<Element> => {
		const elements = new Array<Element>();
		for (const index of $range(1, options.size())) {
			const option = options[index - 1];
			const element = (
				<DropdownOption
					size={new UDim2(1, -px(3), 0, height)}
					text={option}
					enabled={true}
					visible={open}
					backgroundColor={backgroundColor}
					onLeftClick={(): void => {
						onClick?.(option);
						setSelected(index);
						setOpen(false);
					}}
				/>
			);
			elements.push(element);
		}
		return elements;
	}, [height, options, open]);

	useEffect((): void => {
		setSelected(index);
	}, [index]);

	return (
		<Button
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			cornerRadius={cornerRadius ?? new UDim(0, px(3))}
			backgroundColor={hover.map((value: number): Color3 => backgroundColor.Lerp(backgroundColor, value))}
			{...events}
			onClick={(): void => {
				setOpen((value: boolean): boolean => !value);
			}}
			key={"dropdown-frame"}
			zIndex={10}
		>
			<uistroke
				Color={strokeColor ?? OUTLINE}
				Transparency={strokeColor === undefined ? 1 : 0}
				Thickness={px(1)}
				key={"dropdown-stroke"}
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
			/>
			<Frame
				size={new UDim2(1, 0, 2, 0)}
				position={new UDim2(0, 0, 1, px(1))}
				anchorPoint={new Vector2(0, 0)}
				backgroundTransparency={1}
				key={"context-options"}
			>
				{elements}
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Padding={new UDim()}
					key={"dropdown-layout"}
				/>
			</Frame>
			<Text
				visible={dislayHeader || false}
				size={UDim2.fromOffset(px(16), px(16))}
				position={UDim2.fromScale(1, 1)}
				anchorPoint={Vector2.one}
				font={FONTS.inter.regular}
				text={"v"}
				textColor={textColor}
				textWrapped={true}
				textSize={px(12)}
				key={"dropdown-icon"}
			/>
			<Text
				visible={dislayHeader || false}
				size={new UDim2(1, -px(16), 1, 0)}
				anchorPoint={Vector2.zero}
				position={UDim2.fromScale(0, 0)}
				font={FONTS.inter.regular}
				text={options[selected - 1]}
				textColor={textColor}
				textWrapped={true}
				textSize={px(12)}
				key={"dropdown-selected"}
			/>
		</Button>
	);
}
