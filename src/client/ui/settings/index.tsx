import { Button, DelayRender, Frame, Group, Text, Transition } from "../components";
import { ColorUtil } from "../utility";
import { EnableSettingsRow } from "./row/enable-row";
import { Events } from "client/network";
import { FONTS, PALETTE, SPRINGS } from "../constants";
import { KeySettingsRow } from "./row/key-row";
import { PercentSettingsRow } from "./row/percent-row";
import { SETTINGS_MENU_SIZE } from "./constants";
import { SettingId } from "shared/players/settings";
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
										// eslint-disable-next-line roblox-ts/lua-truthiness
										enable={!!values.get(SettingId.ToggleMusic)}
										settingName={"Music"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleMusic, value: enabled });
											Events.settings.set(SettingId.ToggleMusic, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleMusic });
											Events.settings.reset(SettingId.ToggleMusic);
										}}
										layoutOrder={1}
									/>
									{!!values.get(SettingId.ToggleMusic) === true && (
										<PercentSettingsRow
											percent={values.get(SettingId.MusicVolume) as number}
											settingName={"Music Volume"}
											onClick={(percent: number): void => {
												store.setSetting({ id: SettingId.MusicVolume, value: percent });
												Events.settings.set(SettingId.MusicVolume, percent);
											}}
											layoutOrder={2}
										/>
									)}
									<EnableSettingsRow
										// eslint-disable-next-line roblox-ts/lua-truthiness
										enable={!!values.get(SettingId.ToggleSfx)}
										settingName={"Sound Effects"}
										onClick={(enabled: boolean): void => {
											store.setSetting({ id: SettingId.ToggleSfx, value: enabled });
											Events.settings.set(SettingId.ToggleSfx, enabled);
										}}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.ToggleSfx });
											Events.settings.reset(SettingId.ToggleSfx);
										}}
										layoutOrder={1}
									/>
									{!!values.get(SettingId.SfxVolume) === true && (
										<PercentSettingsRow
											percent={values.get(SettingId.SfxVolume) as number}
											settingName={"Sound Volume"}
											onClick={(percent: number): void => {
												store.setSetting({ id: SettingId.SfxVolume, value: percent });
												Events.settings.set(SettingId.SfxVolume, percent);
											}}
											layoutOrder={2}
										/>
									)}
								</>
							)}
							{tab === "Video" && (
								<>
									<EnableSettingsRow
										// eslint-disable-next-line roblox-ts/lua-truthiness
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
									/>
									<EnableSettingsRow
										// eslint-disable-next-line roblox-ts/lua-truthiness
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
										layoutOrder={1}
									/>
									<EnableSettingsRow
										// eslint-disable-next-line roblox-ts/lua-truthiness
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
										layoutOrder={2}
									/>
									<EnableSettingsRow
										// eslint-disable-next-line roblox-ts/lua-truthiness
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
										layoutOrder={2}
									/>
								</>
							)}
							{tab === "Controls" && (
								<>
									<KeySettingsRow
										keyCode={Enum.KeyCode.One}
										settingName={"Slot 1"}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.SlotOne });
											Events.settings.reset(SettingId.SlotOne);
										}}
										onSubmit={(keycode: Keycode): void => {
											store.setSetting({ id: SettingId.SlotOne, value: keycode });
											Events.settings.set(SettingId.SlotOne, keycode);
										}}
										layoutOrder={1}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Two}
										settingName={"Slot 2"}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.SlotTwo });
											Events.settings.reset(SettingId.SlotTwo);
										}}
										onSubmit={(keycode: Keycode): void => {
											store.setSetting({ id: SettingId.SlotTwo, value: keycode });
											Events.settings.set(SettingId.SlotTwo, keycode);
										}}
										layoutOrder={2}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Three}
										settingName={"Slot 3"}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.SlotThree });
											Events.settings.reset(SettingId.SlotThree);
										}}
										onSubmit={(keycode: Keycode): void => {
											store.setSetting({ id: SettingId.SlotThree, value: keycode });
											Events.settings.set(SettingId.SlotThree, keycode);
										}}
										layoutOrder={3}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Four}
										settingName={"Slot 4"}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.SlotFour });
											Events.settings.reset(SettingId.SlotFour);
										}}
										onSubmit={(keycode: Keycode): void => {
											store.setSetting({ id: SettingId.SlotFour, value: keycode });
											Events.settings.set(SettingId.SlotFour, keycode);
										}}
										layoutOrder={4}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Five}
										settingName={"Slot 5"}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.SlotFive });
											Events.settings.reset(SettingId.SlotFive);
										}}
										onSubmit={(keycode: Keycode): void => {
											store.setSetting({ id: SettingId.SlotFive, value: keycode });
											Events.settings.set(SettingId.SlotFive, keycode);
										}}
										layoutOrder={5}
									/>
									<KeySettingsRow
										keyCode={Enum.KeyCode.Six}
										settingName={"Slot 6"}
										onReset={(): void => {
											store.resetSetting({ id: SettingId.SlotSix });
											Events.settings.reset(SettingId.SlotSix);
										}}
										onSubmit={(keycode: Keycode): void => {
											store.setSetting({ id: SettingId.SlotSix, value: keycode });
											Events.settings.set(SettingId.SlotSix, keycode);
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
