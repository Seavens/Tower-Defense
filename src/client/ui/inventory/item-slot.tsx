import { FONTS } from "client/ui/constants";
import { Frame, Group } from "../components";
import { GetPerceivedBrightness } from "@rbxts/colour-utils";
import { ITEM_SLOT_SIZE } from "./constants";
import { ItemKind } from "shared/inventory/types";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { itemDefinitions } from "shared/inventory/items";
import { rarityDefinitions } from "shared/inventory/rarities";
import { usePx } from "../hooks";
import React, { useMemo } from "@rbxts/react";
import type { AnyItemDefinition } from "shared/inventory/items";
import type { AnyRarityDefinition } from "shared/inventory/rarities";
import type { Element } from "@rbxts/react";
import type { Item, ItemId } from "shared/inventory/types";

export interface ItemSlotProps extends Partial<Item> {
	onClick?: (id: ItemId) => void;
}

export function ItemSlot({ id, onClick }: ItemSlotProps): Element {
	const px = usePx();

	const definition = useMemo((): Option<AnyItemDefinition> => {
		if (id === undefined) {
			return undefined;
		}
		return itemDefinitions[id];
	}, [id]);
	const rarity = useMemo((): Option<AnyRarityDefinition> => {
		if (definition === undefined) {
			return undefined;
		}
		const { rarity } = definition;
		return rarityDefinitions[rarity];
	}, [definition]);

	const cost = useMemo((): number | undefined => {
		if (definition === undefined || definition.kind.kind !== ItemKind.Tower) {
			return undefined;
		}
		const { cost } = definition.kind;
		return cost;
	}, [definition]);

	const color = rarity?.color ?? Latte.Base;

	return (
		<Frame
			size={UDim2.fromOffset(px(ITEM_SLOT_SIZE.X), px(ITEM_SLOT_SIZE.Y))}
			anchorPoint={Vector2.one.mul(0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			backgroundColor={color}
			backgroundTransparency={0.65}
			clipsDescendants={true}
			key={"item-slot"}
			layoutOrder={id !== undefined ? 2 : 1}
		>
			<Group
				size={UDim2.fromScale(1, 0.8)}
				anchorPoint={Vector2.zero}
				position={UDim2.fromScale(0, 0)}
				clipsDescendants={true}
				zIndex={2}
				key={"slot-upper"}
			>
				<Group
					size={UDim2.fromScale(1, 1)}
					anchorPoint={Vector2.zero}
					position={UDim2.fromScale(0, 0)}
					key={"image-group"}
				>
					<imagebutton
						Size={UDim2.fromScale(1, 1)}
						AnchorPoint={Vector2.one.mul(0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						BackgroundTransparency={1}
						Image={definition?.image}
						ImageTransparency={definition === undefined ? 1 : 0}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							MouseButton1Click: (): void => {
								if (id === undefined) {
									return;
								}
								onClick?.(id);
							},
						}}
						key={"slot-image"}
					/>
					<uicorner CornerRadius={new UDim(0, px(5))} key={"image-corner"} />
				</Group>
			</Group>
			<Group
				size={UDim2.fromScale(1, 0.2)}
				anchorPoint={Vector2.one}
				position={UDim2.fromScale(1, 1)}
				clipsDescendants={true}
				zIndex={1}
				key={"slot-lower"}
			>
				<Frame
					size={UDim2.fromScale(1, 1)}
					anchorPoint={Vector2.one}
					position={UDim2.fromScale(1, 1)}
					backgroundColor={color}
					key={"lower-color"}
				>
					<Frame
						size={UDim2.fromScale(1, 0.5)}
						anchorPoint={Vector2.one}
						position={UDim2.fromScale(1, 0.25)}
						backgroundColor={color}
						key={"lower-color-top"}
						zIndex={1}
					/>
					<textlabel
						Size={UDim2.fromScale(1, 1)}
						AnchorPoint={Vector2.one}
						Position={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						TextColor3={GetPerceivedBrightness(color) >= 0.235 ? Latte.Base : Mocha.Crust}
						Text={definition === undefined ? "" : `$${cost}`}
						TextSize={px(10)}
						FontFace={FONTS.inter.bold}
						key={"tower-cost"}
					>
						<uistroke
							LineJoinMode={Enum.LineJoinMode.Round}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
							Color={GetPerceivedBrightness(color) < 0.235 ? Latte.Base : Mocha.Crust}
							Transparency={0.25}
							Thickness={2}
							key={"text-stroke"}
						/>
					</textlabel>
					<uicorner CornerRadius={new UDim(0, px(5))} key={"lower-corner"} />
				</Frame>
			</Group>
			<uistroke
				Color={Latte.Base}
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Thickness={1}
				key={"slot-outline"}
			/>
			<uicorner CornerRadius={new UDim(0, px(5))} key={"slot-corner"} />
		</Frame>
	);
}
