import { FONTS, PALETTE } from "client/ui/constants";
import { Group, Image, ReactiveButton, Text } from "../../components";
import { SETTINGS_MENU_ROW_SIZE } from "../constants";
import { usePx } from "../../hooks";
import React, { useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface EnableSettingsRowProps {
	settingName: string;
	enable: boolean;
	layoutOrder?: number;
	onClick?: (enabled: boolean) => void;
	onReset?: () => void;
}

export function EnableSettingsRow({
	enable,
	settingName,
	layoutOrder,
	onClick,
	onReset,
}: EnableSettingsRowProps): Element {
	const px = usePx();

	return (
		<Group
			size={UDim2.fromOffset(px(SETTINGS_MENU_ROW_SIZE.X), px(SETTINGS_MENU_ROW_SIZE.Y))}
			anchorPoint={Vector2.one.mul(0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			layoutOrder={layoutOrder}
			key={"main-group"}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<Group size={UDim2.fromScale(0.42, 1)} key={"main-group"}>
				<Text
					size={UDim2.fromScale(0.95, 1)}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
					text={settingName}
					textXAlignment="Left"
					textSize={px(40)}
					font={FONTS.inter.medium}
					textColor={PALETTE.white}
				/>
			</Group>
			<Group size={UDim2.fromScale(0.58, 1)} key={"main-group"}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, px(4))}
				/>
				<ReactiveButton
					size={UDim2.fromOffset(px(400), px(40))}
					onClick={(): void => onClick?.(!enable)}
					enabled={true}
					backgroundColor={enable === true ? PALETTE.green : PALETTE.dark_red}
					cornerRadius={new UDim(0, px(4))}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
					backgroundTransparency={0}
					key={"center-button"}
				>
					<Text
						size={UDim2.fromScale(0.25, 1)}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						text={enable === true ? "On" : "Off"}
						font={FONTS.inter.medium}
						textColor={PALETTE.accent}
						textSize={px(30)}
						key={"enable-text"}
					/>
				</ReactiveButton>
				<ReactiveButton
					size={UDim2.fromOffset(px(40), px(40))}
					position={UDim2.fromScale(1, 1)}
					anchorPoint={new Vector2(1, 1)}
					backgroundTransparency={0.2}
					backgroundColor={PALETTE.red}
					cornerRadius={new UDim(0, px(4))}
					onClick={(): void => {
						onReset?.();
					}}
					enabled={true}
					key={"reset-button"}
				>
					<Image
						size={UDim2.fromOffset(px(30), px(30))}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						image={"rbxassetid://6723921202"}
						scaleType="Fit"
						key={"right-image"}
					/>
				</ReactiveButton>
			</Group>
		</Group>
	);
}
