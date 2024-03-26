import { Darken } from "@rbxts/colour-utils";
import { Frame, Group } from "../components";
import { INVENTORY_SIZE, ITEM_SLOT_SIZE, SCROLLING_DEPTH } from "./constants";
import { ItemSlot } from "./item-slot";
import { MAXIMUM_STORED } from "shared/inventory/constants";
import { Mocha } from "@rbxts/catppuccin";
import { selectInventoryData } from "client/inventory/selectors";
import { store } from "client/state/store";
import { usePx } from "../hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ItemId } from "shared/inventory/types";

interface InventoryProps {}

export function Inventory(props: InventoryProps): Element {
	const px = usePx();
	const { stored } = useSelector(selectInventoryData);

	const background = Mocha.Base;
	const outline = Darken(Mocha.Base, 0.25);

	const elements = useMemo(() => {
		const elements: Array<Element> = [];
		for (const index of $range(1, stored.size())) {
			const slot: Slot = `${index}`;
			const tower = stored.get(slot);
			elements.push(
				<ItemSlot
					{...tower}
					onClick={(placing: ItemId): void => {
						store.beginPlacement({ placing, slot });
					}}
				/>,
			);
		}
		return elements;
	}, [stored]);

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
				backgroundColor={background}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.644, 0.5)}
				backgroundTransparency={0.1}
			>
				<uicorner CornerRadius={new UDim(0, px(5))} />
				<uistroke Color={outline} Thickness={px(2)} />
				<scrollingframe
					key={"inventory-background"}
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={background}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					BackgroundTransparency={1}
					CanvasSize={UDim2.fromOffset(0, SCROLLING_DEPTH)}
				>
					<uipadding PaddingTop={new UDim(0, px(15))} PaddingRight={new UDim(0, px(5))} />
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
			</Frame>
			<Frame
				key={"left-background"}
				size={UDim2.fromScale(0.285, 0.98)}
				backgroundColor={background}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.147, 0.5)}
				backgroundTransparency={0.1}
			>
				<uicorner CornerRadius={new UDim(0, px(5))} />
				<uistroke Color={outline} Thickness={px(2)} />
			</Frame>
		</Group>
	);
}
