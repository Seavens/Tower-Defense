import { forwardRef } from "@rbxts/react";
import React from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element, InferEnumNames, Ref } from "@rbxts/react";
import type { FrameProps } from "./frame";

export interface ImageProps extends FrameProps<ImageLabel> {
	image: string;
	imageColor?: BindingOrValue<Color3>;
	imageTransparency?: BindingOrValue<number>;
	imageRectOffset?: BindingOrValue<Vector2>;
	imageRectSize?: BindingOrValue<Vector2>;
	scaleType?: InferEnumNames<Enum.ScaleType>;
	sliceScale?: BindingOrValue<number>;
	sliceCenter?: BindingOrValue<Rect>;
	tileSize?: BindingOrValue<UDim2>;
}

export const Image = forwardRef(
	(
		{
			image,
			anchorPoint,
			backgroundColor,
			backgroundTransparency,
			change,
			children,
			clipsDescendants,
			cornerRadius,
			event,
			imageColor,
			imageRectOffset,
			imageRectSize,
			imageTransparency,
			layoutOrder,
			position,
			rotation,
			scaleType,
			size,
			sliceCenter,
			sliceScale,
			tileSize,
			visible,
			zIndex,
		}: ImageProps,
		ref: Ref<ImageLabel>,
	): Element => {
		return (
			<imagelabel
				ref={ref}
				Image={image}
				ImageColor3={imageColor}
				ImageTransparency={imageTransparency}
				ImageRectOffset={imageRectOffset}
				ImageRectSize={imageRectSize}
				ScaleType={scaleType}
				SliceScale={sliceScale}
				SliceCenter={sliceCenter}
				TileSize={tileSize}
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
			</imagelabel>
		);
	},
);
