import { Button, Frame, Group, Image, Text } from "../components";
import { Darken, Lighten } from "@rbxts/colour-utils";
import { FONTS } from "../constants";
import {
	INVENTORY_COLUMN_COUNT,
	INVENTORY_SIZE,
	ITEM_SLOT_SIZE,
	RARITY_ORDERS,
	TRANSPARENCY_GRADIENT,
} from "./constants";
import { type Item, ItemId, ItemKind } from "shared/inventory/types";
import { ItemFiltering } from "shared/inventory/types";
import { ItemSlot } from "./item-slot";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { MAXIMUM_TOWER_LEVEL } from "shared/tower/constants";
import { TextField } from "../components/text-field";
import { formatStats, useItemDefinition, useRarityDefinition } from "./utils";
import { itemDefinitions } from "shared/inventory/items";
import { selectInventoryData } from "client/inventory/selectors";
import { usePx } from "../hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface InventoryProps {}

const BACKGROUND = Mocha.Base;
const OUTLINE = Darken(Mocha.Base, 0.25);
const THICKNESS = 6;

export function Inventory(props: InventoryProps): Element {
	const px = usePx();
	const { stored } = useSelector(selectInventoryData);

	const [filtered, setFiltering] = useState(ItemFiltering.All);
	const [selected, setSelected] = useState<Slot>();

	const item = useMemo((): Option<Item> => {
		if (selected === undefined) {
			return undefined;
		}
		return stored.get(selected);
	}, [stored, selected]);

	const stats = useMemo((): Option<string> => {
		if (item === undefined) {
			return undefined;
		}
		return formatStats(item, px(16), px(10));
	}, [stored, item]);

	const elements = useMemo(() => {
		const elements: Array<Element> = [];
		for (const index of $range(1, stored.size())) {
			const slot: Slot = `${index}`;
			const item = stored.get(slot);
			if (item === undefined) {
				continue;
			}
			const { id, props } = item;
			// eslint-disable-next-line roblox-ts/lua-truthiness
			if (filtered === ItemFiltering.Locked && !props.locked) {
				continue;
			}
			if (filtered === ItemFiltering.Relic && props.kind !== ItemKind.Relic) {
				continue;
			}
			if (filtered === ItemFiltering.Tower && props.kind !== ItemKind.Tower) {
				continue;
			}
			const { rarity } = itemDefinitions[id];
			const order =
				filtered === ItemFiltering.Rarity
					? RARITY_ORDERS[rarity]
					: filtered === ItemFiltering.Level && props.kind === ItemKind.Tower
						? MAXIMUM_TOWER_LEVEL - props.level
						: undefined;
			elements.push(
				<ItemSlot
					order={order}
					{...item}
					onClick={(): void => {
						setSelected(slot);
					}}
				/>,
			);
		}
		return elements;
	}, [stored, filtered]);

	const itemDef = useItemDefinition(item?.id);
	const rarityDef = useRarityDefinition(itemDef?.id);

	return (
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
					key={"inventory-filters"}
					size={UDim2.fromScale(1, 0.1)}
					anchorPoint={new Vector2(0.5, 0)}
					position={UDim2.fromScale(0.5, 0)}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, px(5))}
					/>
					<Button
						text={""}
						key={"filter-kind-relic"}
						size={UDim2.fromScale(0.08, 0.8)}
						position={UDim2.fromScale(0.1, 0.5)}
						anchorPoint={new Vector2(0, 0.5)}
						cornerRadius={new UDim(0, px(4))}
						backgroundColor={Lighten(BACKGROUND, 0.5)}
						onClick={(): void => {
							setFiltering((value: ItemFiltering): ItemFiltering => {
								if (value === ItemFiltering.Relic) {
									return ItemFiltering.All;
								}
								return ItemFiltering.Relic;
							});
						}}
					>
						<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={OUTLINE} />
						<uiaspectratioconstraint AspectRatio={1} />
						<Image
							key={"filter-kind"}
							size={UDim2.fromScale(0.8, 0.7)}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={new Vector2(0.5, 0.5)}
							image={"rbxassetid://7964618035"}
						/>
					</Button>
					<Button
						text={""}
						key={"filter-rarity"}
						size={UDim2.fromScale(0.08, 0.8)}
						position={UDim2.fromScale(0.1, 0.5)}
						anchorPoint={new Vector2(0, 0.5)}
						cornerRadius={new UDim(0, px(4))}
						backgroundColor={Lighten(BACKGROUND, 0.5)}
						onClick={(): void => {
							setFiltering((value: ItemFiltering): ItemFiltering => {
								if (value === ItemFiltering.Rarity) {
									return ItemFiltering.All;
								}
								return ItemFiltering.Rarity;
							});
						}}
					>
						<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={OUTLINE} />
						<uiaspectratioconstraint AspectRatio={1} />
						<Image
							key={"filter-rarity"}
							size={UDim2.fromScale(1, 1)}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={new Vector2(0.5, 0.5)}
							image={"rbxassetid://13916892997"}
						/>
					</Button>
					<Button
						text={""}
						key={"filter-kind-tower"}
						size={UDim2.fromScale(0.08, 0.8)}
						position={UDim2.fromScale(0.1, 0.5)}
						anchorPoint={new Vector2(0, 0.5)}
						cornerRadius={new UDim(0, px(4))}
						backgroundColor={Lighten(BACKGROUND, 0.5)}
						onClick={(): void => {
							setFiltering((value: ItemFiltering): ItemFiltering => {
								if (value === ItemFiltering.Tower) {
									return ItemFiltering.All;
								}
								return ItemFiltering.Tower;
							});
						}}
					>
						<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={OUTLINE} />
						<uiaspectratioconstraint AspectRatio={1} />
						<Image
							key={"filter-kind"}
							size={UDim2.fromScale(0.8, 0.7)}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={new Vector2(0.5, 0.5)}
							image={"rbxassetid://13916962510"}
						/>
					</Button>
					<Button
						text={""}
						key={"filter-level"}
						size={UDim2.fromScale(0.08, 0.8)}
						position={UDim2.fromScale(0.1, 0.5)}
						anchorPoint={new Vector2(0, 0.5)}
						cornerRadius={new UDim(0, px(4))}
						backgroundColor={Lighten(BACKGROUND, 0.5)}
						onClick={(): void => {
							setFiltering((value: ItemFiltering): ItemFiltering => {
								if (value === ItemFiltering.Level) {
									return ItemFiltering.All;
								}
								return ItemFiltering.Level;
							});
						}}
					>
						<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={OUTLINE} />
						<uiaspectratioconstraint AspectRatio={1} />
						<Image
							key={"level-icon"}
							size={UDim2.fromScale(1, 1)}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={new Vector2(0.5, 0.5)}
							image={"rbxassetid://12499789261"}
						/>
					</Button>
					<Button
						text={""}
						key={"filter-lock"}
						size={UDim2.fromScale(0.08, 0.8)}
						position={UDim2.fromScale(0.1, 0.5)}
						anchorPoint={new Vector2(0, 0.5)}
						cornerRadius={new UDim(0, px(4))}
						backgroundColor={Lighten(BACKGROUND, 0.5)}
						onClick={(): void => {
							setFiltering((value: ItemFiltering): ItemFiltering => {
								if (value === ItemFiltering.Locked) {
									return ItemFiltering.All;
								}
								return ItemFiltering.Locked;
							});
						}}
					>
						<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={OUTLINE} />
						<uiaspectratioconstraint AspectRatio={1} />
						<Image
							key={"lock-icon"}
							size={UDim2.fromScale(1, 1)}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={new Vector2(0.5, 0.5)}
							image={"rbxassetid://6088994136"}
						/>
					</Button>
					<TextField
						key={"search"}
						size={UDim2.fromScale(0.515, 0.8)}
						position={UDim2.fromScale(0.1, 0.5)}
						anchorPoint={new Vector2(0, 0.5)}
						cornerRadius={new UDim(0, px(4))}
						placeholderText={"Search..."}
						backgroundTransparency={0.85}
						textSize={px(18)}
						textColor={Latte.Base}
						placeholderColor={Latte.Base}
						font={FONTS.robotoMono.regular}
					>
						<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={OUTLINE} />
					</TextField>
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
						CanvasSize={UDim2.fromOffset(0, px(INVENTORY_COLUMN_COUNT * (ITEM_SLOT_SIZE.Y + 5)) + px(36))}
						ZIndex={2}
					>
						<uipadding
							PaddingTop={new UDim(0, px(18))}
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
						size={new UDim2(1, -px(15), 0, px(15))}
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
						size={new UDim2(1, -px(15), 0, px(15))}
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
						textColor={Latte.Base}
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
	);
}
