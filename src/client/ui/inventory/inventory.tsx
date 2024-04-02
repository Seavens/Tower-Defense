import { Button, DelayRender, DropDown, Frame, Group, Image, Text, Transition } from "../components";
import { Darken, Lighten } from "@rbxts/colour-utils";
import { FONTS, PALETTE, SPRINGS } from "../constants";
import {
	INVENTORY_COLUMN_COUNT,
	INVENTORY_SIZE,
	ITEM_SLOT_SIZE,
	RARITY_ORDERS,
	TRANSPARENCY_GRADIENT,
} from "./constants";
import { ItemFiltering } from "shared/inventory/types";
import { ItemKind } from "shared/inventory/types";
import { ItemSlot } from "./item-slot";
import { ItemUtility } from "shared/inventory/utility";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { MAX_TOWER_LEVEL } from "shared/tower/constants";
import { SearchBar } from "../components/search-bar";
import { TextField } from "../components/text-field";
import { formatStats, useItemDefinition, useRarityDefinition } from "./utils";
import { idToName } from "shared/utils/id-to-name";
import { itemDefinitions } from "shared/inventory/items";
import { map, useAsync } from "@rbxts/pretty-react-hooks";
import { selectInventoryData } from "client/inventory/selectors";
import { selectProfileData } from "client/profile/selectors";
import { useButtonAnimation } from "../hooks/use-button-animation";
import { useButtonState } from "../hooks/use-button-state";
import { useMotion, usePx } from "../hooks";
import { useSelector } from "@rbxts/react-reflex";
import Abbreviator from "@rbxts/abbreviate";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";

interface Inventoryunique {
	visible: boolean;
	onClose?: () => void;
}

const BACKGROUND = Mocha.Base;
const OUTLINE = Darken(BACKGROUND, 0.25);
const BACKGROUND_LIGHT = Lighten(Mocha.Base, 0.1);
const THICKNESS = 6;
const TEXTCOLOR = Latte.Base;
const TRANSPARENCY = 0;

