import { Button, Frame, Group, Image, Text } from "client/ui/components";
import { FONTS, PALETTE } from "client/ui/constants";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { LevelUtility } from "shared/profile/utility";
import { MAX_TOWER_LEVEL, TOWER_TARGETING_DISPLAY } from "shared/tower/constants";
import { TOWER_IMAGE_SIZE, TOWER_SIZE } from "../constants";
import { TowerAction } from "./action";
import { TowerImpl } from "client/tower/impl";
import { TowerStat } from "./stat";
import { TowerUtility } from "shared/tower/utility";
import { formatCooldown, formatDamage, formatRange, formatUpgrade } from "../utility";
import { getSizeFactor } from "client/ui/inventory/utility";
import { map } from "@rbxts/pretty-react-hooks";
import { store } from "client/state/store";
import { useAbbreviation, useDarkenedColor, usePx, useRarityColor } from "client/ui/hooks";
import { useButtonAnimation } from "client/ui/hooks/use-button-animation";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { useTowerDefintion } from "../hooks";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ReplicatedTower } from "shared/tower/types";

interface TowerProps {
	tower: ReplicatedTower;
}

export function Tower({ tower }: TowerProps): Element {
	const { id, unique } = tower;

	const px = usePx();
	const definition = useTowerDefintion(id);

	const rarity = useRarityColor(definition.rarity);
	const light = useDarkenedColor(rarity, 0.25);
	const medium = useDarkenedColor(rarity, 0.45);
	const dark = useDarkenedColor(rarity, 0.55);

	const [pressed, hovering, events] = useButtonState();
	const { position, hover } = useButtonAnimation(pressed, hovering);

	const _cost = useMemo((): number => {
		return TowerUtility.getUpgradeCost(tower);
	}, [tower]);
	const cost = useAbbreviation(_cost, 2);
	const _price = useMemo((): number => {
		return math.floor(TowerUtility.getSellPrice(tower));
	}, [tower]);
	const price = useAbbreviation(_price, 2);
	const max = useMemo((): number => {
		const { level } = unique;
		const max = LevelUtility.getMaxExp(level, true);
		return max;
	}, [unique]);

	return (
		<Group
			size={UDim2.fromOffset(px(TOWER_SIZE.X + 4), px(TOWER_SIZE.Y + 4))}
			anchorPoint={Vector2.one.mul(0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			key={"tower-group"}
		>
			<Frame
				size={UDim2.fromOffset(px(TOWER_SIZE.X), px(TOWER_SIZE.Y))}
				anchorPoint={Vector2.one.mul(0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				cornerRadius={new UDim(0, px(3))}
				backgroundColor={Mocha.Base}
				key={"tower-frame"}
			>
				<Group
					size={new UDim2(1, 0, 0, px(TOWER_IMAGE_SIZE.Y) + px(4))}
					anchorPoint={Vector2.zero}
					position={UDim2.fromScale(0, 0)}
					key={"tower-upper"}
				>
					<Group
						size={UDim2.fromOffset(px(TOWER_IMAGE_SIZE.X), px(TOWER_IMAGE_SIZE.Y))}
						position={UDim2.fromScale(0, 0)}
						anchorPoint={Vector2.zero}
						zIndex={2}
						key={"tower-upper-left"}
					>
						<Image
							size={UDim2.fromScale(1, 1)}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={Vector2.one.mul(0.5)}
							cornerRadius={new UDim(0, px(3))}
							backgroundColor={light}
							backgroundTransparency={0}
							image={definition.image}
							key={"tower-image"}
						>
							{unique.level < MAX_TOWER_LEVEL && (
								<Frame
									size={new UDim2(1, 0, 0, px(15))}
									position={UDim2.fromScale(0, 1)}
									anchorPoint={new Vector2(0, 1)}
									cornerRadius={new UDim(0, px(4))}
									backgroundColor={PALETTE.black}
									backgroundTransparency={0.2}
									clipsDescendants={true}
									key={"tower-level-bar"}
								>
									<uistroke
										Thickness={px(1)}
										Color={useDarkenedColor(dark, 0.2)}
										key={"tower-level-stroke"}
									/>
									<Frame
										size={UDim2.fromScale(
											unique.experience / max,
											getSizeFactor(unique.experience, max, px(4)),
										)}
										position={UDim2.fromScale(0, 0.5)}
										anchorPoint={new Vector2(0, 0.5)}
										cornerRadius={new UDim(0, px(4))}
										backgroundColor={dark}
										backgroundTransparency={0}
										key={"tower-level-progress"}
									/>
								</Frame>
							)}
							<Text
								size={new UDim2(1, 0, 0, px(20))}
								position={new UDim2(0, px(4), 1, 0)}
								anchorPoint={new Vector2(0, 1)}
								backgroundTransparency={1}
								text={`Level: ${unique.level}`}
								strokeColor={PALETTE.black}
								strokeTransparency={0.25}
								textXAlignment={"Left"}
								textYAlignment={"Bottom"}
								textColor={Latte.Base}
								textSize={px(16)}
								font={FONTS.nunito.regular}
								zIndex={1}
								key={"tower-level"}
							/>
							<uipadding
								PaddingBottom={new UDim(0, px(4))}
								PaddingLeft={new UDim(0, px(4))}
								PaddingRight={new UDim(0, px(4))}
								PaddingTop={new UDim(0, px(4))}
								key={"tower-padding"}
							/>
						</Image>
					</Group>
					<Group
						size={UDim2.fromOffset(
							px(TOWER_SIZE.X) - px(TOWER_IMAGE_SIZE.X) - px(4) * 2,
							px(TOWER_IMAGE_SIZE.Y),
						)}
						position={UDim2.fromScale(1, 0)}
						anchorPoint={new Vector2(1, 0)}
						zIndex={1}
						key={"tower-upper-right"}
					>
						<Group size={new UDim2(1, 0, 0, px(23))} layoutOrder={1} key={"tower-topbar"}>
							<Frame
								size={new UDim2(1, -px(20), 0, px(20))}
								position={new UDim2(0, -px(4), 0, 0)}
								anchorPoint={Vector2.zero}
								cornerRadius={new UDim(0, px(3))}
								backgroundColor={medium}
								backgroundTransparency={0}
								key={"tower-flag"}
							>
								<Text
									size={new UDim2(1, -px(4), 1, 0)}
									position={UDim2.fromScale(1, 0)}
									anchorPoint={new Vector2(1, 0)}
									text={`${definition.name}`}
									textColor={Latte.Base}
									textSize={px(18)}
									font={FONTS.nunito.regular}
									zIndex={1}
									key={"tower-name"}
								/>
							</Frame>
							<Button
								size={UDim2.fromOffset(px(20), px(20))}
								position={position.map(
									(value: number): UDim2 =>
										UDim2.fromScale(1, 0).Lerp(new UDim2(1, 0, 0, -px(1)), value),
								)}
								anchorPoint={new Vector2(1, 0)}
								cornerRadius={new UDim(0, px(3))}
								backgroundTransparency={0}
								backgroundColor={hover.map(
									(value: number): Color3 => PALETTE.error.Lerp(PALETTE.light_white, value / 3),
								)}
								rotation={hover.map((value: number): number => map(value, 0, 1, 0, 15))}
								onClick={(): void => {
									store.deselectTower({});
								}}
								{...events}
								key={"tower-close"}
							>
								<Text
									size={UDim2.fromScale(1, 1)}
									position={UDim2.fromScale(0.5, 0.435)}
									anchorPoint={Vector2.one.mul(0.5)}
									text={"×"}
									textColor={Latte.Base}
									textSize={px(32)}
									textWrapped={true}
									key={"close-text"}
								/>
							</Button>
						</Group>
						<Frame
							size={new UDim2(1, -px(4), 0, px(20 * 4))}
							position={UDim2.fromScale(1, 1)}
							anchorPoint={Vector2.one}
							cornerRadius={new UDim(0, px(3))}
							backgroundColor={dark}
							backgroundTransparency={0}
							layoutOrder={2}
							key={"tower-stats"}
						>
							<TowerStat tower={tower} stat={"Upgrade"} layoutOrder={1} formatter={formatUpgrade} />
							<TowerStat tower={tower} stat={"Damage"} layoutOrder={1} formatter={formatDamage} />
							<TowerStat tower={tower} stat={"Range"} layoutOrder={1} formatter={formatRange} />
							<TowerStat tower={tower} stat={"Cooldown"} layoutOrder={1} formatter={formatCooldown} />
							<uilistlayout
								FillDirection={"Vertical"}
								HorizontalAlignment={"Right"}
								VerticalAlignment={"Top"}
								Padding={new UDim(0, 0)}
								SortOrder={"LayoutOrder"}
								key={"tower-layout"}
							/>
						</Frame>
					</Group>
					<uipadding
						PaddingBottom={new UDim(0, px(4))}
						PaddingLeft={new UDim(0, px(4))}
						PaddingRight={new UDim(0, px(4))}
						PaddingTop={new UDim(0, px(4))}
						key={"tower-padding"}
					/>
				</Group>
				<Group
					size={new UDim2(1, 0, 0, px(TOWER_SIZE.Y) - px(TOWER_IMAGE_SIZE.Y) - px(4))}
					anchorPoint={Vector2.one}
					position={UDim2.fromScale(1, 1)}
					key={"tower-lower"}
				>
					<TowerAction
						size={new UDim2(0, px(TOWER_IMAGE_SIZE.X), 1, 0)}
						position={UDim2.fromScale(0, 1)}
						anchorPoint={new Vector2(0, 1)}
						backgroundColor={PALETTE.light_green}
						text={_cost >= math.huge ? "MAX" : `Upgrade: $${cost}`}
						textColor={PALETTE.black}
						textSize={px(15)}
						enabled={_cost < math.huge}
						layoutOrder={0}
						onClick={(): void => {
							const { key } = tower;
							TowerImpl.upgradeTower(key);
						}}
					/>
					<Group
						size={new UDim2(0, px(TOWER_SIZE.X) - px(TOWER_IMAGE_SIZE.X) - px(4) * 3, 1, 0)}
						position={UDim2.fromScale(1, 1)}
						anchorPoint={Vector2.one}
						key={"tower-actions-group"}
					>
						<TowerAction
							size={new UDim2(0, (px(TOWER_SIZE.X) - px(TOWER_IMAGE_SIZE.X)) / 2 - px(4) * 2 + 1, 1, 0)}
							position={UDim2.fromScale(0, 0)}
							anchorPoint={Vector2.zero}
							backgroundColor={PALETTE.light_blue}
							text={TOWER_TARGETING_DISPLAY[tower.targeting]}
							enabled={true}
							layoutOrder={1}
							onClick={(): void => {
								const { key } = tower;
								TowerImpl.changeTargeting(key);
							}}
						/>
						<TowerAction
							size={new UDim2(0, (px(TOWER_SIZE.X) - px(TOWER_IMAGE_SIZE.X)) / 2 - px(4) * 2, 1, 0)}
							position={UDim2.fromScale(1, 1)}
							anchorPoint={Vector2.one}
							backgroundColor={PALETTE.light_red}
							text={`Sell $${price}`}
							enabled={true}
							layoutOrder={2}
							onClick={(): void => {
								const { key } = tower;
								TowerImpl.sellTower(key);
							}}
						/>
						<uilistlayout
							FillDirection={"Horizontal"}
							HorizontalAlignment={"Center"}
							VerticalAlignment={"Center"}
							Padding={new UDim(0, px(4))}
							SortOrder={"LayoutOrder"}
							key={"tower-layout"}
						/>
					</Group>
					<uipadding
						PaddingBottom={new UDim(0, px(4))}
						PaddingLeft={new UDim(0, px(4))}
						PaddingRight={new UDim(0, px(4))}
						PaddingTop={new UDim(0, px(4))}
						key={"tower-padding"}
					/>
				</Group>
			</Frame>
		</Group>
	);
}
