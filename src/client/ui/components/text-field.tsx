import { FONTS } from "../constants";
import { Group } from "./group";
import React, { forwardRef, useEffect, useState } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element, Ref } from "@rbxts/react";
import type { TextProps } from "./text";

interface TextFieldProps extends TextProps<TextBox> {
	text?: string;
	placeholderText?: BindingOrValue<string>;
	placeholderColor?: BindingOrValue<Color3>;
	clearTextOnFocus?: BindingOrValue<boolean>;
	multiLine?: BindingOrValue<boolean>;
	textEditable?: BindingOrValue<boolean>;
}

export const TextField = forwardRef(
	(
		{
			anchorPoint,
			backgroundColor,
			backgroundTransparency,
			change,
			children,
			clearTextOnFocus,
			clipsDescendants,
			cornerRadius,
			event,
			font,
			layoutOrder,
			maxVisibleGraphemes,
			multiLine,
			placeholderColor,
			placeholderText,
			position,
			richText,
			rotation,
			size,
			text,
			textAutoResize,
			textColor,
			textEditable,
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
		}: TextFieldProps,
		ref: Ref<TextBox>,
	): Element => {
		const [childRef, setChildRef] = useState<Frame | undefined>(undefined);

		useEffect(() => {
			if (childRef && childRef.Parent?.IsA("TextBox")) {
				childRef.Parent.Text = text ?? "";
			}
		}, [childRef, text]);

		return (
			<textbox
				PlaceholderText={placeholderText}
				PlaceholderColor3={placeholderColor}
				ClearTextOnFocus={clearTextOnFocus}
				MultiLine={multiLine}
				TextEditable={textEditable}
				Font={Enum.Font.Unknown}
				FontFace={font ?? FONTS.inter.regular}
				TextColor3={textColor}
				TextSize={textSize}
				TextTransparency={textTransparency}
				TextWrapped={textWrapped}
				TextXAlignment={textXAlignment}
				TextYAlignment={textYAlignment}
				TextTruncate={textTruncate}
				TextScaled={textScaled}
				LineHeight={textHeight}
				RichText={richText}
				MaxVisibleGraphemes={maxVisibleGraphemes}
				AutomaticSize={textAutoResize}
				Size={size}
				Position={position}
				AnchorPoint={anchorPoint}
				Rotation={rotation}
				BackgroundColor3={backgroundColor}
				BackgroundTransparency={backgroundTransparency ?? 1}
				ClipsDescendants={clipsDescendants}
				Visible={visible}
				ZIndex={zIndex}
				LayoutOrder={layoutOrder}
				BorderSizePixel={0}
				Event={event}
				Change={change}
			>
				{children}
				{cornerRadius !== undefined && <uicorner CornerRadius={cornerRadius} />}
				<Group ref={setChildRef} />
			</textbox>
		);
	},
);
