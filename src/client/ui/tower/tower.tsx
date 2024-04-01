import { Button, Frame, Group, Image, Text } from "../components";
import { Darken, Lighten } from "@rbxts/colour-utils";
import { FONTS, PALETTE, SPRINGS } from "../constants";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { TOWER_SIZE } from "./constants";
import { TOWER_TARGETING_DISPLAY } from "shared/tower/constants";
import { TowerImpl } from "client/tower/impl";
import { TowerUtil } from "shared/tower/utils";
import { formatCooldown, formatDamage, formatRange, formatUpgrade } from "./utils";
import { map } from "@rbxts/pretty-react-hooks";
import { store } from "client/state/store";
import { useAbbreviator, useMotion, usePx } from "../hooks";
import { useButtonAnimation } from "../hooks/use-button-animation";
import { useButtonState } from "../hooks/use-button-state";
import { useRarityDefinition } from "../inventory/utils";
import { useTowerDefintion } from "./hooks";
import React, { useEffect, useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ReplicatedTower } from "shared/tower/types";

const BACKGROUND = Mocha.Base;
const OUTLINE = Darken(BACKGROUND, 0.25);
const BACKGROUND_LIGHT = Lighten(Mocha.Base, 0.1);
const THICKNESS = 2;
const TEXTCOLOR = Latte.Base;
const FONT = FONTS.nunito.regular;
const TEXT_SIZE = 19;
const CORNER_RADIUS = 10;
const TEXT_STROKE_TRANSPARENCY = 0.25;
const PADDING = 5;

interface TowerProps {
	tower: ReplicatedTower;
	visible: boolean;
}

