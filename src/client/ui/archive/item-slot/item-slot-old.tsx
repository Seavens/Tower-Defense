// import { Darken, GetPerceivedBrightness } from "@rbxts/colour-utils";
// import { FONTS, SPRINGS } from "client/ui/constants";
// import { Frame, Group, Image, Text } from "client/ui/components";
// import { ITEM_SLOT_SIZE } from "../constants";
// import { ItemKind } from "shared/inventory/types";
// import { Latte, Mocha } from "@rbxts/catppuccin";
// import { map } from "@rbxts/pretty-react-hooks";
// import { useItemDefinition, useRarityDefinition } from "../utils";
// import { useMotion, usePx } from "client/ui/hooks";
// import React, { useEffect, useMemo } from "@rbxts/react";
// import type { Element } from "@rbxts/react";
// import type { Item, ItemId } from "shared/inventory/types";

// export interface ItemSlotProps extends Partial<Item> {
// 	affordable?: boolean;
// 	selected?: boolean;
// 	layoutOrder?: number;
// 	onClick?: (id: ItemId) => void;
// }

// export function ItemSlot({ id, unique, affordable, selected, layoutOrder, onClick }: ItemSlotProps): Element {
// 	const px = usePx();

// 	const definition = useItemDefinition(id);
// 	const rarity = useRarityDefinition(id);

// 	const [outline, outlineMotion] = useMotion(1);

// 	const cost = useMemo((): Option<number> => {
// 		if (definition === undefined) {
// 			return undefined;
// 		}
// 		const { kind } = definition;
// 		if (kind.kind !== ItemKind.Tower) {
// 			return undefined;
// 		}
// 		const { cost } = kind;
// 		return cost;
// 	}, [definition]);

// 	const color = rarity?.color ?? Latte.Base;

// 	useEffect((): void => {
// 		outlineMotion.spring(selected ? 0 : 1, SPRINGS.gentle);
// 	}, [selected]);

