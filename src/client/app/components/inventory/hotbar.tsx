import { EXP_BAR_SIZE_Y, HOTBAR_PADDING, HOTBAR_SIZE, ITEM_SLOT_SIZE } from "../../constants/inventory-ui";
import { Frame, Group } from "../pretty-components";
import { ItemSlot } from "./item-slot";
import { LevelFunctions } from "shared/functions/level-functions";
import { MAXIMUM_EQUIPPED } from "shared/constants/inventory-constants";
import { clientProducer } from "client/state/producer";
import { darken } from "shared/utils/color-utils";
import { fonts } from "client/app/constants/fonts";
import { palette } from "../../utils/palette";
import { selectInventoryData, selectProfileData } from "client/state/selectors";
import { usePx } from "../../hooks";
import { useSelector } from "@rbxts/react-reflex";
import Abbreviator from "@rbxts/abbreviate";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { TowerId } from "shared/types/ids";

interface HotbarProps {}

export function Hotbar(props: HotbarProps): Element {
	const abbreviator = new Abbreviator();
	const px = usePx();

	const { equipped } = useSelector(selectInventoryData);
	const { coins, experience, gems, level } = useSelector(selectProfileData);

	const max = useMemo((): number => {
		return LevelFunctions.getMaxExp(level);
	}, [level]);

	const elements = useMemo(() => {
		const elements: Array<Element> = [];
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot = `${index}`;
			const tower = equipped.get(slot);
			elements.push(
				<ItemSlot
					{...tower}
					onClick={(placing: TowerId): void => {
						clientProducer.beginPlacement({ placing, slot });
					}}
				/>,
			);
		}
		return elements;
	}, [equipped]);

	return (
		<Group
			key={"hotbar-group"}
			size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(HOTBAR_SIZE.Y))}
			anchorPoint={new Vector2(0.5, 1)}
			position={UDim2.fromScale(0.5, 1)}
		>
			<Frame
				key={"item-group"}
				size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(ITEM_SLOT_SIZE.Y))}
				anchorPoint={new Vector2(0.5, 0)}
				position={UDim2.fromScale(0.5, 0)}
				backgroundTransparency={1}
			>
				<uilistlayout
					key={"item-layout"}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, px(HOTBAR_PADDING))}
				/>
				{elements}
			</Frame>
			<Frame
				key={"level-frame"}
				size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(EXP_BAR_SIZE_Y))}
				backgroundColor={darken(palette.purple, 0.75)}
				cornerRadius={new UDim(0, px(5))}
				anchorPoint={new Vector2(0.5, 1)}
				position={new UDim2(0.5, 0, 1, -HOTBAR_PADDING)}
			>
				<uistroke
					Color={palette.white}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Thickness={1}
					key={"level-outline"}
				/>
				<Frame
					key={"level-bar"}
					size={UDim2.fromScale(experience / max, 1)}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0, 0.5)}
					backgroundColor={palette.yellow}
					cornerRadius={new UDim(0, px(5))}
				/>
				<textlabel
					key={"level-text"}
					Size={UDim2.fromScale(0.5, 1)}
					AnchorPoint={new Vector2(0, 0.5)}
					Position={new UDim2(0, px(5), 0.5, 0)}
					BackgroundTransparency={1}
					TextColor3={palette.white}
					Text={`${abbreviator.numberToString(experience)}/${abbreviator.numberToString(max)}`}
					TextSize={px(12)}
					FontFace={fonts.inter.bold}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</Frame>
			<Frame
				key={"level-holder"}
				size={UDim2.fromOffset(px(EXP_BAR_SIZE_Y + HOTBAR_PADDING), px(EXP_BAR_SIZE_Y + HOTBAR_PADDING))}
				anchorPoint={new Vector2(0.5, 1)}
				position={new UDim2(0.5, 0, 1, -HOTBAR_PADDING / 2)}
				backgroundColor={palette.gray} // temp
				// textColor3={palette.white}
				// Text={`${level}`}
				// TextSize={px(12)}
				// Font={Enum.Font.GothamMedium}
			>
				<textlabel
					key={"level-value"}
					Size={UDim2.fromOffset(0, px(12))}
					AnchorPoint={Vector2.one.mul(0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					BackgroundColor3={palette.gray} // temp
					TextColor3={palette.white}
					Text={abbreviator.numberToString(level)}
					TextSize={px(10)}
					FontFace={fonts.inter.bold}
					AutomaticSize={Enum.AutomaticSize.X}
				>
					<uipadding
						PaddingBottom={new UDim(0, px(5))}
						PaddingLeft={new UDim(0, px(3))}
						PaddingRight={new UDim(0, px(3))}
						PaddingTop={new UDim(0, px(5))}
						key={"text-padding"}
					/>
					<uicorner CornerRadius={new UDim(0, px(3))} key={"level-corner"} />
				</textlabel>
				<uicorner CornerRadius={new UDim(1, 0)} key={"level-corner"} />
			</Frame>
		</Group>
	);
}
