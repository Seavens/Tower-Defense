import { Button, Frame, Group, Image, Text } from "../components";
import { Darken, Lighten } from "@rbxts/colour-utils";
import { ItemFiltering, type ItemId, ItemKind, type ItemTowerClass, type TowerItemId } from "shared/inventory/types";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { PALETTE } from "../constants";
import { TOWER_SIZE } from "../inventory/constants";
import { map } from "@rbxts/pretty-react-hooks";
import { useAbbreviator, useMotion, usePx } from "../hooks";
import { useButtonAnimation } from "../hooks/use-button-animation";
import { useButtonState } from "../hooks/use-button-state";
import { useRarityDefinition } from "../inventory/utils";
import { useTowerDefintion } from "./hooks";
import React, { useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface TowerProps {
	unique: ItemTowerClass;
	id: TowerItemId;
	onClick?: (id: ItemId) => void;
}

const BACKGROUND = Mocha.Base;
const OUTLINE = Darken(BACKGROUND, 0.25);
const BACKGROUND_LIGHT = Lighten(Mocha.Base, 0.1);
const THICKNESS = 2;
const TEXTCOLOR = Latte.Base;
const font = new Font(Enum.Font.Nunito.Name, Enum.FontWeight.Regular, Enum.FontStyle.Normal);
const textSize = 19;
const cornerRadius = 10;

export function Tower({ onClick, id, unique }: TowerProps): Element {
	const px = usePx();
	const abbreviator = useAbbreviator();
	const definition = useTowerDefintion(id);
	const rarity = useRarityDefinition(id);
	const darkRarity = Darken(rarity!.color, 0.5);
	const textStrokeTransparency = 0.25;

	// 100% not accessing the values right 💀💀💀💀
	const { upgrades } = definition.kind;
	const currentUpgrade = 0;
	const targeting = "First";

	const [pressed, hovering, events] = useButtonState();
	const { hover } = useButtonAnimation(pressed, hovering);

	return (
		<Group
			size={UDim2.fromOffset(px(TOWER_SIZE.X), px(TOWER_SIZE.Y))}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			key={"tower-group"}
		>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={BACKGROUND}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				cornerRadius={new UDim(0, 12)}
				key={"tower-frame"}
			>
				<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<Image
					size={UDim2.fromOffset(px(212), px(212))}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0.01, 0.57)}
					backgroundColor={darkRarity ?? TEXTCOLOR}
					backgroundTransparency={0}
					image={definition.image}
					cornerRadius={new UDim(0, 12)}
					key={"tower-image"}
				>
					<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				</Image>
				<Text
					size={UDim2.fromOffset(px(212), px(30))}
					textSize={px(textSize + 5)}
					position={UDim2.fromScale(0.01, 0.135)}
					anchorPoint={new Vector2(0, 1)}
					textColor={rarity?.color ?? TEXTCOLOR}
					textXAlignment="Center"
					text={definition.name}
					font={font}
					textStrokeTransparency={textStrokeTransparency}
					textStrokeColor={darkRarity}
					backgroundColor={BACKGROUND_LIGHT}
					backgroundTransparency={0}
					cornerRadius={new UDim(0, cornerRadius)}
					key={"tower-name"}
				>
					<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				</Text>
				<Frame
					size={UDim2.fromOffset(px(190), px(210))}
					position={UDim2.fromScale(0.76, 0.43)}
					anchorPoint={new Vector2(0.5, 0.5)}
					backgroundColor={BACKGROUND_LIGHT}
					backgroundTransparency={1}
					cornerRadius={new UDim(0, 12)}
				>
					<uilistlayout
						Padding={new UDim(0, 8)}
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					<Group
						size={UDim2.fromOffset(px(192), px(30))}
						position={UDim2.fromScale(0.01, 0.135)}
						anchorPoint={new Vector2(0, 1)}
						key={"tower-upgrades"}
					>
						<uilistlayout
							Padding={new UDim(0, 8)}
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						<Text
							size={UDim2.fromScale(0.81, 1)}
							textSize={px(textSize)}
							position={UDim2.fromScale(0.01, 0.135)}
							anchorPoint={new Vector2(0, 1)}
							textColor={TEXTCOLOR}
							textXAlignment="Center"
							richText={true}
							text={`Upgrade [${upgrades[0][0]}] → [<font color="#${PALETTE.additional}">+${upgrades[currentUpgrade][1]}x</font>]`}
							font={font}
							textStrokeTransparency={textStrokeTransparency}
							textStrokeColor={OUTLINE}
							backgroundColor={BACKGROUND_LIGHT}
							backgroundTransparency={0}
							cornerRadius={new UDim(0, cornerRadius)}
							key={"tower-upgrades"}
						>
							<uistroke
								Color={OUTLINE}
								Thickness={THICKNESS}
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
						</Text>
						<Button
							size={UDim2.fromOffset(px(30), px(30))}
							cornerRadius={new UDim(0, px(cornerRadius - 2))}
							backgroundColor={hover.map(
								(value: number): Color3 => PALETTE.error.Lerp(PALETTE.accent, value / 3),
							)}
							rotation={hover.map((value: number): number => map(value, 0, 1, 0, 15))}
							backgroundTransparency={0}
							{...events}
							key={"inventory-close"}
						>
							<uistroke
								Color={OUTLINE}
								Thickness={THICKNESS}
								Transparency={textStrokeTransparency}
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
							<Text
								size={UDim2.fromScale(1, 1)}
								position={UDim2.fromScale(0.5, 0.435)}
								anchorPoint={Vector2.one.mul(0.5)}
								text={"×"}
								textColor={TEXTCOLOR}
								textSize={px(32)}
								textTransparency={0.5}
								textWrapped={true}
								key={"close-text"}
							/>
						</Button>
					</Group>
					<Text
						size={UDim2.fromOffset(px(192), px(30))}
						textSize={px(textSize)}
						textColor={TEXTCOLOR}
						textXAlignment="Center"
						richText={true}
						text={`Damage: ${abbreviator.numberToString(unique.damage * definition.kind.damage)} → [<font color="#${PALETTE.additional}">${abbreviator.numberToString(upgrades[currentUpgrade][1] * unique.damage * definition.kind.damage)}</font>]`}
						font={font}
						textStrokeTransparency={textStrokeTransparency}
						textStrokeColor={OUTLINE}
						backgroundColor={BACKGROUND_LIGHT}
						backgroundTransparency={0}
						cornerRadius={new UDim(0, cornerRadius)}
						key={"tower-damage"}
					>
						<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
					</Text>
					<Text
						size={UDim2.fromOffset(px(192), px(30))}
						textSize={px(textSize)}
						textColor={TEXTCOLOR}
						textXAlignment="Center"
						richText={true}
						text={`Range: ${abbreviator.numberToString(unique.range * definition.kind.range)} → [<font color="#${PALETTE.additional}">${abbreviator.numberToString(upgrades[currentUpgrade][1] * unique.range * definition.kind.range)}</font>]`}
						font={font}
						textStrokeTransparency={textStrokeTransparency}
						textStrokeColor={OUTLINE}
						backgroundColor={BACKGROUND_LIGHT}
						backgroundTransparency={0}
						cornerRadius={new UDim(0, cornerRadius)}
						key={"tower-range"}
					>
						<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
					</Text>
					<Text
						size={UDim2.fromOffset(px(192), px(30))}
						textSize={px(textSize)}
						textColor={TEXTCOLOR}
						textXAlignment="Center"
						richText={true}
						// !! Ideally, increase in time will be read and decrease will be green
						text={`Cooldown: ${abbreviator.numberToString(unique.cooldown * definition.kind.cooldown)} → [<font color="#${PALETTE.subtract}">${abbreviator.numberToString(upgrades[currentUpgrade][1] * unique.cooldown * definition.kind.cooldown)}</font>]`}
						font={font}
						textStrokeTransparency={textStrokeTransparency}
						textStrokeColor={OUTLINE}
						backgroundColor={BACKGROUND_LIGHT}
						backgroundTransparency={0}
						cornerRadius={new UDim(0, cornerRadius)}
						key={"tower-cooldown"}
					>
						<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
					</Text>
					<Button
						size={UDim2.fromOffset(px(192), px(60))}
						backgroundColor={PALETTE.green}
						cornerRadius={new UDim(0, cornerRadius)}
						key={"tower-upgrade"}
					>
						<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
						<Text
							size={UDim2.fromOffset(px(70), px(35))}
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.48)}
							textColor={PALETTE.accent}
							textSize={px(textSize) + 10}
							text={`Upgrade: $${abbreviator.numberToString(upgrades[currentUpgrade][2])}`}
							textStrokeColor={OUTLINE}
							textStrokeTransparency={textStrokeTransparency}
							font={font}
							key={"tower-sell-text"}
						/>
					</Button>
					<Group size={UDim2.fromOffset(px(192), px(35))} key={"tower-buttons"}>
						<uilistlayout
							Padding={new UDim(0.005, 8)}
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						<Button
							size={UDim2.fromOffset(px(115), px(35))}
							backgroundColor={PALETTE.lightBlue}
							cornerRadius={new UDim(0, cornerRadius)}
							key={"tower-target"}
						>
							<uistroke
								Color={OUTLINE}
								Thickness={THICKNESS}
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
							<Text
								size={UDim2.fromOffset(px(70), px(35))}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								textSize={px(textSize + 5)}
								textColor={PALETTE.accent}
								text={`Target: ${targeting}`}
								textStrokeColor={OUTLINE}
								textStrokeTransparency={textStrokeTransparency}
								font={font}
								key={"tower-sell-text"}
							/>
						</Button>
						<Button
							size={UDim2.fromOffset(px(70), px(35))}
							backgroundColor={PALETTE.lightRed}
							cornerRadius={new UDim(0, cornerRadius)}
							key={"tower-sell"}
						>
							<uistroke
								Color={OUTLINE}
								Thickness={THICKNESS}
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
							<Text
								size={UDim2.fromOffset(px(70), px(35))}
								textSize={px(textSize + 5)}
								textColor={PALETTE.accent}
								text="Sell"
								textStrokeColor={OUTLINE}
								textStrokeTransparency={textStrokeTransparency}
								font={font}
								key={"tower-sell-text"}
							/>
						</Button>
					</Group>
				</Frame>
			</Frame>
		</Group>
	);
}