export function Tower({ tower, visible }: TowerProps): Element {
	const { id, targeting } = tower;

	const px = usePx();
	const definition = useTowerDefintion(id);
	const rarity = useRarityDefinition(id);
	const darkRarity = Darken(rarity!.color, 0.5);
	const abbreviator = useAbbreviator();

	const upgradeText = useMemo((): string => {
		return formatUpgrade(tower);
	}, [tower]);

	const [damageText, rangeText, cooldownText] = useMemo((): [string, string, string] => {
		const damageText = formatDamage(tower);
		const rangeText = formatRange(tower);
		const cooldownText = formatCooldown(tower);
		return [damageText, rangeText, cooldownText];
	}, [tower]);
	const [upgradeCost, sellPrice] = useMemo((): [number, number] => {
		const upgradeCost = TowerUtil.getUpgradeCost(tower);
		const sellPrice = TowerUtil.getSellPrice(tower);
		return [upgradeCost, sellPrice];
	}, [tower]);

	const [pressed, hovering, events] = useButtonState();
	const { hover } = useButtonAnimation(pressed, hovering);

	const [transparency, transparencyMotion] = useMotion(1);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.responsive);
	}, [visible]);

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
				cornerRadius={new UDim(0, CORNER_RADIUS)}
				key={"tower-frame"}
			>
				<uistroke
					Color={OUTLINE}
					Thickness={THICKNESS}
					Transparency={transparency}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
				<Image
					size={UDim2.fromOffset(px(168), px(168))}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0.01, 0.485)}
					backgroundColor={darkRarity ?? TEXTCOLOR}
					backgroundTransparency={0}
					image={definition.image}
					cornerRadius={new UDim(0, CORNER_RADIUS)}
					key={"tower-image"}
				>
					<uistroke
						Color={OUTLINE}
						Thickness={THICKNESS}
						Transparency={transparency}
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					/>
				</Image>
				<Text
					size={UDim2.fromOffset(px(168), px(30))}
					textSize={px(TEXT_SIZE + 5)}
					position={UDim2.fromScale(0.01, 0.135)}
					anchorPoint={new Vector2(0, 1)}
					textColor={rarity?.color ?? TEXTCOLOR}
					textXAlignment="Center"
					text={definition.name}
					font={FONT}
					textStrokeTransparency={TEXT_STROKE_TRANSPARENCY}
					textStrokeColor={darkRarity}
					backgroundColor={BACKGROUND_LIGHT}
					backgroundTransparency={0}
					cornerRadius={new UDim(0, CORNER_RADIUS)}
					key={"tower-name"}
				>
					<uistroke
						Color={OUTLINE}
						Thickness={THICKNESS}
						Transparency={transparency}
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					/>
				</Text>
				<Frame
					size={UDim2.fromOffset(px(237), px(210))}
					position={UDim2.fromScale(0.423, 0.43)}
					anchorPoint={new Vector2(0, 0.5)}
					backgroundColor={BACKGROUND_LIGHT}
					backgroundTransparency={1}
					cornerRadius={new UDim(0, CORNER_RADIUS)}
				>
					<uilistlayout
						Padding={new UDim(0, px(PADDING))}
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					<Group
						size={UDim2.fromOffset(px(220), px(30))}
						position={UDim2.fromScale(0.01, 0.135)}
						anchorPoint={new Vector2(0, 1)}
						key={"tower-upgrades"}
					>
						<uilistlayout
							Padding={new UDim(0, px(PADDING))}
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						<Text
							size={UDim2.fromScale(0.915, 1)}
							textSize={px(TEXT_SIZE)}
							position={UDim2.fromScale(0.01, 0.135)}
							anchorPoint={new Vector2(0, 1)}
							textColor={TEXTCOLOR}
							textXAlignment="Center"
							richText={true}
							text={upgradeText}
							font={FONT}
							textStrokeTransparency={TEXT_STROKE_TRANSPARENCY}
							textStrokeColor={OUTLINE}
							backgroundColor={BACKGROUND_LIGHT}
							backgroundTransparency={0}
							cornerRadius={new UDim(0, CORNER_RADIUS)}
							key={"tower-upgrades"}
						>
							<uistroke
								Color={OUTLINE}
								Thickness={THICKNESS}
								Transparency={transparency}
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
						</Text>
						<Button
							size={UDim2.fromOffset(px(30), px(30))}
							cornerRadius={new UDim(0, px(CORNER_RADIUS - 2))}
							backgroundColor={hover.map(
								(value: number): Color3 => PALETTE.error.Lerp(PALETTE.accent, value / 3),
							)}
							rotation={hover.map((value: number): number => map(value, 0, 1, 0, 15))}
							backgroundTransparency={0}
							onClick={(): void => {
								store.deselectTower({});
							}}
							{...events}
							key={"inventory-close"}
						>
							<uistroke
								Color={OUTLINE}
								Thickness={THICKNESS}
								Transparency={transparency}
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
						size={UDim2.fromOffset(px(237), px(30))}
						textSize={px(TEXT_SIZE)}
						textColor={TEXTCOLOR}
						textXAlignment="Center"
						richText={true}
						text={damageText}
						font={FONT}
						textStrokeTransparency={TEXT_STROKE_TRANSPARENCY}
						textStrokeColor={OUTLINE}
						backgroundColor={BACKGROUND_LIGHT}
						backgroundTransparency={0}
						cornerRadius={new UDim(0, CORNER_RADIUS)}
						key={"tower-damage"}
					>
						<uistroke
							Color={OUTLINE}
							Thickness={THICKNESS}
							Transparency={transparency}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						/>
					</Text>
					<Text
						size={UDim2.fromOffset(px(237), px(30))}
						textSize={px(TEXT_SIZE)}
						textColor={TEXTCOLOR}
						textXAlignment="Center"
						richText={true}
						text={rangeText}
						font={FONT}
						textStrokeTransparency={TEXT_STROKE_TRANSPARENCY}
						textStrokeColor={OUTLINE}
						backgroundColor={BACKGROUND_LIGHT}
						backgroundTransparency={0}
						cornerRadius={new UDim(0, CORNER_RADIUS)}
						key={"tower-range"}
					>
						<uistroke
							Color={OUTLINE}
							Thickness={THICKNESS}
							Transparency={transparency}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						/>
					</Text>
					<Text
						size={UDim2.fromOffset(px(237), px(30))}
						textSize={px(TEXT_SIZE)}
						textColor={TEXTCOLOR}
						textXAlignment="Center"
						richText={true}
						text={cooldownText}
						font={FONT}
						textStrokeTransparency={TEXT_STROKE_TRANSPARENCY}
						textStrokeColor={OUTLINE}
						backgroundColor={BACKGROUND_LIGHT}
						backgroundTransparency={0}
						cornerRadius={new UDim(0, CORNER_RADIUS)}
						key={"tower-cooldown"}
					>
						<uistroke
							Color={OUTLINE}
							Thickness={THICKNESS}
							Transparency={transparency}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						/>
					</Text>
					<Button
						size={UDim2.fromOffset(px(237), px(60))}
						backgroundColor={PALETTE.green}
						cornerRadius={new UDim(0, CORNER_RADIUS)}
						key={"tower-upgrade"}
						onClick={(): void => {
							const { key } = tower;
							TowerImpl.upgradeTower(key);
						}}
					>
						<uistroke
							Color={OUTLINE}
							Thickness={THICKNESS}
							Transparency={transparency}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						/>
						<Text
							size={UDim2.fromOffset(px(70), px(35))}
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.48)}
							textColor={PALETTE.accent}
							textSize={px(TEXT_SIZE) + 10}
							text={`Upgrade: $${abbreviator.numberToString(upgradeCost)}`}
							textStrokeColor={OUTLINE}
							textStrokeTransparency={TEXT_STROKE_TRANSPARENCY}
							font={FONT}
							key={"upgrade-cost-text"}
						/>
					</Button>
					<Group size={UDim2.fromOffset(px(237), px(35))} key={"tower-buttons"}>
						<uilistlayout
							Padding={new UDim(px(0.005), px(PADDING))}
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						<Button
							size={UDim2.fromOffset(px(115), px(35))}
							backgroundColor={PALETTE.lightBlue}
							cornerRadius={new UDim(0, CORNER_RADIUS)}
							onClick={(): void => {
								const { key } = tower;
								TowerImpl.changeTargeting(key);
							}}
							key={"tower-target"}
						>
							<uistroke
								Color={OUTLINE}
								Thickness={THICKNESS}
								Transparency={transparency}
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
							<Text
								size={UDim2.fromOffset(px(70), px(35))}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								textSize={px(TEXT_SIZE) - 1}
								textColor={PALETTE.accent}
								text={`Target: ${TOWER_TARGETING_DISPLAY[targeting]}`}
								textStrokeColor={OUTLINE}
								textStrokeTransparency={TEXT_STROKE_TRANSPARENCY}
								font={FONT}
								key={"tower-sell-text"}
							/>
						</Button>
						<Button
							size={UDim2.fromOffset(px(118), px(35))}
							backgroundColor={PALETTE.lightRed}
							cornerRadius={new UDim(0, CORNER_RADIUS)}
							key={"tower-sell"}
							onClick={(): void => {
								const { key } = tower;
								TowerImpl.sellTower(key);
							}}
						>
							<uistroke
								Color={OUTLINE}
								Thickness={THICKNESS}
								Transparency={transparency}
								ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							/>
							<Text
								size={UDim2.fromOffset(px(70), px(35))}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								textSize={px(TEXT_SIZE + 5)}
								textColor={PALETTE.accent}
								text="Sell"
								textStrokeColor={OUTLINE}
								textStrokeTransparency={TEXT_STROKE_TRANSPARENCY}
								richText={true}
								font={FONT}
								key={"tower-sell-text"}
							/>
						</Button>
					</Group>
				</Frame>
			</Frame>
		</Group>
	);
}
