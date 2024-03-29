import { Button, DelayRender, DropDown, Frame, Group, Image, Text, Transition } from "../components";
import { Darken, Lighten } from "@rbxts/colour-utils";
import { FONTS, PALETTE, SPRINGS } from "../constants";
import {
	INVENTORY_COLUMN_COUNT,
	INVENTORY_SIZE,
	ITEM_SLOT_SIZE,
	RARITY_ORDERS,
	TOWER_SIZE,
	TRANSPARENCY_GRADIENT,
} from "./constants";
import { ItemFiltering } from "shared/inventory/types";
import { ItemKind } from "shared/inventory/types";
import { ItemSlot } from "./item-slot";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { MAXIMUM_TOWER_LEVEL } from "shared/tower/constants";
import { TextField } from "../components/text-field";
import { formatStats, useItemDefinition, useRarityDefinition } from "./utils";
import { idToName } from "shared/utils/id-to-name";
import { itemDefinitions } from "shared/inventory/items";
import { map, useAsync } from "@rbxts/pretty-react-hooks";
import { selectInventoryData } from "client/inventory/selectors";
import { selectProfileData } from "client/profile/selectors";
import { useButtonAnimation } from "../hooks/use-button-animation";
import { useButtonState } from "../hooks/use-button-state";
import { useMotion, usePx } from "../hooks";
import { useSelector } from "@rbxts/react-reflex";
import Abbreviator from "@rbxts/abbreviate";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { Item, ItemId } from "shared/inventory/types";

interface TowerProps {
	onClick?: (id: ItemId) => void;
}

const BACKGROUND = Mocha.Base;
const OUTLINE = Darken(BACKGROUND, 0.25);
const BACKGROUND_LIGHT = Lighten(Mocha.Base, 0.1);
const THICKNESS = 4;
const TEXTCOLOR = Latte.Base;

export function Tower(): Element {
	const px = usePx();
	const abbreviator = new Abbreviator();

	return (
		<Group
			size={UDim2.fromOffset(px(TOWER_SIZE.X), px(TOWER_SIZE.Y))}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			key={"tower-group"}
		>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={BACKGROUND}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				cornerRadius={new UDim(0, 12)}
				key={"tower-frame"}
			>
				<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<Frame
					size={UDim2.fromOffset(px(200), px(200))}
					cornerRadius={new UDim(0, 12)}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0.025, 0.5)}
				>
					<uistroke Color={OUTLINE} Thickness={THICKNESS} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				</Frame>
			</Frame>
		</Group>
	);
}
