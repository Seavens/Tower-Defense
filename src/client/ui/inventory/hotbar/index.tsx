import { ColorUtil } from "client/ui/utility";
import { DelayRender, Frame, Group, ReactiveButton, Text, Transition } from "client/ui/components";
import { FONTS, PALETTE, SPRINGS } from "client/ui/constants";
import { HOTBAR_SIZE, SLOT_SIZE } from "../constants";
import { InventorySlot } from "../slot";
import { ItemKind, isTowerItemId } from "shared/inventory/types";
import { LevelUtility } from "shared/players/profile/utility";
import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";
import { Macchiato, Mocha } from "@rbxts/catppuccin";
import { Players } from "@rbxts/services";
import { UIKind } from "client/ui/types";
import { getSizeFactor } from "../utility";
import { itemDefinitions } from "shared/inventory";
import { selectCurrency } from "shared/game/selectors";
import { selectOpenUI } from "client/ui/selectors";
import { selectProfileData } from "client/players/profile/selectors";
import { useAbbreviation, useLightenedColor, useMotion, usePx, useStore } from "client/ui/hooks";
import { useEffect, useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { Item } from "shared/inventory/types";

export interface HotbarProps {
	visible: boolean;
	items: Map<Slot, Item>;
	equipped: Array<Slot>;
}

const player = Players.LocalPlayer;
const { Name } = player;

export function Hotbar({ visible, items, equipped }: HotbarProps): Element {
	const px = usePx();
	const store = useStore();

	const { experience, level, gems, coins } = useSelector(selectProfileData);
	const currency = useSelector(selectCurrency(Name));
	const open = useSelector(selectOpenUI);

	const [transparency, transparencyMotion] = useMotion(1);

	const max = useMemo((): number => {
		return LevelUtility.getMaxExp(level);
	}, [level]);

	const currencyText = useAbbreviation(currency, 2);
	const experienceText = useAbbreviation(experience, 2);
	const maxExperienceText = useAbbreviation(max, 2);
	const gemsText = useAbbreviation(gems, 2);
	const coinsText = useAbbreviation(coins, 2);
	const light = useLightenedColor(Mocha.Base, 0.15);

	const slots = useMemo(() => {
		const elements: Array<Element> = [];
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot = equipped[index - 1] ?? `${-1}`;
			const item = items.get(slot);
			const id = item?.id;
			const unique = item?.unique;
			const kind = unique?.kind;
			let cost = 0;
			if (id !== undefined && isTowerItemId(id)) {
				const { kind } = itemDefinitions[id];
				({ cost } = kind);
			}
			elements.push(
				<InventorySlot
					id={id}
					locked={cost > currency}
					level={unique !== undefined ? (kind === ItemKind.Tower ? unique.level : unique.multiplier) : 0}
					selected={true}
					enabled={id !== undefined}
					menu={false}
					layoutOrder={index}
					onLeftClick={(): void => {
						if (id === undefined) {
							return;
						}
						store.beginPlacement({ placing: id, slot });
					}}
				/>,
			);
		}
		return elements;
	}, [equipped, items, currency]);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.gentle);
	}, [visible]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={1}>
			<Transition
				size={UDim2.fromOffset(px(HOTBAR_SIZE.X + px(300)), px(HOTBAR_SIZE.Y) + px(60))}
				anchorPoint={new Vector2(0.5, 1)}
				position={UDim2.fromScale(0.5, 1)}
				groupTransparency={transparency}
				key={"hotbar-group"}
			>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				<Group
					size={UDim2.fromOffset(px(SLOT_SIZE.X) * 1.7, px(SLOT_SIZE.Y) + px(50))}
					key={"left-hotbar-frame"}
				/>
				<Group size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(SLOT_SIZE.Y) + px(75))} key={"center-hotbar-Frame"}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, px(4))}
					/>
					<Group size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(25))} key={"currency-text"}>
						<uilistlayout
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						<Text
							size={UDim2.fromOffset(px(HOTBAR_SIZE.X) / 3.5, px(25))}
							text={`<font color="#FFFF00">Coins:</font> ${coinsText}`}
							richText={true}
							textXAlignment="Left"
							font={FONTS.inter.bold}
							textColor={PALETTE.accent}
							strokeTransparency={0.25}
							textSize={px(14)}
							key={"coins-text"}
						/>
						<Text
							size={UDim2.fromOffset(px(HOTBAR_SIZE.X) / 2.5, px(25))}
							text={`<font color="#228B22">$</font>${currencyText}`}
							richText={true}
							font={FONTS.inter.bold}
							textColor={PALETTE.accent}
							strokeTransparency={0.25}
							textSize={px(24)}
							key={"currency-text"}
						/>
						<Text
							size={UDim2.fromOffset(px(HOTBAR_SIZE.X) / 3.5, px(25))}
							text={`<font color="#6495ED">Gems:</font> ${gemsText}`}
							richText={true}
							textXAlignment="Right"
							font={FONTS.inter.bold}
							textColor={PALETTE.accent}
							strokeTransparency={0.25}
							textSize={px(14)}
							key={"gems-text"}
						/>
					</Group>

					<Group key={"middle-center-Group"} size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(SLOT_SIZE.Y))}>
						<uilistlayout
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						{slots}
					</Group>
					<Frame
						key={"middle-bottom-frame"}
						size={UDim2.fromOffset(px(HOTBAR_SIZE.X) - px(4), px(20))}
						anchorPoint={new Vector2(0.5, 1)}
						position={UDim2.fromScale(0.5, 1)}
						backgroundColor={light}
						cornerRadius={new UDim(0, px(4))}
					>
						<uistroke
							Color={Macchiato.Base}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Thickness={px(1)}
						/>
						<Frame
							key={"level-bar"}
							size={UDim2.fromScale(math.min(experience / max, 1), getSizeFactor(experience, max, px(4)))}
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(0, 0.5)}
							backgroundColor={ColorUtil.darken(Macchiato.Blue, 0.25)}
							cornerRadius={new UDim(0, px(4))}
						/>
						<Text
							size={UDim2.fromOffset(px(HOTBAR_SIZE.X / 4), px(20))}
							position={UDim2.fromOffset(px(8), 0)}
							text={`${experienceText} / ${maxExperienceText}`}
							font={FONTS.inter.bold}
							textXAlignment="Left"
							textColor={PALETTE.accent}
							strokeTransparency={0.25}
							textSize={px(16)}
							key={"experience-text"}
						/>
						<Frame
							size={UDim2.fromOffset(px(25), px(25))}
							cornerRadius={new UDim(0.5, 0)}
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.5)}
							backgroundTransparency={0}
							backgroundColor={Macchiato.Overlay0}
						>
							<uistroke Color={Macchiato.Base} />
							<Text
								size={UDim2.fromScale(0.9, 0.9)}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
								text={`${level}`}
								font={FONTS.inter.bold}
								textXAlignment="Center"
								textColor={PALETTE.accent}
								strokeTransparency={0}
								textScaled={true}
								key={"experience-text"}
							></Text>
						</Frame>
					</Frame>
				</Group>
				<Group
					size={UDim2.fromOffset(px(SLOT_SIZE.X) * 1.7, px(SLOT_SIZE.Y) + px(50))}
					key={"right-hotbar-group"}
				>
					<ReactiveButton
						size={new UDim2(0.9, 0, 0, px(45))}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						backgroundColor={ColorUtil.darken(PALETTE.green, 0.25)}
						backgroundTransparency={0}
						cornerRadius={new UDim(0, px(4))}
						onClick={(): void => {
							open === UIKind.Inventory
								? store.closeUI({ kind: UIKind.Inventory })
								: store.openUI({ kind: UIKind.Inventory });
						}}
						enabled={true}
					>
						<uistroke
							Color={ColorUtil.darken(PALETTE.green, 0.5)}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Thickness={px(1)}
						/>
						<Text
							size={UDim2.fromOffset(px(70), px(50))}
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.5)}
							text={"Inventory"}
							font={FONTS.inter.bold}
							textColor={PALETTE.accent}
							strokeTransparency={0.25}
							textSize={px(18)}
							key={"inventory-text"}
						/>
					</ReactiveButton>
				</Group>
			</Transition>
		</DelayRender>
	);
}