export function Inventory({ visible, onClose }: Inventoryunique): Element {
	const { stored } = useSelector(selectInventoryData);
	const { coins, gems } = useSelector(selectProfileData);

	const [pressed, hovering, events] = useButtonState();
	const [filtered, setFiltering] = useState(ItemFiltering.All);
	const [selected, setSelected] = useState<Slot>();
	const [search, setSearch] = useState<Array<string>>();
	const { hover, position } = useButtonAnimation(pressed, hovering);

	const [transparency, transparencyMotion] = useMotion(0);
	const allItemNames = ItemUtility.getAllItemNames();

	const px = usePx();
	const abbreviator = new Abbreviator();

	const item = useMemo((): Option<Item> => {
		if (selected === undefined) {
			return undefined;
		}
		return stored.get(selected);
	}, [stored, selected]);
	const [owner] = useAsync(async (): Promise<string> => {
		const unique = item?.unique;
		if (item === undefined || unique === undefined || unique.kind !== ItemKind.Tower) {
			return "";
		}
		const { owner } = unique;
		return idToName(owner);
	}, [item]);

	const stats = useMemo((): Option<string> => {
		if (item === undefined) {
			return undefined;
		}
		return formatStats(item, px(16), owner ?? "Unknown");
	}, [stored, item, owner]);

	const elements = useMemo(() => {
		const elements: Array<Element> = [];
		for (const index of $range(1, stored.size())) {
			const slot: Slot = `${index}`;
			const item = stored.get(slot);
			if (item === undefined) {
				continue;
			}
			const { id, unique } = item;
			if (filtered === ItemFiltering.Locked && unique.locked) {
				warn("Locked");
				continue;
			}

			if (filtered === ItemFiltering.Relic && unique.kind !== ItemKind.Relic) {
				continue;
			}
			if (filtered === ItemFiltering.Tower && unique.kind !== ItemKind.Tower) {
				continue;
			}

			const { rarity, name } = itemDefinitions[id];

			if (search !== undefined && !search.includes(name)) continue;

			const order =
				filtered === ItemFiltering.Rarity
					? RARITY_ORDERS[rarity]
					: filtered === ItemFiltering.Level && unique.kind === ItemKind.Tower
						? MAX_TOWER_LEVEL - unique.level
						: undefined;
			elements.push(
				<ItemSlot
					{...item}
					affordable={true}
					layoutOrder={order}
					onClick={(): void => {
						setSelected(slot);
					}}
					selected={selected === slot}
				/>,
			);
		}
		return elements;
	}, [stored, filtered, selected, search]);

	const itemDef = useItemDefinition(item?.id);
	const rarityDef = useRarityDefinition(itemDef?.id);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.responsive);
	}, [visible]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={1}>
			<Transition
				key={"inventory-transition"}
				size={UDim2.fromOffset(px(INVENTORY_SIZE.X), px(INVENTORY_SIZE.Y))}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				groupTransparency={transparency}
			>
				<Group
					key={"inventory-group"}
					size={UDim2.fromOffset(px(INVENTORY_SIZE.X), px(INVENTORY_SIZE.Y))}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
				>
					<Frame
						key={"right-background"}
						size={UDim2.fromScale(0.68, 0.98)}
						backgroundColor={BACKGROUND}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.644, 0.5)}
						backgroundTransparency={0}
					>
						<uicorner CornerRadius={new UDim(0, px(5))} />
						<uistroke Color={OUTLINE} Thickness={px(2)} />
						<Group
							key={"inventory-topbar"}
							size={UDim2.fromScale(1, 0.1)}
							anchorPoint={new Vector2(0.5, 0)}
							position={UDim2.fromScale(0.5, 0)}
							zIndex={12}
						>
							<Group
								size={UDim2.fromScale(0.5, 0.9)}
								anchorPoint={new Vector2(0, 0.56)}
								position={UDim2.fromScale(0.04, 0.5)}
							>
								<uilistlayout
									FillDirection={Enum.FillDirection.Horizontal}
									HorizontalAlignment={Enum.HorizontalAlignment.Left}
									VerticalAlignment={Enum.VerticalAlignment.Center}
									SortOrder={Enum.SortOrder.LayoutOrder}
									Padding={new UDim(0, px(2))}
								/>
								<Group
									size={UDim2.fromOffset(px(155), px(28))}
									position={UDim2.fromScale(0.238, 0.5)}
									anchorPoint={Vector2.one.mul(0.5)}
								>
									<uilistlayout
										FillDirection={Enum.FillDirection.Vertical}
										HorizontalAlignment={Enum.HorizontalAlignment.Left}
										VerticalAlignment={Enum.VerticalAlignment.Center}
										SortOrder={Enum.SortOrder.LayoutOrder}
										Padding={new UDim(0, px(2))}
									/>
									<Text
										size={UDim2.fromOffset(px(155), px(13))}
										position={UDim2.fromScale(0.035, 0.31)}
										anchorPoint={new Vector2(0, 0.425)}
										richText={true}
										font={FONTS.robotoMono.regular}
										text={`<font color="#${Color3.fromRGB(
											237,
											41,
											242,
										).ToHex()}">Gems</font>: ${abbreviator.numberToString(gems)}`}
										textColor={TEXTCOLOR}
										textScaled={true}
										backgroundColor={BACKGROUND_LIGHT}
										backgroundTransparency={TRANSPARENCY}
										textXAlignment="Left"
										textYAlignment="Center"
										cornerRadius={new UDim(0, px(4))}
										key={"inventory-gems-text"}
									>
										<uistroke
											ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
											Color={OUTLINE}
											Thickness={1}
										/>
										<uipadding PaddingLeft={new UDim(0, px(4))} />
									</Text>
									<Text
										size={UDim2.fromOffset(px(155), px(13))}
										position={UDim2.fromScale(0.035, 0.75)}
										anchorPoint={new Vector2(0, 0.5)}
										richText={true}
										font={FONTS.robotoMono.regular}
										text={`<font color="#${Color3.fromRGB(
											232,
											191,
											10,
										).ToHex()}">Coins</font>: ${abbreviator.numberToString(coins)}`}
										textColor={TEXTCOLOR}
										textScaled={true}
										backgroundColor={BACKGROUND_LIGHT}
										backgroundTransparency={TRANSPARENCY}
										textXAlignment="Left"
										textYAlignment="Center"
										cornerRadius={new UDim(0, px(4))}
										key={"inventory-coins-text"}
									>
										<uistroke
											ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
											Color={OUTLINE}
											Thickness={1}
										/>
										<uipadding PaddingLeft={new UDim(0, px(4))} />
									</Text>
								</Group>
								<SearchBar
									key={"search"}
									size={UDim2.fromOffset(px(200), px(30))}
									position={UDim2.fromScale(0.365, 0.5)}
									anchorPoint={new Vector2(0, 0.5)}
									cornerRadius={new UDim(0, px(4))}
									backgroundTransparency={0}
									textSize={px(18)}
									textColor={TEXTCOLOR}
									font={FONTS.robotoMono.regular}
									backgroundColor={BACKGROUND_LIGHT}
									onSearch={setSearch}
									queries={allItemNames}
									enabled={true}
									accuracy={5}
								>
									<uistroke
										ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
										Thickness={1}
										Color={OUTLINE}
									/>
								</SearchBar>
								<DropDown
									anchorPoint={new Vector2(0, 0.5)}
									position={UDim2.fromScale(0.78, 0.5)}
									textColor={TEXTCOLOR}
									backgroundColor={BACKGROUND_LIGHT}
									strokeColor={OUTLINE}
									size={UDim2.fromOffset(px(80), px(30))}
									cornerRadius={new UDim(0, px(4))}
									options={["Off", "Item", "Rarity", "Level", "Locked"]}
									index={1}
									enabled={true}
									onClick={(option: string): void => {
										switch (option) {
											case "Off":
												setFiltering(ItemFiltering.All);
												break;
											case "Item":
												setFiltering(ItemFiltering.Relic);
												break;
											case "Rarity":
												setFiltering(ItemFiltering.Rarity);
												break;
											case "Level":
												setFiltering(ItemFiltering.Level);
												break;
											case "Locked":
												setFiltering(ItemFiltering.Locked);
												break;
										}
									}}
								/>
							</Group>
							<Button
								size={UDim2.fromOffset(px(16), px(16))}
								position={position.map(
									(value: number): UDim2 =>
										UDim2.fromScale(0.99, 0.28).Lerp(new UDim2(0.99, 0, 0.28, px(1)), value),
								)}
								anchorPoint={new Vector2(1, 0.5)}
								cornerRadius={new UDim(0, px(3))}
								backgroundColor={hover.map(
									(value: number): Color3 => PALETTE.error.Lerp(PALETTE.accent, value / 3),
								)}
								rotation={hover.map((value: number): number => map(value, 0, 1, 0, 15))}
								backgroundTransparency={0}
								onClick={onClose}
								{...events}
								key={"inventory-close"}
							>
								<Text
									size={UDim2.fromScale(1, 1)}
									position={UDim2.fromScale(0.5, 0.435)}
									anchorPoint={Vector2.one.mul(0.5)}
									text={"×"}
									textColor={TEXTCOLOR}
									textSize={px(25)}
									textTransparency={0.5}
									textWrapped={true}
									key={"close-text"}
								/>
							</Button>
						</Group>
						<Group
							key={"scroll-group"}
							size={UDim2.fromScale(1, 0.9)}
							anchorPoint={new Vector2(0.5, 0.45)}
							position={UDim2.fromScale(0.5, 0.5)}
						>
							<scrollingframe
								key={"inventory-background"}
								Size={new UDim2(1, -px(2), 1, 0)}
								BackgroundColor3={BACKGROUND}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={new UDim2(0.5, -px(2), 0.5, 0)}
								BackgroundTransparency={1}
								BorderSizePixel={0}
								ScrollBarThickness={px(THICKNESS)}
								ScrollBarImageColor3={Latte.Base}
								CanvasSize={UDim2.fromOffset(
									0,
									px(INVENTORY_COLUMN_COUNT * (ITEM_SLOT_SIZE.Y + 5)) + px(36),
								)}
								ZIndex={2}
							>
								<uipadding
									PaddingTop={new UDim(0, px(4))}
									PaddingLeft={new UDim(0, px(4))}
									PaddingRight={new UDim(0, px(4))}
								/>
								<uigridlayout
									CellSize={UDim2.fromOffset(px(ITEM_SLOT_SIZE.X), px(ITEM_SLOT_SIZE.Y))}
									CellPadding={UDim2.fromOffset(px(5), px(5))}
									SortOrder={Enum.SortOrder.LayoutOrder}
									HorizontalAlignment={Enum.HorizontalAlignment.Center}
									VerticalAlignment={Enum.VerticalAlignment.Top}
									StartCorner={Enum.StartCorner.TopLeft}
								/>
								{elements}
							</scrollingframe>
							<Frame
								size={new UDim2(1, -px(5), 0, px(15))}
								position={UDim2.fromScale(0.5, 0)}
								anchorPoint={new Vector2(0.5, 0)}
								backgroundColor={BACKGROUND}
								zIndex={2}
							>
								<uigradient
									Transparency={TRANSPARENCY_GRADIENT}
									Rotation={90}
									key={"top-scrolling-transparency"}
								/>
							</Frame>
							<Frame
								size={new UDim2(1, -px(5), 0, px(15))}
								position={UDim2.fromScale(0.5, 1)}
								anchorPoint={new Vector2(0.5, 1)}
								backgroundColor={BACKGROUND}
								zIndex={2}
							>
								<uigradient
									Transparency={TRANSPARENCY_GRADIENT}
									Rotation={270}
									key={"bottom-scrolling-transparency"}
								/>
							</Frame>
							<Frame
								size={new UDim2(0, px(THICKNESS), 1, -px(6))}
								position={new UDim2(1, -px.scale(THICKNESS / 2), 0.5, 0)}
								anchorPoint={new Vector2(1, 0.5)}
								backgroundColor={Latte.Base}
								backgroundTransparency={0.75}
								cornerRadius={new UDim(0, px(4))}
								key={"scrollbar-background"}
							/>
						</Group>
					</Frame>
					<Frame
						key={"left-background"}
						size={UDim2.fromScale(0.285, 0.98)}
						backgroundColor={BACKGROUND}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.147, 0.5)}
						backgroundTransparency={0}
						zIndex={1}
					>
						<uicorner CornerRadius={new UDim(0, px(5))} />
						<uistroke Color={OUTLINE} Thickness={px(2)} />
						<uipadding PaddingTop={new UDim(0, px(8))} />

						<uilistlayout
							FillDirection={Enum.FillDirection.Vertical}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Top}
							SortOrder={Enum.SortOrder.LayoutOrder}
							Padding={new UDim(0, px(9))}
						/>
						<Image
							key={"item-image"}
							size={UDim2.fromScale(0.9, 0.7)}
							anchorPoint={new Vector2(0.5, 0)}
							position={UDim2.fromScale(0.5, 0)}
							backgroundTransparency={0.5}
							image={itemDef?.image}
							backgroundColor={rarityDef?.color}
						>
							<uiaspectratioconstraint AspectRatio={1} />
							<uicorner CornerRadius={new UDim(0, px(5))} />
							<uistroke Color={OUTLINE} Thickness={px(2)} />
						</Image>
						<Frame
							key={"item-stats"}
							size={UDim2.fromScale(0.9, 0.535)}
							anchorPoint={new Vector2(0.5, 0)}
							position={UDim2.fromScale(0.5, 0)}
							backgroundTransparency={0.5}
						>
							<uistroke Color={OUTLINE} Thickness={px(2)} />
							<uicorner CornerRadius={new UDim(0, px(5))} />
							<Text
								size={UDim2.fromScale(0.9, 0.9)}
								anchorPoint={Vector2.one.mul(0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								font={FONTS.inter.regular}
								text={stats ?? ""}
								textColor={TEXTCOLOR}
								textWrapped={true}
								textSize={px(12)}
								textXAlignment={"Left"}
								textYAlignment={"Top"}
								richText={true}
								key={"stats-text"}
							/>
						</Frame>
					</Frame>
				</Group>
			</Transition>
		</DelayRender>
	);
}
