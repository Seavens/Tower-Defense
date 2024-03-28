import { Button } from "./button";
import { Frame } from "./frame";
import { Group } from "./group";
import { usePx } from "../hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface DropMenuProps {
	position: UDim2;
	size: UDim2;
	anchorPoint: Vector2;
	rotation?: number;
	backgroundColor?: Color3;
	backgroundTransparency?: number;
	clipsDescendants?: boolean;
	zIndex?: number;
	layoutOrder?: number;
	cornerRadius?: UDim;
	children?: Element | Array<Element>;
	onClick?: () => void;
}

export const DropMenu = (props: DropMenuProps): Element => {
	const px = usePx();
	const [open, setOpen] = React.useState(false);
	return (
		<Button
			size={UDim2.fromOffset(px(props.size.X.Offset), px(props.size.Y.Offset))}
			position={props.position}
			anchorPoint={props.anchorPoint}
			rotation={props.rotation}
			backgroundColor={props.backgroundColor}
			backgroundTransparency={props.backgroundTransparency}
			zIndex={props.zIndex}
			layoutOrder={props.layoutOrder}
			cornerRadius={props.cornerRadius}
			onClick={() => {
				if (open) {
					setOpen(false);
				} else {
					setOpen(true);
				}
				props.onClick?.();
			}}
		>
			<Frame
				size={UDim2.fromOffset(100, 1000)}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.75, 0.5)}
				clipsDescendants={true}
				visible={open}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				{props.children}
			</Frame>
		</Button>
	);
};

// <Button
// 				size={props.size}
// 				position={props.position}
// 				anchorPoint={props.anchorPoint}
// 				rotation={props.rotation}
// 				backgroundColor={props.backgroundColor}
// 				backgroundTransparency={props.backgroundTransparency}
// 				zIndex={props.zIndex}
// 				layoutOrder={props.layoutOrder}
// 				cornerRadius={props.cornerRadius}
// 				onClick={() => {
// 					if (open) {
// 						setOpen(false);
// 					} else {
// 						setOpen(true);
// 					}
// 				}}
// 			/>
// 			<Frame
// 				size={UDim2.fromScale(0.95, 0.95)}
// 				anchorPoint={new Vector2(0.5, 0.5)}
// 				position={UDim2.fromScale(0.5, 0.5)}
// 				clipsDescendants={true}
// 				visible={open}
// 			>
// 				<uilistlayout
// 					FillDirection={Enum.FillDirection.Vertical}
// 					HorizontalAlignment={Enum.HorizontalAlignment.Center}
// 					VerticalAlignment={Enum.VerticalAlignment.Center}
// 				/>
// 				{props.children}
// 			</Frame>
