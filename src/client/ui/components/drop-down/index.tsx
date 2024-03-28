import { type BindingOrValue, getBindingValue } from "@rbxts/pretty-react-hooks";
import { Button } from "../button";
import { DropdownOption } from "./option";
import { FONTS } from "client/ui/constants";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { Text } from "../text";
import { useButtonAnimation } from "client/ui/hooks/use-button-animation";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { usePx } from "client/ui/hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface DropDownProps {
	size?: UDim2;
	position?: BindingOrValue<UDim2>;
	anchorPoint?: BindingOrValue<Vector2>;
	cornerRadius?: BindingOrValue<UDim>;
	options: Array<string>;
	index: number;
	enabled?: boolean;
	onClick: (option: string) => void;
}

export function DropDown({
	size,
	position = UDim2.fromScale(0.5, 0.5),
	anchorPoint = Vector2.one.mul(0.5),
	cornerRadius,
	options,
	index,
	enabled,
	onClick,
}: DropDownProps): Element {
	const px = usePx();

	size ??= UDim2.fromOffset(px(200), px(16));
	// Assume size is already in `px`
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
					onClick={(): void => {
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
			backgroundColor={hover.map((value: number): Color3 => Mocha.Base.Lerp(Mocha.Overlay0, value))}
			{...events}
			onClick={(): void => {
				setOpen((value: boolean): boolean => !value);
			}}
			key={"dropdown-frame"}
		>
			<scrollingframe
				Size={new UDim2(1, -px(13), 2, 0)}
				Position={new UDim2(0, 0, 1, px(1))}
				AnchorPoint={new Vector2(0, 0)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ScrollBarThickness={px(3)}
				ScrollBarImageColor3={Latte.Base}
				CanvasSize={UDim2.fromOffset(0, open ? height * options.size() : 0)}
				ClipsDescendants={true}
				key={"dropdown-options"}
			>
				{elements}
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					Padding={new UDim()}
					key={"dropdown-layout"}
				/>
			</scrollingframe>
			<Text
				size={UDim2.fromOffset(px(16), px(16))}
				position={UDim2.fromScale(1, 1)}
				anchorPoint={Vector2.one}
				font={FONTS.inter.regular}
				text={"v"}
				textColor={Latte.Base}
				textWrapped={true}
				textSize={px(12)}
				key={"dropdown-icon"}
			/>
			<Text
				size={new UDim2(1, -px(16), 1, 0)}
				anchorPoint={Vector2.zero}
				position={UDim2.fromScale(0, 0)}
				font={FONTS.inter.regular}
				text={options[selected - 1]}
				textColor={Latte.Base}
				textWrapped={true}
				textSize={px(12)}
				key={"dropdown-selected"}
			/>
		</Button>
	);
}
