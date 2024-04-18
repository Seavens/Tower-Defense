import React, { forwardRef } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { InstanceChangeEvent, InstanceEvent, PropsWithChildren } from "@rbxts/react";

interface GroupProps extends PropsWithChildren {
	event?: InstanceEvent<Frame>;
	change?: InstanceChangeEvent<Frame>;
	size?: BindingOrValue<UDim2>;
	position?: BindingOrValue<UDim2>;
	anchorPoint?: BindingOrValue<Vector2>;
	rotation?: BindingOrValue<number>;
	clipsDescendants?: BindingOrValue<boolean>;
	layoutOrder?: BindingOrValue<number>;
	visible?: BindingOrValue<boolean>;
	zIndex?: BindingOrValue<number>;
}

export const Group = forwardRef(
	(
		{
			anchorPoint,
			change,
			children,
			clipsDescendants,
			event,
			layoutOrder,
			position,
			rotation,
			size,
			visible,
			zIndex,
		}: GroupProps,
		ref: React.Ref<Frame>,
	) => {
		return (
			<frame
				ref={ref}
				Size={size ?? UDim2.fromScale(1, 1)}
				Position={position}
				AnchorPoint={anchorPoint}
				Rotation={rotation}
				ClipsDescendants={clipsDescendants}
				LayoutOrder={layoutOrder}
				Visible={visible}
				ZIndex={zIndex}
				BackgroundTransparency={1}
				Event={event}
				Change={change}
			>
				{children}
			</frame>
		);
	},
);
