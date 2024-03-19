import { Frame, Group } from "../pretty-components";
import { ITEM_SLOT_SIZE } from "../../constants/inventory-ui";
import { RarityDefinitions } from "shared/definitions/rarities";
import { TowerDefinitions } from "shared/definitions/towers";
import { brightness, darken } from "shared/utils/color-utils";
import { fonts } from "client/app/constants/fonts";
import { palette } from "client/app/utils/palette";
import { usePx } from "../../hooks";
import React, { useMemo } from "@rbxts/react";
import type { AnyRarityDefinition } from "shared/definitions/rarities";
import type { AnyTowerDefinition } from "shared/definitions/towers";
import type { Element } from "@rbxts/react";
import type { TowerObject } from "shared/types/objects";

export interface ItemSlotProps extends Partial<TowerObject> {
	onClick?: (uuid: string) => void;
}

export function ItemSlot({ id, uuid, onClick }: ItemSlotProps): Element {
	const px = usePx();

	const definition = useMemo((): AnyTowerDefinition | undefined => {
		if (id === undefined) {
			return undefined;
		}
		return TowerDefinitions[id];
	}, [id]);
	const rarity = useMemo((): AnyRarityDefinition | undefined => {
		if (definition === undefined) {
			return undefined;
		}
		const { rarity } = definition;
		return RarityDefinitions[rarity];
	}, [definition]);

	const cost = definition?.cost ?? 0;
	const color = rarity?.color ?? palette.white;

	return (
		<Frame
			size={UDim2.fromOffset(px(ITEM_SLOT_SIZE.X), px(ITEM_SLOT_SIZE.Y))}
			anchorPoint={Vector2.one.mul(0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			backgroundColor={color}
			backgroundTransparency={0.65}
			clipsDescendants={true}
			key={"item-slot"}
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
								if (uuid === undefined) {
									return;
								}
								onClick?.(uuid);
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
						TextColor3={brightness(color) >= 0.235 ? palette.white : palette.black}
						Text={definition === undefined ? "" : `$${cost}`}
						TextSize={px(10)}
						FontFace={fonts.inter.bold}
						key={"tower-cost"}
					>
						<uistroke
							LineJoinMode={Enum.LineJoinMode.Round}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
							Color={brightness(color) < 0.235 ? palette.white : palette.black}
							Transparency={0.25}
							Thickness={2}
							key={"text-stroke"}
						/>
					</textlabel>
					<uicorner CornerRadius={new UDim(0, px(5))} key={"lower-corner"} />
				</Frame>
			</Group>
			<uistroke
				Color={palette.white}
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Thickness={1}
				key={"slot-outline"}
			/>
			<uicorner CornerRadius={new UDim(0, px(5))} key={"slot-corner"} />
		</Frame>
	);
}
