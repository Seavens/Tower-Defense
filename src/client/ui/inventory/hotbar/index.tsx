import { EXP_BAR_SIZE_Y, HOTBAR_SIZE, ITEM_SLOT_SIZE } from "client/ui/archive/constants";
import { type Element, useMemo, useState } from "@rbxts/react";
import { Events } from "client/network";
import { FONTS } from "client/ui/constants";
import { Frame, Group, Text } from "client/ui/components";
import { InventorySlot } from "../slot";
import { type ItemId, ItemKind } from "shared/inventory/types";
import { ItemSlot } from "client/ui/archive/item-slot/item-slot";
import { Latte, Macchiato, Mocha } from "@rbxts/catppuccin";
import { LevelUtil } from "shared/profile/utils";
import { Players } from "@rbxts/services";
import { getTowerCost } from "client/ui/archive/utils/get-tower-cost";
import { itemDefinitions } from "shared/inventory/items";
import { selectCurrency } from "shared/game/selectors";
import { selectInventoryData } from "client/inventory/selectors";
import { selectProfileData } from "client/profile/selectors";
import { store } from "client/state/store";
import { truncateNumber } from "shared/utils/truncate-number";
import { useAbbreviation, useMotion, usePx } from "client/ui/hooks";
import { useSelector } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import type { Item } from "shared/inventory/types";

export interface HotbarProps {
	items: Map<Slot, Item>;
}

export function Hotbar({ items }: HotbarProps): Element {
	const px = usePx();
	const userName = Players.LocalPlayer.Name;

	const { equipped } = useSelector(selectInventoryData);
	const { experience, level } = useSelector(selectProfileData);
	const currency = useSelector(selectCurrency(userName));

	const [enabled, setEnabled] = useState(true);
	const [selected, setSelected] = useState<Slot>();
	const [container, setContainer] = useState<Frame>();

	const max = useMemo((): number => {
		return LevelUtil.getMaxExp(level);
	}, [level]);

	const currencyText = useAbbreviation(currency);
	const experienceText = useAbbreviation(experience);
	const maxExperienceText = useAbbreviation(max);

	// const elements = useMemo(() => {
	// 	const elements: Array<Element> = [];
	// 	for (const slot of equipped) {
	// 		const tower = stored.get(slot);
	// 		const cost = getTowerCost(tower?.id);
	// 		elements.push(
	// 			<ItemSlot
	// 				{...tower}
	// 				affordable={currency >= cost}
	// 				selected={true}
	// 				onClick={(placing: ItemId): void => {
	// 					store.beginPlacement({ placing, slot });
	// 				}}
	// 			/>,
	// 		);
	// 	}
	// 	return elements;
	// }, [equipped, stored, currency]);

	const slots = useMemo((): Map<string, Element> => {
		const slots = new Map<string, Element>();
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
					// onLeftClick={(): void => {
					// 	if (!enabled) {
					// 		return;
					// 	}
					// 	setSelected((value: Option<Slot>): Option<Slot> => (value === slot ? undefined : slot));
					// }}
					// onRightClick={(): void => {
					// 	setEnabled(false);
					// 	setSelected(slot);
					// }}
					// onActionClick={(action: SlotActions): void => {
					// 	setEnabled(true);
					// 	if (action === "Close") {
					// 		return;
					// 	} else if (action === "Lock" || action === "Unlock") {
					// 		store.inventoryPatchSlot({ patch: { kind, locked: !locked }, slot });
					// 		Events.inventory.lock(slot);
					// 	} else if (action === "Equip") {
					// 		store.inventoryEquipSlot({ slot });
					// 		Events.inventory.equip(slot);
					// 	} else if (action === "Sell") {
					// 		//
					// 	}
					// }}
				/>
			);
			slots.set(`slot-${slot}`, element);
		}
		return slots;
	}, [items, container, enabled, selected]);

	return (
		<Group
			key={"hotbar-group"}
			size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(HOTBAR_SIZE.Y) + px(4))}
			anchorPoint={new Vector2(0.5, 1)}
			position={UDim2.fromScale(0.5, 1)}
		>
			<Text
				key={"currency-text"}
				size={UDim2.fromOffset(px(100), px(20))}
				anchorPoint={new Vector2(0.5, 1)}
				position={UDim2.fromScale(0.5, -0.05)}
				backgroundTransparency={1}
				textSize={px(14)}
				font={FONTS.inter.bold}
				textColor={Macchiato.Base}
				text={currency === undefined ? `Undefined` : `$${currencyText}`}
			/>
			<Frame
				key={"item-group"}
				size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(ITEM_SLOT_SIZE.Y))}
				anchorPoint={new Vector2(0.5, 0)}
				position={UDim2.fromScale(0.5, 0)}
				backgroundTransparency={1}
			>
				{slots}
				<uilistlayout
					key={"item-layout"}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 0)}
				/>
			</Frame>
			<Frame
				key={"level-frame"}
				size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(EXP_BAR_SIZE_Y))}
				// backgroundColor={Darken(Mocha.Mauve, 0.75)}
				cornerRadius={new UDim(0, px(5))}
				anchorPoint={new Vector2(0.5, 1)}
				position={UDim2.fromScale(0.5, 1)}
			>
				<uistroke
					// Color={Darken(Mocha.Blue, 0.5)}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Thickness={px(1)}
					key={"level-outline"}
				/>
				<Frame
					key={"level-bar"}
					size={UDim2.fromScale(math.min(experience / max, 1), 1)}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0, 0.5)}
					backgroundColor={Mocha.Blue}
					cornerRadius={new UDim(0, px(5))}
				/>
				<textlabel
					key={"experience-text"}
					Size={UDim2.fromScale(0.5, 1)}
					AnchorPoint={new Vector2(0, 0.5)}
					Position={new UDim2(0, px(7), 0.5, 0)}
					BackgroundTransparency={1}
					TextColor3={Latte.Base}
					Text={`${experienceText}/${maxExperienceText}`}
					TextSize={px(12)}
					FontFace={FONTS.inter.bold}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
			</Frame>
			<Frame
				key={"level-holder"}
				size={UDim2.fromOffset(px(EXP_BAR_SIZE_Y), px(EXP_BAR_SIZE_Y))}
				anchorPoint={new Vector2(0.5, 1)}
				position={UDim2.fromScale(0.5, 1)}
				backgroundColor={Mocha.Teal}
				zIndex={2}
			>
				<textlabel
					key={"level-value"}
					Size={UDim2.fromOffset(0, px(12))}
					AnchorPoint={Vector2.one.mul(0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					BackgroundColor3={Mocha.Teal}
					TextColor3={Latte.Base}
					Text={truncateNumber(level, 0)}
					TextSize={px(16)}
					FontFace={FONTS.inter.bold}
					AutomaticSize={Enum.AutomaticSize.X}
					TextStrokeColor3={Mocha.Base}
					TextStrokeTransparency={0}
				>
					<uipadding
						PaddingBottom={new UDim(0, px(5))}
						PaddingLeft={new UDim(0, px(3))}
						PaddingRight={new UDim(0, px(3))}
						PaddingTop={new UDim(0, px(5))}
						key={"text-padding"}
					/>
					<uicorner CornerRadius={new UDim(0, px(3))} key={"level-corner"} />
				</textlabel>
				<uicorner CornerRadius={new UDim(1, 0)} key={"level-corner"} />
			</Frame>
		</Group>
	);
}
