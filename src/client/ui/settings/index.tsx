import { Button, DelayRender, Frame, Group, Text, Transition } from "../components";
import { ColorUtil } from "../utility";
import { EnableSettingsRow } from "./row/enable-row";
import { FONTS, PALETTE, SPRINGS } from "../constants";
import { PercentSettingsRow } from "./row/percent-row";
import { SETTINGS_MENU_SIZE } from "./constants";
import { selectProfileData } from "client/players/profile/selectors";
import { store } from "client/state/store";
import { useMotion, usePx } from "../hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useEffect, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface SettingMenuProps {
	visible: boolean;
	onClose?: () => void;
}

export function SettingsMenu({ visible, onClose }: SettingMenuProps): Element {
	const px = usePx();

	const light = ColorUtil.lighten(PALETTE.gray, 0.5);

	const [tab, setTab] = useState<"Audio" | "Video" | "Controls">("Audio");
	const [transparency, transparencyMotion] = useMotion(1);
	const { settings } = useSelector(selectProfileData);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.gentle);
	}, [visible]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={1}>
			<Transition
				size={UDim2.fromOffset(px(SETTINGS_MENU_SIZE.X), px(SETTINGS_MENU_SIZE.Y))}
				anchorPoint={Vector2.one.mul(0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				groupTransparency={transparency}
				key={"main-transition"}
			>
				<Group
					size={UDim2.fromScale(1, 1)}
					anchorPoint={Vector2.one.mul(0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
					visible={visible}
					key={"main-group"}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0, px(10))}
					/>
					<Group
						size={UDim2.fromOffset(px(SETTINGS_MENU_SIZE.X) / 5, px(SETTINGS_MENU_SIZE.Y))}
						key={"left-frame"}
					>
						<uilistlayout
							FillDirection={Enum.FillDirection.Vertical}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Top}
							SortOrder={Enum.SortOrder.LayoutOrder}
							Padding={new UDim(0, px(8))}
						/>
						<Button
							size={UDim2.fromScale(1, 0.1)}
							backgroundColor={tab === "Audio" ? light : PALETTE.gray}
							backgroundTransparency={0.5}
							onClick={() => {
								setTab("Audio");
							}}
							key={"audio-button"}
						>
							{tab === "Audio" && (
								<Frame
									size={UDim2.fromScale(0.025, 1)}
									anchorPoint={new Vector2(1, 0.5)}
									position={UDim2.fromScale(0, 0.5)}
									backgroundColor={PALETTE.dark_yellow}
									key={"yellow-selector-audio"}
								/>
							)}
							<Text
								size={UDim2.fromScale(0.95, 1)}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								text={"Sound"}
								textXAlignment="Center"
								textSize={px(40)}
								font={FONTS.inter.medium}
								textColor={PALETTE.white}
								key={"audio-text"}
							/>
						</Button>
						<Button
							size={UDim2.fromScale(1, 0.1)}
							backgroundColor={tab === "Video" ? light : PALETTE.gray}
							backgroundTransparency={0.5}
							onClick={() => {
								setTab("Video");
							}}
							key={"video-button"}
						>
							{tab === "Video" && (
								<Frame
									size={UDim2.fromScale(0.025, 1)}
									anchorPoint={new Vector2(1, 0.5)}
									position={UDim2.fromScale(0, 0.5)}
									backgroundColor={PALETTE.dark_yellow}
									key={"yellow-selector-video"}
								/>
							)}
							<Text
								size={UDim2.fromScale(0.95, 1)}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								text={"Video"}
								textXAlignment="Center"
								textSize={px(40)}
								font={FONTS.inter.medium}
								textColor={PALETTE.white}
								key={"video-text"}
							/>
						</Button>
						<Button
							size={UDim2.fromScale(1, 0.1)}
							backgroundColor={tab === "Controls" ? light : PALETTE.gray}
							backgroundTransparency={0.5}
							onClick={() => {
								setTab;
							}}
							key={"controls-button"}
						>
							{tab === "Controls" && (
								<Frame
									size={UDim2.fromScale(0.025, 1)}
									anchorPoint={new Vector2(1, 0.5)}
									position={UDim2.fromScale(0, 0.5)}
									backgroundColor={PALETTE.dark_yellow}
									key={"yellow-selector-controls"}
								/>
							)}
							<Text
								size={UDim2.fromScale(0.95, 1)}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								text={"Controls"}
								textXAlignment="Center"
								textSize={px(40)}
								font={FONTS.inter.medium}
								textColor={PALETTE.white}
								key={"controls-text"}
							/>
						</Button>
						<Button
							size={UDim2.fromScale(1, 0.1)}
							backgroundColor={PALETTE.gray}
							backgroundTransparency={0.5}
							onClick={() => {
								onClose?.();
							}}
							key={"exit-button"}
						>
							<Text
								size={UDim2.fromScale(0.95, 1)}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								text={"Exit"}
								textXAlignment="Center"
								textSize={px(40)}
								font={FONTS.inter.medium}
								textColor={PALETTE.white}
								key={"video-text"}
							/>
						</Button>
					</Group>
					<Frame
						size={UDim2.fromOffset(px(SETTINGS_MENU_SIZE.X) / 1.28, px(SETTINGS_MENU_SIZE.Y))}
						anchorPoint={Vector2.one.mul(0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						backgroundTransparency={0.5}
						backgroundColor={PALETTE.gray}
						key={"right-frame"}
					>
						<Group
							size={UDim2.fromScale(0.98, 0.98)}
							anchorPoint={Vector2.one.mul(0.5)}
							position={UDim2.fromScale(0.5, 0.5)}
							key={"right-group"}
						>
							<uilistlayout
								FillDirection={Enum.FillDirection.Vertical}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Top}
								SortOrder={Enum.SortOrder.LayoutOrder}
								Padding={new UDim(0, px(4))}
							/>
							{tab === "Audio" && (
								<>
									<EnableSettingsRow
										enable={settings.musicEnabled}
										settingName={"Music"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustMusic({ musicEnabled: enabled });
										}}
										layoutOrder={1}
									/>
									{settings.musicEnabled === true && (
										<PercentSettingsRow
											percent={settings.musicVolume}
											settingName={"Music Volume"}
											onClick={(percent: number): void => {
												store.profileAdjustMusic({ volume: percent });
											}}
											layoutOrder={2}
										/>
									)}
									<EnableSettingsRow
										enable={settings.sfxEnabled}
										settingName={"Sound Effects"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustSfx({ sfxEnabled: enabled });
										}}
										layoutOrder={3}
									/>
									{settings.sfxEnabled && (
										<PercentSettingsRow
											percent={settings.sfxVolume}
											settingName={"Effect Volume"}
											onClick={(percent: number): void => {
												store.profileAdjustSfx({ volume: percent });
											}}
											layoutOrder={4}
										/>
									)}
								</>
							)}
							{tab === "Video" && (
								<>
									<EnableSettingsRow
										enable={settings.vfxEnabled}
										settingName={"Visual Effects"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustVfx({ vfxEnabled: enabled });
										}}
										layoutOrder={1}
									/>
									<EnableSettingsRow
										enable={settings.mobBillboardsEnabled}
										settingName={"Mob Billboards"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustVfx({ mobBillboards: enabled });
										}}
										layoutOrder={2}
									/>
									<EnableSettingsRow
										enable={settings.towerBillboardsEnabled}
										settingName={"Tower Billboards"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustVfx({ towerBillboards: enabled });
										}}
										layoutOrder={2}
									/>
								</>
							)}
						</Group>
					</Frame>
				</Group>
			</Transition>
		</DelayRender>
	);
}
