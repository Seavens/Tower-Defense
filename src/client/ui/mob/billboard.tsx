import { BILLBOARD_SIZE } from "./constants";
import { FONTS, PALETTE } from "../constants";
import { Frame, Outline, Text } from "../components";
import { Mocha } from "@rbxts/catppuccin";
import { getSizeFactor } from "../inventory/utility";
import { mobDefinitions } from "shared/mob/mobs";
import { usePx } from "../hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { MobId } from "shared/mob/types";

interface MobBillboardProps {
	mobId: MobId;
	currentHealth: number;

	//uuid: UUID;
}

export function MobBillboard({ mobId, currentHealth }: MobBillboardProps): Element {
	const px = usePx();

	const mobDef = mobDefinitions[mobId];
	const { health } = mobDef;

	return (
		<Frame
			size={UDim2.fromOffset(px(BILLBOARD_SIZE.X), px(BILLBOARD_SIZE.Y))}
			anchorPoint={Vector2.one.mul(0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			backgroundTransparency={0.8}
			key={"mob-frame"}
		>
			<Frame
				size={UDim2.fromScale(1, 1)}
				anchorPoint={new Vector2(0.5, 1)}
				position={UDim2.fromScale(0.5, 1)}
				backgroundColor={PALETTE.red}
				backgroundTransparency={0.15}
				cornerRadius={new UDim(px(2))}
				key={"health-frame"}
			>
				<uistroke Color={Mocha.Base} Thickness={px(2)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<Text
					size={UDim2.fromScale(1, 1)}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
					textSize={px(52)}
					font={FONTS.inter.bold}
					textColor={PALETTE.white}
					strokeColor={PALETTE.black}
					strokeTransparency={0}
					text={`${currentHealth} / ${health}`}
					zIndex={2}
				/>
				<Frame
					size={UDim2.fromScale(currentHealth / health, getSizeFactor(currentHealth, health, px(2)))}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0, 0.5)}
					backgroundColor={PALETTE.green}
					backgroundTransparency={0.15}
					cornerRadius={new UDim(px(2))}
					key={"current-health-frame"}
					zIndex={1}
				/>
			</Frame>
		</Frame>
	);
}
