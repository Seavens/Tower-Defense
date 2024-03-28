// Resourced from Littensy: https://github.com/littensy/slither
import React from "@rbxts/react";
import type { Binding, Element } from "@rbxts/react";
import type { FrameProps } from "./frame";

export interface ButtonProps extends FrameProps<TextButton> {
	text?: string | Binding<string> | undefined;
	active?: boolean | React.Binding<boolean>;
	onClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

export function Button(props: ButtonProps): Element {
	const { onClick, onMouseDown, onMouseEnter, onMouseLeave, onMouseUp } = props;

	const event = {
		Activated: onClick && ((): void => onClick()),
		MouseButton1Down: onMouseDown && ((): void => onMouseDown()),
		MouseButton1Up: onMouseUp && ((): void => onMouseUp()),
		MouseEnter: onMouseEnter && ((): void => onMouseEnter()),
		MouseLeave: onMouseLeave && ((): void => onMouseLeave()),
		...props.event,
	};

	return (
		<textbutton
			Text={props.text !== undefined ? props.text : ""}
			Active={props.active}
			AutoButtonColor={false}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			BorderSizePixel={0}
			Event={event}
			Change={props.change}
		>
			{props.children}
			{props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
		</textbutton>
	);
}
