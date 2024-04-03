import { Frame, Group, ScrollingFrame } from "client/ui/components";
import { INVENTORY_COLUMNS, INVENTORY_SIZE, SLOT_SIZE } from "../constants";
import { InventorySlot } from "../slot";
import { ItemKind } from "shared/inventory/types";
import { PALETTE } from "client/ui/constants";
import { usePx } from "client/ui/hooks";
import React, { useMemo, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";

export interface InventoryProps {
	items: Map<Slot, Item>;
}

export function Inventory({ items }: InventoryProps): Element {
	const px = usePx();

	const [enabled, setEnabled] = useState(true);
	const [selected, setSelected] = useState<Slot>();

	const item = useMemo((): Option<Item> => {
		if (selected === undefined) {
			return undefined;
		}
		const item = items.get(selected);
		return item;
	}, [items, selected]);

	const slots = useMemo((): Array<Element> => {
		const slots = new Array<Element>();
		for (const [slot, item] of items) {
			const { id, unique } = item;
			const { locked, kind } = unique;
			const element = (
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
					onActionClick={(action: string): void => {
						setEnabled(true);
						// Do something with the action.
					}}
				/>
			);
			slots.push(element);
		}
		return slots;
	}, [items, enabled, selected]);

	return (
		<Group
			size={UDim2.fromOffset(px(INVENTORY_SIZE.X) + px(3), px(SLOT_SIZE.Y) * INVENTORY_COLUMNS + px(30))}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={Vector2.one.mul(0.5)}
			key={"inventory-group"}
		>
			<Group
				size={UDim2.fromOffset(
					px(SLOT_SIZE.X) * INVENTORY_COLUMNS,
					px(SLOT_SIZE.Y) * INVENTORY_COLUMNS + px(30),
				)}
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
					{/*  */}
				</Frame>
				<Frame
					size={UDim2.fromOffset(px(SLOT_SIZE.X) * INVENTORY_COLUMNS, px(SLOT_SIZE.Y) * INVENTORY_COLUMNS)}
					position={UDim2.fromScale(1, 1)}
					anchorPoint={Vector2.one}
					cornerRadius={new UDim(0, px(3))}
					backgroundColor={PALETTE.black}
					backgroundTransparency={0.35}
					key={"inventory-slots"}
				>
					<ScrollingFrame
						size={UDim2.fromScale(1, 1)}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={Vector2.one.mul(0.5)}
						backgroundTransparency={1}
						canvasSize={UDim2.fromOffset(0, px(SLOT_SIZE.Y) * math.ceil(items.size() / INVENTORY_COLUMNS))}
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
				</Frame>
			</Group>
			<Group
				size={UDim2.fromOffset(
					px(INVENTORY_SIZE.X) - px(SLOT_SIZE.X) * INVENTORY_COLUMNS,
					px(SLOT_SIZE.Y) * INVENTORY_COLUMNS + px(30),
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
				/>
			</Group>
		</Group>
	);
}
