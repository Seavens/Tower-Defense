import { Button, DelayRender, Frame, Group, Text, Transition } from "client/ui/components";
import { FONTS, PALETTE, SPRINGS } from "client/ui/constants";
import { HOTBAR_SIZE, SLOT_SIZE } from "../constants";
import { InventorySlot } from "../slot";
import { ItemKind, isTowerItemId } from "shared/inventory/types";
import { Latte, Macchiato, Mocha } from "@rbxts/catppuccin";
import { LevelUtility } from "shared/profile/utility";
import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";
import { PlayerUtility } from "shared/player/utility";
import { Players } from "@rbxts/services";
import { getSizeFactor } from "../utility";
import { itemDefinitions } from "shared/inventory/items";
import { selectCurrency } from "shared/game/selectors";
import { selectProfileData } from "client/profile/selectors";
import { truncateNumber } from "shared/utility/truncate-number";
import { useAbbreviation, useDarkenedColor, useLightenedColor, useMotion, usePx, useStore } from "client/ui/hooks";
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
const user = PlayerUtility.getUser(player);

export function Hotbar({ visible, items, equipped }: HotbarProps): Element {
	const px = usePx();
	const store = useStore();

	const { experience, level } = useSelector(selectProfileData);
	const currency = useSelector(selectCurrency(user));

	const [transparency, transparencyMotion] = useMotion(1);

	const max = useMemo((): number => {
		return LevelUtility.getMaxExp(level);
	}, [level]);

	const currencyText = useAbbreviation(currency, 0);
	const experienceText = useAbbreviation(experience);
	const maxExperienceText = useAbbreviation(max);
	warn(level, max, experience);

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
				size={UDim2.fromOffset(px(HOTBAR_SIZE.X + px(200)), px(HOTBAR_SIZE.Y) + px(50))}
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
					size={UDim2.fromOffset(px(SLOT_SIZE.X) * px(1.7), px(SLOT_SIZE.Y) + px(50))}
					key={"left-hotbar-group"}
				/>
				<Group size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(SLOT_SIZE.Y) + px(75))} key={"center-hotbar-Frame"}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, px(4))}
					/>
					<Text
						size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(25))}
						text={`Currency: $${currencyText}`}
						font={FONTS.inter.bold}
						textColor={PALETTE.accent}
						strokeTransparency={0.25}
						textSize={px(20)}
						key={"currency-text"}
					/>
					<Group key={"middle-center-group"} size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(SLOT_SIZE.Y))}>
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
						size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(25))}
						anchorPoint={new Vector2(0.5, 1)}
						position={UDim2.fromScale(0.5, 1)}
						backgroundColor={useLightenedColor(Mocha.Base, 0.15)}
						cornerRadius={new UDim(0, px(8))}
					>
						<uistroke
							Color={Macchiato.Base}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Thickness={px(2)}
						/>
						<Frame
							key={"level-bar"}
							size={UDim2.fromScale(math.min(experience / max, 1), getSizeFactor(experience, max))}
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(0, 0.5)}
							backgroundColor={useDarkenedColor(Macchiato.Blue, 0.25)}
							cornerRadius={new UDim(0, px(8))}
						/>
						<Text
							size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(25))}
							text={`Experience: ${experienceText} / ${maxExperienceText}`}
							font={FONTS.inter.bold}
							textColor={PALETTE.accent}
							strokeTransparency={0.25}
							textSize={px(20)}
							key={"experience-text"}
						/>
					</Frame>
				</Group>
				<Group
					size={UDim2.fromOffset(px(SLOT_SIZE.X) * px(1.7), px(SLOT_SIZE.Y) + px(50))}
					key={"right-hotbar-group"}
				/>
			</Transition>
		</DelayRender>
	);
}
