import { FONTS, PALETTE, SPRINGS } from "client/ui/constants";
import { Frame, Group, Image, ReactiveButton, Text } from "client/ui/components";
import { ItemKind, ItemRarity } from "shared/inventory/types";
import { Modding } from "@flamework/core";
import { SLOT_SIZE } from "../constants";
import { SlotActions } from "./actions";
import { itemDefinitions } from "shared/inventory/items";
import { map } from "@rbxts/pretty-react-hooks";
import { rarityDefinitions } from "shared/inventory/rarities";
import { useAbbreviation, useDarkenedColor, useDefinition, useMotion, usePx } from "client/ui/hooks";
import { useRainbow } from "client/ui/hooks/use-rainbow-animation";
import React, { useEffect, useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ItemId } from "shared/inventory/types";

interface InventorySlotProps {
	id: ItemId;
	locked: boolean;
	level: number;
	enabled: boolean;
	selected: boolean;
	menu: boolean;
	layoutOrder?: number;
	onLeftClick?: () => void;
	onRightClick?: () => void;
	onActionClick?: (action: SlotActions) => void;
}

export type SlotActions = "Sell" | "Equip" | "Lock" | "Unlock" | "Close";

const useItemDefinition = useDefinition(itemDefinitions);
const useRarityDefinition = useDefinition(rarityDefinitions);

export function InventorySlot({
	id,
	locked,
	level,
	enabled,
	selected,
	menu,
	layoutOrder = 1,
	onLeftClick,
	onRightClick,
	onActionClick,
}: InventorySlotProps): Element {
	const px = usePx();

	const { name, rarity, image, kind } = useItemDefinition(id);
	let { color } = useRarityDefinition(rarity);
	color = (rarity === ItemRarity.Mythical ? useRainbow() : color) as never;

	const cost = useAbbreviation(kind.kind === ItemKind.Tower ? kind.cost : 0, 0);
	const darkened = useDarkenedColor(color, 0.5);
	const abbreviated = useAbbreviation(level, kind.kind === ItemKind.Tower ? 0 : 2);

	const [outline, outlineMotion] = useMotion(1);
	const [transparency, transparencyMotion] = useMotion(0);
	const [imageTransparency, imageMotion] = useMotion(0);
	const [lock, lockMotion] = useMotion(1);

	const actions = useMemo((): Array<SlotActions> => {
		return ["Sell", "Equip", locked ? "Unlock" : "Lock", "Close"];
	}, [locked]);

	useEffect((): void => {
		outlineMotion.spring(selected ? (enabled ? 0 : 0.5) : 1, SPRINGS.gentle);
	}, [selected, enabled]);

	useEffect((): void => {
		transparencyMotion.spring(enabled ? 0 : 1, SPRINGS.responsive);
	}, [enabled]);

	useEffect((): void => {
		imageMotion.spring(enabled ? (locked ? 0.35 : 0) : 1, SPRINGS.gentle);
		lockMotion.spring(locked ? (enabled ? 0.35 : 0.5) : 1, SPRINGS.gentle);
	}, [locked, enabled]);

	return (
		<Group
			size={UDim2.fromOffset(px(SLOT_SIZE.X), px(SLOT_SIZE.Y))}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={Vector2.one.mul(0.5)}
			layoutOrder={layoutOrder}
			key={"slot-group"}
		>
			<ReactiveButton
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={Vector2.one.mul(0.5)}
				cornerRadius={new UDim(0, px(3))}
				backgroundColor={darkened}
				backgroundTransparency={0}
				enabled={enabled}
				onLeftClick={onLeftClick}
				onRightClick={(): void => {
					onRightClick?.();
				}}
				key={"slot-button"}
			>
				<Group
					size={UDim2.fromOffset(px(SLOT_SIZE.X) - px(3) * 2, px(SLOT_SIZE.X) - px(3))}
					position={UDim2.fromScale(0, 0)}
					anchorPoint={Vector2.zero}
					zIndex={2}
					key={"slot-upper"}
				>
					<Image
						size={UDim2.fromScale(1, 1)}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={Vector2.one.mul(0.5)}
						backgroundTransparency={1}
						image={image}
						imageTransparency={imageTransparency}
						zIndex={1}
						key={"slot-image"}
					>
						<Text
							size={new UDim2(1, 0, 0, px(12))}
							position={UDim2.fromScale(0, 1)}
							anchorPoint={new Vector2(0, 1)}
							backgroundTransparency={1}
							text={kind.kind === ItemKind.Tower ? `Lv: ${abbreviated}` : `${abbreviated}`}
							textColor={PALETTE.white}
							font={FONTS.inter.bold}
							textSize={px(12)}
							textWrapped={true}
							textTransparency={imageTransparency.map((value: number): number =>
								map(value, 0, 1, 0, 0.95),
							)}
							key={"slot-level"}
						>
							<uistroke
								ApplyStrokeMode={"Contextual"}
								LineJoinMode={"Round"}
								Color={PALETTE.black}
								Thickness={1}
								Transparency={0.5}
								key={"slot-stroke"}
							/>
						</Text>
					</Image>
					<Image
						size={UDim2.fromScale(1, 1)}
						position={UDim2.fromScale(1, 0)}
						anchorPoint={new Vector2(1, 0)}
						backgroundTransparency={1}
						image={"rbxassetid://4772171909"}
						imageTransparency={lock}
						imageColor={PALETTE.white}
						zIndex={2}
						key={"slot-locked"}
					/>
				</Group>
				<Group
					size={UDim2.fromOffset(px(SLOT_SIZE.X) - px(3) * 2, px(SLOT_SIZE.Y) - px(SLOT_SIZE.X) - px(3))}
					position={UDim2.fromScale(1, 1)}
					anchorPoint={Vector2.one}
					clipsDescendants={true}
					zIndex={1}
					key={"slot-lower"}
				>
					<Text
						size={UDim2.fromScale(1, 1)}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={Vector2.one.mul(0.5)}
						text={kind.kind === ItemKind.Tower ? `$${cost}` : name}
						textColor={PALETTE.white}
						font={FONTS.inter.bold}
						textSize={px(16)}
						textWrapped={true}
						textTransparency={transparency.map((value: number): number => map(value, 0, 1, 0, 0.5))}
						zIndex={2}
						key={"slot-cost"}
					>
						<uistroke
							ApplyStrokeMode={"Contextual"}
							LineJoinMode={"Round"}
							Color={PALETTE.black}
							Thickness={1}
							Transparency={0.5}
							key={"slot-stroke"}
						/>
					</Text>
					<Frame
						size={new UDim2(1, 0, 0, px(SLOT_SIZE.Y))}
						position={UDim2.fromScale(1, 1)}
						anchorPoint={Vector2.one}
						cornerRadius={new UDim(0, px(3))}
						backgroundColor={color}
						backgroundTransparency={transparency.map((value: number): number => map(value, 0, 1, 0, 0.75))}
						zIndex={1}
						key={"slot-color"}
					/>
				</Group>
				<uistroke
					Color={PALETTE.white}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Transparency={outline}
					Thickness={1}
					key={"slot-outline"}
				/>
				{!enabled && menu && (
					<SlotActions<SlotActions> actions={actions} onClick={onActionClick} visible={menu} />
				)}
			</ReactiveButton>
			<uipadding
				PaddingBottom={new UDim(0, px(3))}
				PaddingLeft={new UDim(0, px(3))}
				PaddingRight={new UDim(0, px(3))}
				PaddingTop={new UDim(0, px(3))}
				key={"slot-padding"}
			/>
		</Group>
	);
}
