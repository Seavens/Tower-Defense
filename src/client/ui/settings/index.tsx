import { Button, DelayRender, Frame, Group, Text, Transition } from "../components";
import { ColorUtil } from "../utility";
import { EnableSettingsRow } from "./row/enable-row";
import { Events } from "client/network";
import { FONTS, PALETTE, SPRINGS } from "../constants";
import { KeySettingsRow } from "./row/key-row";
import { KeybindSetting, ProfileSetting } from "shared/players/profile/types";
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
	const { visual, audio } = settings;

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
								setTab("Controls");
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
										enable={audio.music}
										settingName={"Music"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.Music,
												value: enabled,
											});
										}}
										onReset={(): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.Music,
												value: true,
											});
											store.profileAdjustSetting({
												setting: ProfileSetting.MusicVol,
												value: 100,
											});
										}}
										layoutOrder={1}
									/>
									{audio.music === true && (
										<PercentSettingsRow
											percent={audio.musicVol}
											settingName={"Music Volume"}
											onClick={(percent: number): void => {
												store.profileAdjustSetting({
													setting: ProfileSetting.MusicVol,
													value: percent,
												});
											}}
											layoutOrder={2}
										/>
									)}
									<EnableSettingsRow
										enable={audio.sfx}
										settingName={"Sound Effects"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.Sfx,
												value: enabled,
											});
										}}
										onReset={(): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.Sfx,
												value: true,
											});
											store.profileAdjustSetting({
												setting: ProfileSetting.SfxVol,
												value: 100,
											});
										}}
										layoutOrder={3}
									/>
									{audio.sfx && (
										<PercentSettingsRow
											percent={audio.sfxVol}
											settingName={"Effect Volume"}
											onClick={(percent: number): void => {
												store.profileAdjustSetting({
													setting: ProfileSetting.SfxVol,
													value: percent,
												});
											}}
											layoutOrder={4}
										/>
									)}
								</>
							)}
							{tab === "Video" && (
								<>
									<EnableSettingsRow
										enable={visual.vfx}
										settingName={"Visual Effects"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.Vfx,
												value: enabled,
											});
										}}
										onReset={(): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.Vfx,
												value: true,
											});
										}}
										layoutOrder={1}
									/>
									<EnableSettingsRow
										enable={visual.shake}
										settingName={"Visual Shake"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.Shake,
												value: enabled,
											});
										}}
										onReset={(): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.Shake,
												value: true,
											});
										}}
										layoutOrder={1}
									/>
									<EnableSettingsRow
										enable={visual.mobBB}
										settingName={"Mob Healthbars"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.MobBB,
												value: enabled,
											});
										}}
										onReset={(): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.MobBB,
												value: true,
											});
										}}
										layoutOrder={2}
									/>
									<EnableSettingsRow
										enable={visual.towerBB}
										settingName={"Tower Statbars"}
										onClick={(enabled: boolean): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.TowerBB,
												value: enabled,
											});
										}}
										onReset={(): void => {
											store.profileAdjustSetting({
												setting: ProfileSetting.TowerBB,
												value: true,
											});
										}}
										layoutOrder={2}
									/>
								</>
							)}
							{tab === "Controls" && (
								<>
									<KeySettingsRow
										keyCode={Enum.KeyCode.One}
										settingName={"Slot 1"}
										onResetClick={(reset: boolean): void => {
											if (reset) {
												store.profileAdjustSetting({
													setting: KeybindSetting.SlotOne,
													value: Enum.KeyCode.One,
												});
											}
										}}
										layoutOrder={1}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Two}
										settingName={"Slot 2"}
										onResetClick={(reset: boolean): void => {
											if (reset) {
												store.profileAdjustSetting({
													setting: KeybindSetting.SlotTwo,
													value: Enum.KeyCode.Two,
												});
											}
										}}
										layoutOrder={2}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Three}
										settingName={"Slot 3"}
										onResetClick={(reset: boolean): void => {
											if (reset) {
												store.profileAdjustSetting({
													setting: KeybindSetting.SlotThree,
													value: Enum.KeyCode.Three,
												});
											}
										}}
										layoutOrder={3}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Four}
										settingName={"Slot 4"}
										onResetClick={(reset: boolean): void => {
											if (reset) {
												store.profileAdjustSetting({
													setting: KeybindSetting.SlotFour,
													value: Enum.KeyCode.Four,
												});
											}
										}}
										layoutOrder={4}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Five}
										settingName={"Slot 5"}
										onResetClick={(reset: boolean): void => {
											if (reset) {
												store.profileAdjustSetting({
													setting: KeybindSetting.SlotFive,
													value: Enum.KeyCode.Five,
												});
											}
										}}
										layoutOrder={5}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Six}
										settingName={"Slot 6"}
										onResetClick={(reset: boolean): void => {
											if (reset) {
												store.profileAdjustSetting({
													setting: KeybindSetting.SlotSix,
													value: Enum.KeyCode.Six,
												});
											}
										}}
										layoutOrder={6}
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
