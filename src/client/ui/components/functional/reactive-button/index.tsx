import { type BindingOrValue, composeBindings, lerp, map } from "@rbxts/pretty-react-hooks";
import { Button, Group } from "../../basic";
import { PALETTE, SPRINGS } from "client/ui/constants";
import { useButtonAnimation, useButtonState, useMotion, usePx } from "client/ui/hooks";
import React, { forwardRef, useEffect } from "@rbxts/react";
import type { Element, InstanceEvent, PropsWithChildren, Ref } from "@rbxts/react";

interface ReactiveButtonProps extends PropsWithChildren {
	size: BindingOrValue<UDim2>;
	position: BindingOrValue<UDim2>;
	anchorPoint: BindingOrValue<Vector2>;
	cornerRadius: BindingOrValue<UDim>;
	backgroundColor: BindingOrValue<Color3>;
	backgroundTransparency: BindingOrValue<number>;
	enabled: boolean;
	clipsDescendants?: boolean;
	layoutOrder?: number;
	rotation?: boolean;
	zIndex?: number;
	active?: boolean;
	hoverable?: boolean;
	event?: InstanceEvent<TextButton>;
	onClick?: () => void;
	onLeftClick?: () => void;
	onRightClick?: () => void;
}

export const ReactiveButton = forwardRef(
	(
		{
			size,
			position,
			anchorPoint,
			cornerRadius,
			backgroundColor,
			backgroundTransparency,
			enabled,
			clipsDescendants,
			layoutOrder,
			rotation,
			zIndex,
			active,
			hoverable = true,
			event,
			children,
			onClick,
			onLeftClick,
			onRightClick,
		}: ReactiveButtonProps,
		ref: Ref<TextButton>,
	): Element => {
		const px = usePx();

		const [pressed, hovering, events] = useButtonState(enabled);
		const { hover, position: animated } = useButtonAnimation(pressed, hovering);

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
				key={"reactive-button-group"}
			>
				<Button
					size={UDim2.fromScale(1, 1)}
					position={
						hoverable
							? animated.map((value: number): UDim2 => {
									return UDim2.fromScale(0.5, 0.5).Lerp(new UDim2(0.5, 0, 0.5, px(1)), value);
								})
							: UDim2.fromScale(0.5, 0.5)
					}
					anchorPoint={Vector2.one.mul(0.5)}
					cornerRadius={cornerRadius}
					backgroundColor={
						hoverable
							? composeBindings(
									hover,
									backgroundColor,
									(value: number, color: Color3): Color3 => color.Lerp(PALETTE.white, value / 3),
								)
							: backgroundColor
					}
					backgroundTransparency={composeBindings(
						transparency,
						backgroundTransparency,
						(alpha: number, transparency: number): number => lerp(transparency, 0.75, alpha),
					)}
					clipsDescendants={clipsDescendants}
					rotation={hover.map((value: number): number => (rotation ? map(value, 0, 1, 0, 15) : 0))}
					zIndex={zIndex}
					active={active}
					event={{
						MouseButton1Click: (): void => {
							onLeftClick?.();
							onClick?.();
						},
						MouseButton2Click: (): void => {
							onRightClick?.();
							onClick?.();
						},
						...event,
					}}
					ref={ref}
					key={"reactive-button"}
					{...events}
				>
					{children}
				</Button>
			</Group>
		);
	},
);
