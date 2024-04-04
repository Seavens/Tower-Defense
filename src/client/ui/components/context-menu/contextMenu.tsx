import { Button, Frame, Group, Image, Text } from "..";
import { DropdownOption } from "../drop-down/option";
import { FONTS } from "client/ui/constants";
import { useButtonAnimation } from "client/ui/hooks/use-button-animation";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { usePx } from "client/ui/hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element } from "@rbxts/react";

export interface ContextMenuProps {
	options: Array<string>;
	index: number;
	onClick: (option: string) => void;
	backgroundColor: Color3;
	textColor: Color3;
	open: boolean;

	size?: UDim2;
	position?: BindingOrValue<UDim2>;
	anchorPoint?: BindingOrValue<Vector2>;
	cornerRadius?: BindingOrValue<UDim>;
	enabled?: boolean;
	strokeColor?: Color3;
	displayHeader?: boolean;
	elementHeight?: number;
}

export function ContextMenu({
	size,
	position = UDim2.fromScale(0.5, 0.5),
	anchorPoint = Vector2.one.mul(0.5),
	cornerRadius,
	options,
	index,
	enabled,
	onClick,
	open,
	backgroundColor,
	textColor,
	strokeColor,
	displayHeader,
	elementHeight,
}: ContextMenuProps): Element {
	const px = usePx();

	// const OUTLINE = Darken(backgroundColor, 0.25);

	// size ??= UDim2.fromOffset(px(200), px(16));

	const height = elementHeight === undefined ? (size === undefined ? px(16) : size.Y.Offset) : elementHeight;

	// const [open, setOpen] = useState(false);
	const [pressed, hovering] = useButtonState(enabled);
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
						// setOpen(false);
					}}
				/>
			);
			elements.push(element);
		}
		return elements;
	}, [height, options, open]);

	const y = useMemo((): number => {
		return px(height) * options.size();
	}, [px, height, options]);

	useEffect((): void => {
		setSelected(index);
	}, [index]);

	return (
		<Frame
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			backgroundColor={hover.map((value: number): Color3 => backgroundColor.Lerp(backgroundColor, value))}
			// Event={{
			// 	MouseButton2Click: (): void => {
			// 		setOpen((value: boolean): boolean => !value);
			// 	},
			// }}
			key={"context-frame"}
			zIndex={10}
			// active={false}
			// utoButtonColor={false}
			backgroundTransparency={displayHeader === undefined ? 1 : 0}
		>
			<uistroke
				// Color={strokeColor ?? OUTLINE}
				Transparency={strokeColor === undefined ? 1 : 0}
				Thickness={px(1)}
				key={"context-stroke"}
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
			/>
			<Frame
				size={new UDim2(1, 0, 0, px(y))}
				position={UDim2.fromScale(0.5, 0)}
				anchorPoint={new Vector2(0.5, 0)}
				backgroundTransparency={1}
				key={"context-options"}
			>
				{elements}
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Padding={new UDim()}
					key={"context-layout"}
				/>
			</Frame>
			<Text
				visible={displayHeader || false}
				size={UDim2.fromOffset(px(16), px(16))}
				position={UDim2.fromScale(1, 1)}
				anchorPoint={Vector2.one}
				font={FONTS.inter.regular}
				text={"v"}
				textColor={textColor}
				textWrapped={true}
				textSize={px(12)}
				key={"context-icon"}
			/>
			<Text
				visible={displayHeader || false}
				size={new UDim2(1, -px(16), 1, 0)}
				anchorPoint={Vector2.zero}
				position={UDim2.fromScale(0, 0)}
				font={FONTS.inter.regular}
				text={options[selected - 1]}
				textColor={textColor}
				textWrapped={true}
				textSize={px(12)}
				key={"context-selected"}
			/>
		</Frame>
	);
}
