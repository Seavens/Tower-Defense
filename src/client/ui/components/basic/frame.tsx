import { forwardRef } from "@rbxts/react";
import React from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { InstanceChangeEvent, InstanceEvent, PropsWithChildren, Ref } from "@rbxts/react";

export interface FrameProps<T extends Instance = Frame> extends PropsWithChildren {
	event?: InstanceEvent<T>;
	change?: InstanceChangeEvent<T>;
	size?: BindingOrValue<UDim2>;
	position?: BindingOrValue<UDim2>;
	anchorPoint?: BindingOrValue<Vector2>;
	rotation?: BindingOrValue<number>;
	backgroundColor?: BindingOrValue<Color3>;
	backgroundTransparency?: BindingOrValue<number>;
	clipsDescendants?: BindingOrValue<boolean>;
	visible?: BindingOrValue<boolean>;
	zIndex?: BindingOrValue<number>;
	layoutOrder?: BindingOrValue<number>;
	cornerRadius?: BindingOrValue<UDim>;
}

export const Frame = forwardRef(
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
			layoutOrder,
			position,
			rotation,
			size,
			visible,
			zIndex,
		}: FrameProps,
		ref: Ref<Frame>,
	) => {
		return (
			<frame
				ref={ref}
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
				Event={event}
				Change={change}
			>
				{children}
				{cornerRadius !== undefined && <uicorner CornerRadius={cornerRadius} />}
			</frame>
		);
	},
);
