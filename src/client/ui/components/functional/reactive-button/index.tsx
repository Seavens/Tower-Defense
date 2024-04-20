import { ASSET_IDS } from "shared/assets/constants";
import { type BindingOrValue, composeBindings, lerp, map } from "@rbxts/pretty-react-hooks";
import { Button, Group } from "../../basic";
import { PALETTE, SPRINGS } from "client/ui/constants";
import { SettingId } from "shared/players/settings";
import { Workspace } from "@rbxts/services";
import { selectSettingValues } from "client/players/profile/settings";
import { useButtonAnimation, useButtonState, useMotion, usePx } from "client/ui/hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { forwardRef, useEffect, useMemo } from "@rbxts/react";
import type { Element, InstanceEvent, PropsWithChildren, Ref } from "@rbxts/react";

const { debris } = Workspace;

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
	sound?: RBXAssetId;
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
			sound,
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

		const values = useSelector(selectSettingValues);
		const soundEnabled = values.get(SettingId.ToggleUISound);

		const volume = useMemo((): number => {
			if (soundEnabled === false) return 0;
			const UIVolume = values.get(SettingId.UIVolume);
			if (!typeIs(soundEnabled, "boolean") || !soundEnabled) return 0;
			if (!typeIs(UIVolume, "number")) return 0;
			return UIVolume;
		}, [values]);

		const handleClick = (): void => {
			if (sound === undefined) return;
			const _sound = new Instance("Sound");
			_sound.SoundId = sound;
			_sound.Parent = debris;
			_sound.Volume = volume / 100;
			_sound.PlayOnRemove = true;
			_sound.Destroy();
		};

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
							handleClick();
							onLeftClick?.();
							onClick?.();
						},
						MouseButton2Click: (): void => {
							handleClick();
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