// 	return (
// 		<Group
// 			size={UDim2.fromOffset(px(ITEM_SLOT_SIZE.X), px(ITEM_SLOT_SIZE.Y))}
// 			anchorPoint={Vector2.one.mul(0.5)}
// 			position={UDim2.fromScale(0.5, 0.5)}
// 			layoutOrder={layoutOrder}
// 			key={"item-slot"}
// 		>
// 			<Frame
// 				size={UDim2.fromOffset(px(ITEM_SLOT_SIZE.X) - px(2) * 2, px(ITEM_SLOT_SIZE.Y) - px(2) * 2)}
// 				anchorPoint={Vector2.one.mul(0.5)}
// 				position={UDim2.fromScale(0.5, 0.5)}
// 				cornerRadius={new UDim(0, px(5))}
// 				backgroundColor={Darken(color, 0.25)}
// 				key={"slot-group"}
// 			>
// 				<Frame
// 					size={UDim2.fromScale(1, 1)}
// 					anchorPoint={new Vector2(0.5, 0.5)}
// 					position={UDim2.fromScale(0.5, 0.5)}
// 					cornerRadius={new UDim(0, px(5))}
// 					key={"locked-image"}
// 					backgroundColor={new Color3(0.27, 0.27, 0.27)}
// 					backgroundTransparency={affordable ? 1 : 0.5}
// 					zIndex={15}
// 				>
// 					<Image
// 						size={UDim2.fromOffset(px(ITEM_SLOT_SIZE.X) - px(25), px(ITEM_SLOT_SIZE.Y) - px(25))}
// 						anchorPoint={new Vector2(0.5, 0.5)}
// 						position={UDim2.fromScale(0.5, 0.4)}
// 						cornerRadius={new UDim(0, px(5))}
// 						image={"rbxassetid://4772171909"}
// 						key={"locked-image"}
// 						backgroundTransparency={1}
// 						imageTransparency={affordable ? 1 : 0.5}
// 						clipsDescendants={true}
// 					>
// 						<uiaspectratioconstraint AspectRatio={1} key={"locked-aspect-ratio"} />
// 					</Image>
// 				</Frame>
// 				<Group
// 					size={UDim2.fromScale(1, 0.8)}
// 					anchorPoint={Vector2.zero}
// 					position={UDim2.fromScale(0, 0)}
// 					clipsDescendants={true}
// 					zIndex={2}
// 					key={"slot-upper"}
// 				>
// 					<Group
// 						size={UDim2.fromScale(1, 1)}
// 						anchorPoint={Vector2.zero}
// 						position={UDim2.fromScale(0, 0)}
// 						key={"image-group"}
// 					>
// 						<imagebutton
// 							Size={UDim2.fromScale(1, 1)}
// 							AnchorPoint={Vector2.one.mul(0.5)}
// 							Position={UDim2.fromScale(0.5, 0.5)}
// 							BackgroundTransparency={1}
// 							Image={definition?.image}
// 							ImageTransparency={definition === undefined ? 1 : 0}
// 							ScaleType={Enum.ScaleType.Fit}
// 							Event={{
// 								MouseButton1Click: (): void => {
// 									if (id === undefined || !affordable) {
// 										return;
// 									}
// 									onClick?.(id);
// 								},
// 							}}
// 							key={"slot-image"}
// 						>
// 							<Text
// 								size={new UDim2(1, 0, 0, px(12))}
// 								position={new UDim2(0, px(4), 1, 0)}
// 								anchorPoint={new Vector2(0, 1)}
// 								backgroundTransparency={1}
// 								text={
// 									unique !== undefined && unique.kind === ItemKind.Tower ? `Lv: ${unique.level}` : ""
// 								}
// 								textStrokeColor={Mocha.Base}
// 								textStrokeTransparency={0.75}
// 								textXAlignment={"Left"}
// 								textColor={Latte.Base}
// 								textSize={px(10)}
// 								font={FONTS.nunito.regular}
// 								zIndex={1}
// 								key={"tower-level"}
// 							/>
// 						</imagebutton>
// 					</Group>
// 				</Group>
// 				<Group
// 					size={UDim2.fromScale(1, 0.2)}
// 					anchorPoint={Vector2.one}
// 					position={UDim2.fromScale(1, 1)}
// 					clipsDescendants={true}
// 					zIndex={1}
// 					key={"slot-lower"}
// 				>
// 					<Frame
// 						size={UDim2.fromScale(1, 1)}
// 						anchorPoint={Vector2.one}
// 						position={UDim2.fromScale(1, 1)}
// 						cornerRadius={new UDim(0, px(5))}
// 						backgroundColor={Darken(color, 0.45)}
// 						key={"lower-color"}
// 					>
// 						<Frame
// 							size={UDim2.fromScale(1, 0.5)}
// 							anchorPoint={Vector2.one}
// 							position={UDim2.fromScale(1, 0.25)}
// 							backgroundColor={Darken(color, 0.45)}
// 							key={"lower-color-top"}
// 							zIndex={1}
// 						/>
// 						<Text
// 							size={UDim2.fromScale(1, 1)}
// 							anchorPoint={Vector2.one}
// 							position={UDim2.fromScale(1, 1)}
// 							textStrokeColor={Mocha.Crust}
// 							textStrokeTransparency={0.75}
// 							textColor={Latte.Base}
// 							text={definition === undefined ? "" : `$${cost}`}
// 							textSize={px(10)}
// 							font={FONTS.inter.bold}
// 							key={"tower-cost"}
// 						/>
// 					</Frame>
// 				</Group>
// 				<uistroke
// 					Color={Darken(Mocha.Base, 0.25)}
// 					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
// 					Transparency={outline.map((value: number): number => map(value, 0, 1, 0.25, 1))}
// 					Thickness={px(2)}
// 					key={"slot-outline"}
// 				/>
// 			</Frame>
// 		</Group>
// 	);
// }

export = undefined;
