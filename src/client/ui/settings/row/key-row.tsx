import { FONTS, PALETTE } from "client/ui/constants";
import { Group, Image, ReactiveButton, Text, TextField } from "../../components";
import { SETTINGS_MENU_ROW_SIZE } from "../constants";
import { isKeycode } from "shared/utility/guards/keycode";
import { usePx } from "../../hooks";
import React, { useCallback, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface KeySettingsRowProps {
	settingName: string;
	layoutOrder?: number;
	keyCode: Enum.KeyCode;
	onResetClick?: (reset: boolean) => void;
	onSubmitClick?: (keyCode: Enum.KeyCode) => void;
}

export function KeySettingsRow({
	settingName,
	layoutOrder,
	keyCode,
	onResetClick,
	onSubmitClick,
}: KeySettingsRowProps): Element {
	const px = usePx();

	const [text, setText] = useState(keyCode.Name);

	const handleTextChange = useCallback(
		(rbx: TextBox): void => {
			const text = rbx.Text;
			if (!isKeycode(text)) {
				setText(keyCode.Name);
				return;
			}
			setText(text);
		},
		[text, keyCode.Name],
	);

	const handleResetClick = useCallback((): void => {
		setText(keyCode.Name);
		if (onResetClick) {
			onResetClick(true);
		}
	}, [onResetClick]);

	const handleSubmitClick = useCallback((): void => {
		if (onSubmitClick && text !== keyCode.Name) {
			onSubmitClick(Enum.KeyCode[text]);
		}
	}, [onSubmitClick, keyCode.Name]);

	const isEditing = text !== keyCode.Name;

	return (
		<Group
			size={UDim2.fromOffset(px(SETTINGS_MENU_ROW_SIZE.X), px(SETTINGS_MENU_ROW_SIZE.Y))}
			anchorPoint={Vector2.one.mul(0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			key={"main-group"}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			<Group size={UDim2.fromScale(0.58, 1)} key={"main-group"}>
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
			<Group size={UDim2.fromOffset(px(355), px(40))} layoutOrder={layoutOrder} key={"main-group"}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, px(4))}
				/>

				{isEditing && (
					<ReactiveButton
						size={UDim2.fromOffset(px(40), px(40))}
						position={UDim2.fromScale(1, 1)}
						anchorPoint={new Vector2(1, 1)}
						backgroundTransparency={0.2}
						backgroundColor={PALETTE.green}
						cornerRadius={new UDim(0, px(4))}
						onClick={handleSubmitClick}
						enabled={isEditing}
						layoutOrder={1}
						key={"submit-button"}
					>
						<Image
							size={UDim2.fromOffset(px(30), px(30))}
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.5)}
							image={"rbxassetid://14189590169"}
							scaleType="Fit"
							key={"right-image"}
						/>
					</ReactiveButton>
				)}

				<TextField
					size={UDim2.fromOffset(px(360), px(40))}
					backgroundColor={PALETTE.light_gray}
					cornerRadius={new UDim(0, px(4))}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
					backgroundTransparency={0}
					textSize={px(30)}
					font={FONTS.inter.medium}
					textColor={PALETTE.accent}
					text={text}
					change={{
						Text: handleTextChange,
					}}
					layoutOrder={2}
					key={"center-text-field"}
				/>
				<ReactiveButton
					size={UDim2.fromOffset(px(40), px(40))}
					position={UDim2.fromScale(1, 1)}
					anchorPoint={new Vector2(1, 1)}
					backgroundTransparency={0.2}
					backgroundColor={PALETTE.red}
					cornerRadius={new UDim(0, px(4))}
					onClick={handleResetClick}
					enabled={true}
					layoutOrder={3}
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
