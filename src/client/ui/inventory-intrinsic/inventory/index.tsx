import { CloseButton, Frame, Group, RenderInView, ScrollingFrame, SearchBar, Text } from "client/ui/components";
import { Events } from "client/network";
import { FONTS, PALETTE } from "client/ui/constants";
import { INVENTORY_COLUMNS, INVENTORY_ROWS, INVENTORY_SIZE, SLOT_SIZE } from "../constants";
import { InventorySlot } from "../slot";
import { ItemKind } from "shared/inventory/types";
import { ItemUtility } from "shared/inventory/utility";
import { itemDefinitions } from "shared/inventory/items";
import { usePx, useStore } from "client/ui/hooks";
import React, { useMemo, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";
import type { SlotActions } from "../slot";

export interface InventoryProps {
	items: Map<Slot, Item>;
}

export function Inventory({ items }: InventoryProps): Element {
	const px = usePx();
	const store = useStore();

	const [enabled, setEnabled] = useState(true);
	const [selected, setSelected] = useState<Slot>();
	const [container, setContainer] = useState<Frame>();
	const [search, setSearch] = useState<Array<string>>();

	const item = useMemo((): Option<Item> => {
		if (selected === undefined) {
			return undefined;
		}
		const item = items.get(selected);
		return item;
	}, [items, selected]);

	const queries = useMemo((): Array<string> => {
		return ItemUtility.getAllItemNames();
	}, []);

	const slots = useMemo((): Map<string, Element> => {
		const slots = new Map<string, Element>();
		for (const [slot, item] of items) {
			const { id, unique } = item;
			const { locked, kind } = unique;

			const { name } = itemDefinitions[id];
			if (search !== undefined && !search.includes(name)) continue;

			const element = (
				<RenderInView container={container} layoutOrder={tonumber(slot)} key={`slot-${slot}`}>
					<InventorySlot
						id={id}
						locked={locked}
						level={kind === ItemKind.Tower ? unique.level : unique.multiplier}
						selected={selected === slot}
						enabled={enabled}
						menu={!enabled && selected === slot}
						layoutOrder={tonumber(slot)}
						onLeftClick={(): void => {
							if (!enabled) {
								return;
							}
							setSelected(slot);
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
							} else if (action === "Sell") {
								//
							}
						}}
					/>
				</RenderInView>
			);
			slots.set(`slot-${slot}`, element);
		}
		return slots;
	}, [items, container, enabled, selected, search]);

	return (
		<Group
			size={UDim2.fromOffset(px(INVENTORY_SIZE.X) + px(3), px(SLOT_SIZE.Y) * INVENTORY_ROWS + px(30))}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={Vector2.one.mul(0.5)}
			key={"inventory-group"}
		>
			<Group
				size={UDim2.fromOffset(px(SLOT_SIZE.X) * INVENTORY_COLUMNS, px(SLOT_SIZE.Y) * INVENTORY_ROWS + px(30))}
				position={UDim2.fromScale(1, 0.5)}
				anchorPoint={new Vector2(1, 0.5)}
				key={"inventory-right"}
			>
				<Frame
					size={UDim2.fromOffset(px(SLOT_SIZE.X) * INVENTORY_COLUMNS, px(30) - px(3))}
					position={UDim2.fromScale(1, 0)}
					anchorPoint={new Vector2(1, 0)}
					cornerRadius={new UDim(0, px(3))}
					backgroundColor={PALETTE.black}
					backgroundTransparency={0.35}
					key={"inventory-topbar"}
				>
					<SearchBar
						key={"search"}
						size={UDim2.fromOffset(px(200), px(30) - px(3) * 2)}
						position={new UDim2(1, -px(30) - px(3), 1, 0)}
						anchorPoint={Vector2.one}
						cornerRadius={new UDim(0, px(3))}
						backgroundTransparency={0}
						textSize={px(18)}
						textColor={PALETTE.accent}
						font={FONTS.robotoMono.regular}
						backgroundColor={PALETTE.black}
						onSearch={setSearch}
						clearTextOnFocus={true}
						queries={queries}
						enabled={true}
						accuracy={3}
					>
						<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={PALETTE.black} />
					</SearchBar>
					<CloseButton
						size={UDim2.fromOffset(px(30) - px(3) * 2, px(30) - px(3) * 2)}
						position={new UDim2(1, -px(3), 1, 0)}
						anchorPoint={Vector2.one}
						textSize={px(30)}
						enabled={enabled}
						key={"inventory-close"}
					/>
				</Frame>
				<Frame
					size={UDim2.fromOffset(px(SLOT_SIZE.X) * INVENTORY_COLUMNS, px(SLOT_SIZE.Y) * INVENTORY_ROWS)}
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
						canvasSize={UDim2.fromOffset(0, px(SLOT_SIZE.Y) * math.ceil(slots.size() / INVENTORY_COLUMNS))}
						enabled={enabled}
					>
						{slots}

						<uigridlayout
							CellSize={UDim2.fromOffset(px(SLOT_SIZE.X), px(SLOT_SIZE.Y))}
							CellPadding={UDim2.fromScale(0, 0)}
							SortOrder={Enum.SortOrder.LayoutOrder}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Top}
							StartCorner={Enum.StartCorner.TopLeft}
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
					px(SLOT_SIZE.Y) * INVENTORY_ROWS + px(30),
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
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					<viewportframe Size={UDim2.fromOffset(px(100), px(100))} key={"inventory-viewport"} />
				</Frame>
			</Group>
		</Group>
	);
}
