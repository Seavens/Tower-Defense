import { ASSET_IDS } from "shared/assets/constants";
import { FONTS, PALETTE } from "client/ui/constants";
import { Frame, Group, Image, ReactiveButton, Text } from "../../components";
import { SETTINGS_MENU_ROW_SIZE } from "../constants";
import { SettingId } from "shared/players/settings";
import { Workspace } from "@rbxts/services";
import { selectSettingValues } from "client/players/profile/settings";
import { usePx } from "../../hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface PercentSettingsRowProps {
	settingName: string;
	percent: number;
	layoutOrder?: number;
	onClick?: (percent: number) => void;
}

export function PercentSettingsRow({ percent, settingName, layoutOrder, onClick }: PercentSettingsRowProps): Element {
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
					size={UDim2.fromOffset(px(40), px(40))}
					position={UDim2.fromScale(1, 1)}
					anchorPoint={new Vector2(1, 1)}
					backgroundTransparency={0.2}
					backgroundColor={PALETTE.light_gray}
					cornerRadius={new UDim(0, px(4))}
					onClick={(): void => {
						onClick?.(percent - 5 < 0 ? 0 : percent - 5);
					}}
					enabled={true}
					sound={ASSET_IDS.UIClick}
					key={"left-button"}
				>
					<Image
						size={UDim2.fromOffset(px(30), px(30))}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						image={"rbxassetid://17183391337"}
						rotation={180}
						scaleType="Fit"
						key={"left-image"}
					/>
				</ReactiveButton>
				<Group size={UDim2.fromOffset(px(355), px(40))} key={"center-group"}>
					<Frame
						size={UDim2.fromScale(percent / 100, 1)}
						cornerRadius={new UDim(0, px(4))}
						backgroundTransparency={0.4}
						backgroundColor={PALETTE.dark_yellow}
						key={"moving-frame"}
					/>
					<Text
						size={UDim2.fromScale(0.25, 1)}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						text={`${percent}%`}
						font={FONTS.inter.medium}
						textColor={PALETTE.accent}
						textSize={px(30)}
						key={"music-volume-text"}
					/>
				</Group>
				<ReactiveButton
					size={UDim2.fromOffset(px(40), px(40))}
					position={UDim2.fromScale(1, 1)}
					anchorPoint={new Vector2(1, 1)}
					backgroundTransparency={0.2}
					backgroundColor={PALETTE.light_gray}
					cornerRadius={new UDim(0, px(4))}
					onClick={(): void => {
						onClick?.(percent + 5 > 100 ? 100 : percent + 5);
					}}
					enabled={true}
					sound={ASSET_IDS.UIClick}
					key={"right-button"}
				>
					<Image
						size={UDim2.fromOffset(px(30), px(30))}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						image={"rbxassetid://17183391337"}
						scaleType="Fit"
						key={"right-image"}
					/>
				</ReactiveButton>
			</Group>
		</Group>
	);
}
