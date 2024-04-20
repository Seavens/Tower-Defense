import { ASSET_IDS } from "shared/assets/constants";
import { Button, DelayRender, Frame, Group, ReactiveButton, Text, Transition } from "../components";
import { ColorUtil } from "../utility";
import { EnableSettingsRow } from "./row/enable-row";
import { Events } from "client/network";
import { FONTS, PALETTE, SPRINGS } from "../constants";
import { KeySettingsRow } from "./row/key-row";
import { PercentSettingsRow } from "./row/percent-row";
import { SETTINGS_MENU_SIZE } from "./constants";
import { SettingId } from "shared/players/settings";
import { enable } from "@rbxts/gizmo";
import { selectSettingValues } from "client/players/profile/settings";
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
	const values = useSelector(selectSettingValues);

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
						<ReactiveButton
							size={UDim2.fromScale(1, 0.1)}
							backgroundColor={tab === "Audio" ? light : PALETTE.gray}
							backgroundTransparency={0.5}
							onClick={() => {
								setTab("Audio");
							}}
							key={"audio-button"}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={new Vector2(0.5, 0.5)}
							cornerRadius={new UDim(0, 0)}
							sound={ASSET_IDS.UIClick}
							enabled={true}
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
						</ReactiveButton>
						<ReactiveButton
							size={UDim2.fromScale(1, 0.1)}
							backgroundColor={tab === "Video" ? light : PALETTE.gray}
							backgroundTransparency={0.5}
							onClick={() => {
								setTab("Video");
							}}
							key={"video-button"}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={new Vector2(0.5, 0.5)}
							cornerRadius={new UDim(0, 0)}
							sound={ASSET_IDS.UIClick}
							enabled={true}
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
						</ReactiveButton>
						<ReactiveButton
							size={UDim2.fromScale(1, 0.1)}
							backgroundColor={PALETTE.gray}
							backgroundTransparency={0.5}
							onClick={() => {
								onClose?.();
							}}
							key={"exit-button"}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={new Vector2(0.5, 0.5)}
							cornerRadius={new UDim(0, 0)}
							sound={ASSET_IDS.UIClick}
							enabled={true}
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
						</ReactiveButton>
					</Group>
					<Frame
						size={UDim2.fromOffset(px(SETTINGS_MENU_SIZE.X) / 1.28, px(SETTINGS_MENU_SIZE.Y))}
						anchorPoint={Vector2.one.mul(0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						backgroundTransparency={0.3}
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
										enable={!!values.get(SettingId.ToggleMusic)}
										settingName={"Game Music"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleMusic, value: enabled });
											Events.settings.set(SettingId.ToggleMusic, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleMusic });
											Events.settings.reset(SettingId.ToggleMusic);

											store.setSetting({ id: SettingId.MusicVolume, value: 100 });
											Events.settings.set(SettingId.MusicVolume, 100);
										}}
										layoutOrder={1}
									/>
									{!!values.get(SettingId.ToggleMusic) === true && (
										<PercentSettingsRow
											percent={values.get(SettingId.MusicVolume) as number}
											settingName={"Volume"}
											onClick={(percent: number): void => {
												store.setSetting({ id: SettingId.MusicVolume, value: percent });
												Events.settings.set(SettingId.MusicVolume, percent);
											}}
											layoutOrder={2}
										/>
									)}
									<EnableSettingsRow
										enable={!!values.get(SettingId.ToggleSfx)}
										settingName={"Game Sounds"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleSfx, value: enabled });
											Events.settings.set(SettingId.ToggleSfx, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleSfx });
											Events.settings.reset(SettingId.ToggleSfx);

											store.setSetting({ id: SettingId.SfxVolume, value: 100 });
											Events.settings.set(SettingId.SfxVolume, 100);
										}}
										layoutOrder={3}
									/>
									{!!values.get(SettingId.ToggleSfx) === true && (
										<PercentSettingsRow
											percent={values.get(SettingId.SfxVolume) as number}
											settingName={"Volume"}
											onClick={(percent: number): void => {
												store.setSetting({ id: SettingId.SfxVolume, value: percent });
												Events.settings.set(SettingId.SfxVolume, percent);
											}}
											layoutOrder={4}
										/>
									)}
									<EnableSettingsRow
										enable={!!values.get(SettingId.ToggleUISound)}
										settingName={"UI Sounds"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleUISound, value: enabled });
											Events.settings.set(SettingId.ToggleUISound, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleUISound });
											Events.settings.reset(SettingId.ToggleUISound);

											store.setSetting({ id: SettingId.UIVolume, value: 100 });
											Events.settings.set(SettingId.UIVolume, 100);
										}}
										layoutOrder={5}
									/>
									{!!values.get(SettingId.ToggleUISound) === true && (
										<PercentSettingsRow
											percent={values.get(SettingId.UIVolume) as number}
											settingName={"Volume"}
											onClick={(percent: number): void => {
												store.setSetting({ id: SettingId.UIVolume, value: percent });
												Events.settings.set(SettingId.UIVolume, percent);
											}}
											layoutOrder={6}
										/>
									)}
								</>
							)}
							{tab === "Video" && (
								<>
									<EnableSettingsRow
										enable={!!values.get(SettingId.ToggleVfx)}
										settingName={"Visual Effects"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleVfx, value: enabled });
											Events.settings.set(SettingId.ToggleVfx, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleVfx });
											Events.settings.reset(SettingId.ToggleVfx);
										}}
										layoutOrder={1}
									/>
									<EnableSettingsRow
										enable={!!values.get(SettingId.ToggleShake)}
										settingName={"Visual Shake"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleShake, value: enabled });
											Events.settings.set(SettingId.ToggleShake, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleShake });
											Events.settings.reset(SettingId.ToggleShake);
										}}
										layoutOrder={2}
									/>
									<EnableSettingsRow
										enable={!!values.get(SettingId.ToggleMobBB)}
										settingName={"Mob Healthbars"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleMobBB, value: enabled });
											Events.settings.set(SettingId.ToggleMobBB, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleMobBB });
											Events.settings.reset(SettingId.ToggleMobBB);
										}}
										layoutOrder={3}
									/>
									<EnableSettingsRow
										enable={!!values.get(SettingId.ToggleTowerBB)}
										settingName={"Tower Statbars"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleTowerBB, value: enabled });
											Events.settings.set(SettingId.ToggleTowerBB, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleTowerBB });
											Events.settings.reset(SettingId.ToggleTowerBB);
										}}
										layoutOrder={4}
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
