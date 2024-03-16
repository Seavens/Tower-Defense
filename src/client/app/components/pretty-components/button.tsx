// Resourced from Littensy: https://github.com/littensy/slither
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

import { TowerDefinitions } from "shared/definitions/towers";
import type { FrameProps } from "./frame";
import type { TowerObject } from "shared/types/objects";

export interface ButtonProps extends FrameProps<ImageButton> {
	tower: TowerObject;
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
		Activated: onClick && (() => onClick()),
		MouseButton1Down: onMouseDown && (() => onMouseDown()),
		MouseButton1Up: onMouseUp && (() => onMouseUp()),
		MouseEnter: onMouseEnter && (() => onMouseEnter()),
		MouseLeave: onMouseLeave && (() => onMouseLeave()),
		...props.event,
	};

	return (
		<imagebutton
			Active={props.active}
			Image={TowerDefinitions[props.tower.id].imageId}
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
		</imagebutton>
	);
}
