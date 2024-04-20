import { ASSET_IDS } from "shared/assets/constants";
import {
	CloseButton,
	DelayRender,
	Frame,
	Group,
	ReactiveButton,
	RenderInView,
	ScrollingFrame,
	SearchBar,
	Text,
	Transition,
} from "client/ui/components";
import { Events } from "client/network";
import {
	FILTER_DISPLAYS,
	INVENTORY_COLUMNS,
	INVENTORY_ROWS,
	INVENTORY_SIZE,
	INVENTORY_TOPBAR_Y,
	RARITY_ORDERS,
	SLOT_SIZE,
} from "../constants";
import { FONTS, PALETTE, SPRINGS } from "client/ui/constants";
import { InventoryFilterKind } from "../types";
import { InventorySlot } from "../slot";
import { InventoryViewport } from "./viewport";
import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utility";
import { Modding } from "@flamework/core";
import { formatStats } from "../utility";
import { idToName } from "shared/utility/functions/id-to-name";
import { itemDefinitions } from "shared/inventory";
import { useAsync, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { useDarkenedColor, useMotion, usePx, useRarityColor, useStore } from "client/ui/hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import type { AnyItemDefinition } from "shared/inventory";
import type { Binding, Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";
import type { SlotActions } from "../slot";

export interface InventoryProps {
	items: Map<Slot, Item>;
	equipped: Array<Slot>;
	visible: boolean;
	onClose?: () => void;
}

const filters = Modding.inspect<Array<InventoryFilterKind>>();

export function Inventory({ items, equipped, visible, onClose }: InventoryProps): Element {
	const px = usePx();
	const store = useStore();

	const [enabled, setEnabled] = useState(true);
	const [selected, setSelected] = useState<Slot>();
	const [container, setContainer] = useState<Frame>();
	const [search, setSearch] = useState<Array<string>>();
	const [filter, setFilter] = useState(InventoryFilterKind.All);

	const [transparency, transparencyMotion] = useMotion(1);

	const item = useMemo((): Option<Item> => {
		if (selected === undefined) {
			return undefined;
		}
		const item = items.get(selected);
		return item;
	}, [items, selected]);

	const definition = useMemo((): Option<AnyItemDefinition> => {
		if (item === undefined) {
			return undefined;
		}
		const { id } = item;
		return itemDefinitions[id];
	}, [item]);

	const [user] = useAsync(async (): Promise<string> => {
		if (item === undefined) return "";

		if (item.unique.kind !== ItemKind.Tower) return "";

		const { owner } = item.unique;

		return idToName(owner);
	}, [item]);

	const color = useRarityColor(definition?.rarity);
	const light = useDarkenedColor(color, 0.25);
	const medium = useDarkenedColor(color, 0.45);
	const dark = useDarkenedColor(color, 0.55);

	const stats = useMemo((): Option<Binding<string>> => {
		if (item === undefined) {
			return undefined;
		}
		return formatStats(item, color, px(20), user ?? "");
	}, [item, color, px]);

	const queries = useMemo((): Array<string> => {
		return ItemUtility.getAllItemNames();
	}, []);

	const slots = useMemo((): Map<string, Element> => {
		const slots = new Map<string, Element>();
		for (const [slot, item] of items) {
			const { id, unique } = item;
			const { locked, kind } = unique;
			const isEquipped = equipped.includes(slot);
			const { name, rarity } = itemDefinitions[id];
			const level = kind === ItemKind.Tower ? unique.level : unique.multiplier;

			if (filter === InventoryFilterKind.Locked && !unique.locked) {
				continue;
			}

			if (filter === InventoryFilterKind.Unlocked && unique.locked) {
				continue;
			}

			if (filter === InventoryFilterKind.Tower && kind !== ItemKind.Tower) {
				continue;
			}

			if (filter === InventoryFilterKind.Relic && kind !== ItemKind.Relic) {
				continue;
			}

			if (search !== undefined && !search.includes(name)) continue;

			const element = (
				<RenderInView
					container={container}
					key={`slot-${slot}`}
					layoutOrder={
						filter === InventoryFilterKind.Level
							? kind === ItemKind.Relic
								? 1000000 + -level
								: -level
							: filter === InventoryFilterKind.Rarity
								? RARITY_ORDERS[rarity] * 1000 + -level
								: tonumber(slot)
					}
				>
					<InventorySlot
						id={id}
						locked={locked}
						level={level}
						selected={selected === slot}
						enabled={enabled}
						menu={!enabled && selected === slot}
						equipped={isEquipped}
						onLeftClick={(): void => {
							if (!enabled) {
								return;
							}
							setSelected((value: Option<Slot>): Option<Slot> => (value === slot ? undefined : slot));
						}}
						onRightClick={(): void => {
							setEnabled(false);
							setSelected(slot);
						}}
						onActionClick={(action: SlotActions): void => {
							setEnabled(true);
							if (action === "Close") {
								return;
							} else if (action === "Lock" || action === "Unlock") {
								store.inventoryPatchSlot({ patch: { kind, locked: !locked }, slot });
								Events.inventory.lock(slot);
							} else if (action === "Equip") {
								store.inventoryEquipSlot({ slot });
								Events.inventory.equip(slot);
							} else if (action === "Unequip") {
								store.inventoryUnequipSlot({ slot });
								Events.inventory.unequip(slot);
							} else if (action === "Sell") {
								if (item.unique.locked === true) return;
								store.inventoryRemoveItems({ slots: [slot] });
								Events.inventory.sell(slot);
							}
						}}
					/>
				</RenderInView>
			);
			slots.set(`slot-${slot}`, element);
		}
		return slots;
	}, [items, equipped, container, enabled, selected, search, filter]);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.gentle);
	}, [visible]);

	useUnmountEffect((): void => {
		setSearch(undefined);
	});

	return (
		<DelayRender shouldRender={visible} unmountDelay={1}>
			<Transition
				size={UDim2.fromOffset(
					px(INVENTORY_SIZE.X) + px(3),
					px(SLOT_SIZE.Y) * INVENTORY_ROWS + px(INVENTORY_TOPBAR_Y),
				)}
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={Vector2.one.mul(0.5)}
				groupTransparency={transparency}
				key={"inventory-transition"}
			>
				<Group
					size={UDim2.fromOffset(
						px(INVENTORY_SIZE.X) + px(3),
						px(SLOT_SIZE.Y) * INVENTORY_ROWS + px(INVENTORY_TOPBAR_Y),
					)}
					position={UDim2.fromScale(0.5, 0.5)}
					anchorPoint={Vector2.one.mul(0.5)}
					key={"inventory-group"}
				>
					<Group
						size={UDim2.fromOffset(
							px(SLOT_SIZE.X) * INVENTORY_COLUMNS,
							px(SLOT_SIZE.Y) * INVENTORY_ROWS + px(INVENTORY_TOPBAR_Y),
						)}
						position={UDim2.fromScale(1, 0.5)}
						anchorPoint={new Vector2(1, 0.5)}
						key={"inventory-right"}
					>
						<Frame
							size={UDim2.fromOffset(px(SLOT_SIZE.X) * INVENTORY_COLUMNS, px(INVENTORY_TOPBAR_Y) - px(3))}
							position={UDim2.fromScale(1, 0)}
							anchorPoint={new Vector2(1, 0)}
							cornerRadius={new UDim(0, px(3))}
							backgroundColor={PALETTE.black}
							backgroundTransparency={0.35}
							key={"inventory-topbar"}
						>
							<SearchBar
								key={"search"}
								size={UDim2.fromOffset(px(200), px(INVENTORY_TOPBAR_Y) - px(3) * 3)}
								position={new UDim2(1, -px(30) - px(3), 0.5, 0)}
								anchorPoint={new Vector2(1, 0.5)}
								cornerRadius={new UDim(0, px(3))}
								backgroundTransparency={0.35}
								textSize={px(18)}
								textColor={PALETTE.accent}
								font={FONTS.robotoMono.regular}
								backgroundColor={PALETTE.black}
								onSearch={setSearch}
								clearTextOnFocus={true}
								queries={queries}
								enabled={enabled}
								accuracy={3}
							>
								<uistroke
									ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
									Thickness={1}
									Color={PALETTE.black}
								/>
							</SearchBar>
							<CloseButton
								size={UDim2.fromOffset(
									px(INVENTORY_TOPBAR_Y) - px(3) * 3,
									px(INVENTORY_TOPBAR_Y) - px(3) * 3,
								)}
								position={new UDim2(1, -px(3), 0.5, 0)}
								anchorPoint={new Vector2(1, 0.5)}
								textSize={px(INVENTORY_TOPBAR_Y + 5)}
								enabled={enabled}
								onClose={onClose}
								sound={ASSET_IDS.UIClick}
								key={"inventory-close"}
							/>
							<ReactiveButton
								size={
									new UDim2(
										0,
										px(SLOT_SIZE.X) * INVENTORY_COLUMNS -
											px(200) -
											px(INVENTORY_TOPBAR_Y) -
											px(3) * 2,
										0,
										px(INVENTORY_TOPBAR_Y) - px(3) * 3,
									)
								}
								position={new UDim2(0, px(3), 0.5, 0)}
								anchorPoint={new Vector2(0, 0.5)}
								backgroundColor={PALETTE.black}
								backgroundTransparency={0.35}
								cornerRadius={new UDim(0, px(3))}
								enabled={enabled}
								onLeftClick={(): void => {
									if (!enabled) {
										return;
									}
									if (filter === undefined) {
										setFilter(filters[0]);
										return;
									}
									let index = filters.indexOf(filter);
									if (index >= filters.size()) {
										index = 0;
									}
									const result = filters[(index + 1) % filters.size()];
									setFilter(result);
								}}
								onRightClick={(): void => {
									if (!enabled) {
										return;
									}
									if (filter === undefined) {
										setFilter(filters[filters.size() - 1]);
										return;
									}
									let index = filters.indexOf(filter);
									if (index <= 0) {
										index = filters.size();
									}
									const result = filters[(index - 1) % filters.size()];
									setFilter(result);
								}}
								sound={ASSET_IDS.UIClick}
								key={"inventory-filter"}
							>
								<Text
									size={UDim2.fromScale(1, 1)}
									position={UDim2.fromScale(0, 0)}
									anchorPoint={Vector2.zero}
									backgroundTransparency={1}
									text={FILTER_DISPLAYS[filter]}
									textColor={PALETTE.white}
									textSize={px(18)}
									font={FONTS.robotoMono.regular}
									richText={true}
									layoutOrder={2}
									key={"inventory-filter-name"}
								/>
							</ReactiveButton>
						</Frame>
						<Frame
							size={UDim2.fromOffset(
								px(SLOT_SIZE.X) * INVENTORY_COLUMNS,
								px(SLOT_SIZE.Y) * INVENTORY_ROWS,
							)}
							position={UDim2.fromScale(1, 1)}
							anchorPoint={Vector2.one}
							cornerRadius={new UDim(0, px(3))}
							backgroundColor={PALETTE.black}
							backgroundTransparency={0.35}
							ref={setContainer}
							key={"inventory-slots"}
						>
							<ScrollingFrame
								size={UDim2.fromScale(1, 1)}
								position={UDim2.fromScale(0.5, 0.5)}
								anchorPoint={Vector2.one.mul(0.5)}
								backgroundTransparency={1}
								canvasSize={UDim2.fromOffset(
									0,
									px(SLOT_SIZE.Y) * math.ceil(slots.size() / INVENTORY_COLUMNS),
								)}
								enabled={enabled}
							>
								{slots}

								<uigridlayout
									CellSize={UDim2.fromOffset(px(SLOT_SIZE.X), px(SLOT_SIZE.Y))}
									CellPadding={UDim2.fromScale(0, 0)}
									HorizontalAlignment={Enum.HorizontalAlignment.Center}
									VerticalAlignment={Enum.VerticalAlignment.Top}
									StartCorner={Enum.StartCorner.TopLeft}
									SortOrder={Enum.SortOrder.LayoutOrder}
								/>
							</ScrollingFrame>
							{slots.isEmpty() && (
								<Text
									size={UDim2.fromScale(1, 1)}
									position={UDim2.fromScale(0.5, 0.5)}
									anchorPoint={Vector2.one.mul(0.5)}
									backgroundTransparency={1}
									text={"No results..."}
									textColor={PALETTE.white}
									textSize={px(20)}
									textWrapped={true}
									key={"inventory-query"}
								/>
							)}
						</Frame>
					</Group>
					<Group
						size={UDim2.fromOffset(
							px(INVENTORY_SIZE.X) - px(SLOT_SIZE.X) * INVENTORY_COLUMNS,
							px(SLOT_SIZE.Y) * INVENTORY_ROWS + px(INVENTORY_TOPBAR_Y),
						)}
						position={UDim2.fromScale(0, 0.5)}
						anchorPoint={new Vector2(0, 0.5)}
						key={"inventory-left"}
					>
						<Frame
							size={UDim2.fromScale(1, 1)}
							position={UDim2.fromScale(0.5, 0.5)}
							anchorPoint={Vector2.one.mul(0.5)}
							cornerRadius={new UDim(0, px(3))}
							backgroundColor={PALETTE.black}
							backgroundTransparency={0.35}
							key={"inventory-background"}
						>
							<Frame
								size={
									new UDim2(
										1,
										0,
										0,
										px(INVENTORY_SIZE.X) - px(SLOT_SIZE.X) * INVENTORY_COLUMNS - px(3) * 2,
									)
								}
								position={UDim2.fromScale(0, 0)}
								anchorPoint={Vector2.zero}
								cornerRadius={new UDim(0, px(3))}
								backgroundColor={light}
								backgroundTransparency={0.35}
								key={"inventory-viewport"}
							>
								{item === undefined && (
									<Text
										size={UDim2.fromScale(1, 1)}
										position={UDim2.fromScale(0.5, 0.5)}
										anchorPoint={Vector2.one.mul(0.5)}
										backgroundTransparency={1}
										text={"Select an item..."}
										textColor={PALETTE.white}
										textSize={px(20)}
										textWrapped={true}
										key={"inventory-item-text"}
									/>
								)}
								{item !== undefined && <InventoryViewport id={item.id} />}
							</Frame>
							<Text
								size={
									new UDim2(
										1,
										0,
										1,
										-(px(INVENTORY_SIZE.X) - px(SLOT_SIZE.X) * INVENTORY_COLUMNS) + px(1),
									)
								}
								position={UDim2.fromScale(1, 1)}
								anchorPoint={Vector2.one}
								cornerRadius={new UDim(0, px(3))}
								backgroundColor={medium}
								backgroundTransparency={0.35}
								textXAlignment={"Left"}
								textYAlignment={"Top"}
								text={stats ?? ""}
								textColor={PALETTE.white}
								textSize={px(16)}
								textWrapped={true}
								richText={true}
								key={"inventory-item"}
							>
								<uipadding
									PaddingBottom={new UDim(0, px(3))}
									PaddingLeft={new UDim(0, px(6))}
									PaddingRight={new UDim(0, px(6))}
									PaddingTop={new UDim(0, px(3))}
									key={"inventory-padding"}
								/>
							</Text>
							<uipadding
								PaddingBottom={new UDim(0, px(3))}
								PaddingLeft={new UDim(0, px(3))}
								PaddingRight={new UDim(0, px(3))}
								PaddingTop={new UDim(0, px(3))}
								key={"inventory-padding"}
							/>
						</Frame>
					</Group>
				</Group>
			</Transition>
		</DelayRender>
	);
}
