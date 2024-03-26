import { Darken } from "@rbxts/colour-utils";
import { Frame, Group } from "../components";
import { INVENTORY_COLUMN_COUNT, INVENTORY_SIZE, ITEM_SLOT_SIZE, TRANSPARENCY_GRADIENT } from "./constants";
import { ItemSlot } from "./item-slot";
import { Latte, Mocha } from "@rbxts/catppuccin";
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
	const thickness = 6;

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
				backgroundTransparency={0}
			>
				<uicorner CornerRadius={new UDim(0, px(5))} />
				<uistroke Color={outline} Thickness={px(2)} />
				<Group
					key={"scroll-group"}
					size={UDim2.fromScale(1, 1)}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
				>
					<scrollingframe
						key={"inventory-background"}
						Size={new UDim2(1, -px(2), 1, 0)}
						BackgroundColor3={background}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={new UDim2(0.5, -px(2), 0.5, 0)}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						ScrollBarThickness={px(thickness)}
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
						backgroundColor={background}
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
						backgroundColor={background}
						zIndex={2}
					>
						<uigradient
							Transparency={TRANSPARENCY_GRADIENT}
							Rotation={270}
							key={"bottom-scrolling-transparency"}
						/>
					</Frame>
					<Frame
						size={new UDim2(0, px(thickness), 1, -px(6))}
						position={new UDim2(1, -px.scale(thickness / 2), 0.5, 0)}
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
				backgroundColor={background}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.147, 0.5)}
				backgroundTransparency={0}
				zIndex={1}
			>
				<uicorner CornerRadius={new UDim(0, px(5))} />
				<uistroke Color={outline} Thickness={px(2)} />
			</Frame>
		</Group>
	);
}
