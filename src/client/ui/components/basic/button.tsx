import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element, Ref } from "@rbxts/react";
import React, { forwardRef } from "@rbxts/react";
import type { FrameProps } from "./frame";

export interface ButtonProps extends FrameProps<TextButton> {
	active?: BindingOrValue<boolean>;
	onClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

export const Button = forwardRef(
	(
		{
			active,
			anchorPoint,
			backgroundColor,
			backgroundTransparency,
			change,
			children,
			clipsDescendants,
			cornerRadius,
			event,
			layoutOrder,
			position,
			rotation,
			size,
			visible,
			zIndex,
			onClick,
			onMouseDown,
			onMouseEnter,
			onMouseLeave,
			onMouseUp,
		}: ButtonProps,
		ref: Ref<TextButton>,
	): Element => {
		const events = {
			Activated: onClick && ((): void => onClick()),
			MouseButton1Down: onMouseDown && ((): void => onMouseDown()),
			MouseButton1Up: onMouseUp && ((): void => onMouseUp()),
			MouseEnter: onMouseEnter && ((): void => onMouseEnter()),
			MouseLeave: onMouseLeave && ((): void => onMouseLeave()),
			...event,
		};

		return (
			<textbutton
				ref={ref}
				Active={active}
				Text=""
				AutoButtonColor={false}
				Size={size}
				Position={position}
				AnchorPoint={anchorPoint}
				Rotation={rotation}
				BackgroundColor3={backgroundColor}
				BackgroundTransparency={backgroundTransparency}
				ClipsDescendants={clipsDescendants}
				Visible={visible}
				ZIndex={zIndex}
				LayoutOrder={layoutOrder}
				BorderSizePixel={0}
				Event={events}
				Change={change}
			>
				{children}
				{cornerRadius !== undefined && <uicorner CornerRadius={cornerRadius} />}
			</textbutton>
		);
	},
);
