import { Frame, Group } from "./pretty-components";
import { HOTBAR_SIZE } from "../constants/UI";
import { ItemSlot } from "./item-slot";
import { LevelFunctions } from "shared/functions/level-functions";
import { MAXIMUM_EQUIPPED } from "shared/constants/inventory-constants";
import { darken } from "shared/utils/color-utils";
import { formatNumber } from "../utils/math-utils";
import { palette } from "../utils/palette";
import { selectInventoryData, selectProfileData } from "client/state/selectors";
import { usePx } from "../hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

const ITEMS_PADDING = 5;

interface HotbarProps {}

export function Hotbar(props: HotbarProps): Element {
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
			elements.push(<ItemSlot {...tower} />);
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
				size={UDim2.fromOffset(ITEM_SLOT_SIZE)}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.4)}
				backgroundTransparency={1}
			>
				<uilistlayout
					key={"item-layout"}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, px(ITEMS_PADDING))}
				/>
				{elements}
			</Frame>
			<Frame
				key={"level-frame"}
				// size={UDim2.}
				backgroundColor={darken(palette.purple, 0.75)}
				cornerRadius={new UDim(0, px(5))}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.85)}
			>
				<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} key={"level-outline"} />
				<Frame
					key={"level-bar"}
					size={UDim2.fromScale(experience / max, 1)}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0, 0.5)}
					backgroundColor={palette.yellow}
					cornerRadius={new UDim(0, px(5))}
				>
					<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} key={"level-outline"} />
				</Frame>

				<textlabel
					key="Level progress	text"
					Size={UDim2.fromScale(0.5, 1)}
					AnchorPoint={new Vector2(0, 0.5)}
					Position={new UDim2(0, px(5), 0.5, 0)}
					BackgroundTransparency={1}
					TextColor3={palette.white}
					Text={`${formatNumber(experience)}/${formatNumber(max)}`}
					TextSize={px(12)}
					Font={Enum.Font.GothamMedium}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</Frame>
		</Group>
	);
}
