import { FONTS } from "../../constants";
import { forwardRef } from "@rbxts/react";
import { usePx } from "../../hooks";
import React from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element, InferEnumNames, Ref } from "@rbxts/react";
import type { FrameProps } from "./frame";

export interface TextProps<T extends Instance = TextLabel> extends FrameProps<T> {
	font?: Font;
	text?: BindingOrValue<string>;
	textColor?: BindingOrValue<Color3>;
	textSize?: BindingOrValue<number>;
	textTransparency?: BindingOrValue<number>;
	textWrapped?: BindingOrValue<boolean>;
	textXAlignment?: InferEnumNames<Enum.TextXAlignment>;
	textYAlignment?: InferEnumNames<Enum.TextYAlignment>;
	textTruncate?: InferEnumNames<Enum.TextTruncate>;
	textScaled?: BindingOrValue<boolean>;
	textHeight?: BindingOrValue<number>;
	textAutoResize?: "X" | "Y" | "XY";
	richText?: BindingOrValue<boolean>;
	maxVisibleGraphemes?: BindingOrValue<number>;
	strokeTransparency?: BindingOrValue<number>;
	strokeColor?: BindingOrValue<Color3>;
}

export const Text = forwardRef(
	(
		{
			anchorPoint,
			backgroundColor,
			backgroundTransparency,
			change,
			children,
			clipsDescendants,
			cornerRadius,
			event,
			font = FONTS.nunito.regular,
			layoutOrder,
			maxVisibleGraphemes,
			position,
			richText,
			rotation,
			size,
			text,
			textAutoResize,
			textColor,
			textHeight,
			textScaled,
			textSize,
			textTransparency,
			textTruncate,
			textWrapped,
			textXAlignment,
			textYAlignment,
			visible,
			zIndex,
			strokeColor,
			strokeTransparency,
		}: TextProps,
		ref: Ref<TextLabel>,
	): Element => {
		const px = usePx();

		return (
			<textlabel
				Font={Enum.Font.Unknown}
				FontFace={font}
				Text={text}
				TextColor3={textColor}
				TextSize={textSize ?? px(1)}
				TextTransparency={textTransparency}
				TextWrapped={textWrapped}
				TextXAlignment={textXAlignment}
				TextYAlignment={textYAlignment}
				TextTruncate={textTruncate}
				TextScaled={textScaled}
				LineHeight={textHeight}
				RichText={richText}
				MaxVisibleGraphemes={maxVisibleGraphemes}
				Size={size}
				AutomaticSize={textAutoResize}
				Position={position}
				AnchorPoint={anchorPoint}
				Rotation={rotation}
				BackgroundColor3={backgroundColor}
				BackgroundTransparency={backgroundTransparency ?? 1}
				ClipsDescendants={clipsDescendants}
				Visible={visible}
				ZIndex={zIndex}
				LayoutOrder={layoutOrder}
				Change={change}
				Event={event}
				TextStrokeColor3={strokeColor}
				TextStrokeTransparency={strokeTransparency}
			>
				{children}
				{cornerRadius !== undefined && <uicorner CornerRadius={cornerRadius} />}
			</textlabel>
		);
	},
);
