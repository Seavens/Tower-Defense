import { BILLBOARD_SIZE } from "./constants";
import { FONTS, PALETTE } from "../constants";
import { Frame, Outline, Text } from "../components";
import { Mocha } from "@rbxts/catppuccin";
import { getSizeFactor } from "../inventory/utility";
import { mobDefinitions } from "shared/mob/mobs";
import { useAbbreviation, usePx } from "../hooks";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { MobId } from "shared/mob/types";

interface MobHealthbarProps {
	id: MobId;
	health: number;
}

export function MobHealthbar({ id, health }: MobHealthbarProps): Element {
	const px = usePx();

	const max = useMemo((): number => {
		const { health } = mobDefinitions[id];
		return health;
	}, [id]);

	const healthText = useAbbreviation(math.ceil(health));
	const maxText = useAbbreviation(max);

	return (
		<Frame
			size={UDim2.fromOffset(px(BILLBOARD_SIZE.X), px(BILLBOARD_SIZE.Y))}
			anchorPoint={Vector2.one.mul(0.5)}
			cornerRadius={new UDim(0, px(2))}
			position={UDim2.fromScale(0.5, 0.5)}
			backgroundTransparency={1}
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
					cornerRadius={new UDim(0, px(2))}
					backgroundTransparency={1}
					textSize={px(52)}
					font={FONTS.inter.bold}
					textColor={PALETTE.white}
					strokeColor={PALETTE.black}
					strokeTransparency={0}
					text={`${healthText}/${maxText}`}
					zIndex={2}
				/>
				<Frame
					size={UDim2.fromScale(health / max, getSizeFactor(health, max, px(2)))}
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
