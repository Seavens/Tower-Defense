import { DelayRender, Frame, Group, Text, Transition } from "client/ui/components";
import { FONTS, SPRINGS } from "client/ui/constants";
import { HOTBAR_SIZE, SLOT_SIZE } from "../constants";
import { InventorySlot } from "../slot";
import { ItemKind, isTowerItemId } from "shared/inventory/types";
import { Latte, Macchiato, Mocha } from "@rbxts/catppuccin";
import { LevelUtility } from "shared/profile/utility";
import { MAXIMUM_EQUIPPED } from "shared/inventory/constants";
import { PlayerUtility } from "shared/player/utility";
import { Players } from "@rbxts/services";
import { itemDefinitions } from "shared/inventory/items";
import { selectCurrency } from "shared/game/selectors";
import { selectProfileData } from "client/profile/selectors";
import { truncateNumber } from "shared/utility/truncate-number";
import { useAbbreviation, useMotion, usePx, useStore } from "client/ui/hooks";
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

	const currencyText = useAbbreviation(currency);
	const experienceText = useAbbreviation(experience);
	const maxExperienceText = useAbbreviation(max);

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
				size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(HOTBAR_SIZE.Y) + px(4))}
				anchorPoint={new Vector2(0.5, 1)}
				position={UDim2.fromScale(0.5, 1)}
				groupTransparency={transparency}
				key={"hotbar-transition"}
			>
				<Frame
					key={"hotbar-group"}
					size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(HOTBAR_SIZE.Y) + px(4))}
					anchorPoint={new Vector2(0.5, 1)}
					position={UDim2.fromScale(0.5, 1)}
				>
					<Frame
						key={"item-group"}
						size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(SLOT_SIZE.Y))}
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
						size={UDim2.fromOffset(px(HOTBAR_SIZE.X), px(10))}
						// backgroundColor={Darken(Mocha.Mauve, 0.75)}
						cornerRadius={new UDim(0, px(5))}
						anchorPoint={new Vector2(0.5, 1)}
						position={UDim2.fromScale(0.5, 1)}
					>
						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Thickness={px(1)}
							key={"level-outline"}
						/>
						<Frame
							key={"level-bar"}
							size={UDim2.fromScale(math.min(experience / max, 1), 1)}
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(0, 0.5)}
							backgroundColor={Mocha.Base}
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
						size={UDim2.fromOffset(px(10), px(10))}
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
				</Frame>
			</Transition>
		</DelayRender>
	);
}
