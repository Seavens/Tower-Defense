import { type BindingOrValue, composeBindings, lerp, mapBinding } from "@rbxts/pretty-react-hooks";
import { Frame, Group } from "../../basic";
import { SPRINGS } from "client/ui/constants";
import { forwardRef } from "@rbxts/react";
import { useMotion, usePx } from "client/ui/hooks";
import React, { useEffect } from "@rbxts/react";
import type { InstanceChangeEvent, InstanceEvent, PropsWithChildren, Ref } from "@rbxts/react";

interface ScrollingFrameProps extends PropsWithChildren {
	event?: InstanceEvent<ScrollingFrame>;
	change?: InstanceChangeEvent<ScrollingFrame>;
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
	canvasAutoSize?: "X" | "Y" | "XY";
	canvasPosition?: BindingOrValue<Vector2>;
	canvasSize?: BindingOrValue<UDim2>;
	scrollBarImageColor?: BindingOrValue<Color3>;
	scrollBarImageTransparency?: BindingOrValue<number>;
	scrollBarThickness?: BindingOrValue<number>;
	scrollingDirection?: "X" | "Y" | "XY";
	enabled: boolean;
}

export const ScrollingFrame = forwardRef(
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
			canvasAutoSize,
			canvasPosition,
			canvasSize,
			scrollBarImageColor,
			scrollBarImageTransparency = 0.5,
			scrollBarThickness = 2,
			scrollingDirection,
			enabled,
			visible,
			zIndex,
		}: ScrollingFrameProps,
		ref: Ref<ScrollingFrame>,
	) => {
		const px = usePx();

		const [transparency, transparencyMotion] = useMotion(1);

		useEffect((): void => {
			transparencyMotion.spring(enabled ? 0 : 1, SPRINGS.gentle);
		});

		return (
			<Group
				size={size}
				position={position}
				anchorPoint={anchorPoint}
				layoutOrder={layoutOrder}
				key={"scrolling-group"}
			>
				<scrollingframe
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={Vector2.one.mul(0.5)}
					Rotation={rotation}
					BackgroundColor3={backgroundColor}
					BackgroundTransparency={backgroundTransparency}
					ClipsDescendants={clipsDescendants}
					Visible={visible}
					ZIndex={zIndex}
					LayoutOrder={layoutOrder}
					BorderSizePixel={0}
					AutomaticCanvasSize={canvasAutoSize}
					CanvasPosition={canvasPosition}
					CanvasSize={canvasSize}
					ScrollBarImageColor3={scrollBarImageColor}
					ScrollBarImageTransparency={composeBindings(
						transparency,
						scrollBarImageTransparency,
						(alpha: number, transparency: number): number => lerp(transparency, 0.5, alpha),
					)}
					ScrollBarThickness={scrollBarThickness}
					ScrollingDirection={scrollingDirection}
					ScrollingEnabled={enabled}
					ref={ref}
					Event={event}
					Change={change}
					key={"scrolling-frame"}
				>
					{children}
					{cornerRadius !== undefined && <uicorner CornerRadius={cornerRadius} />}
				</scrollingframe>
				<Frame
					size={mapBinding(scrollBarThickness, (value: number) => new UDim2(0, value, 1, -px(3)))}
					position={UDim2.fromScale(1, 0.5)}
					anchorPoint={new Vector2(1, 0.5)}
					backgroundColor={scrollBarImageColor}
					backgroundTransparency={composeBindings(
						transparency,
						scrollBarImageTransparency,
						(alpha: number, transparency: number): number => lerp(transparency, 0.75, alpha),
					)}
					cornerRadius={new UDim(1, 0)}
					key={"scrolling-bar"}
				/>
			</Group>
		);
	},
);
