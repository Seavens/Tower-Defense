import { BILLBOARD_SIZE } from "./constants";
import { ColorUtil } from "../utility";
import { FONTS, PALETTE } from "../constants";
import { Frame, Text } from "../components";
import { MobUtility } from "shared/mob/utility";
import { Mocha } from "@rbxts/catppuccin";
import { getSizeFactor } from "../inventory/utility";
import { mobDefinitions } from "shared/mob/definitions";
import { selectCurrentWave, selectGameData } from "shared/game/selectors";
import { store } from "client/state/store";
import { useAbbreviation, useDarkenedColor } from "../hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { MobId } from "shared/mob/types";

interface MobHealthbarProps {
	id: MobId;
	health: number;
}

export function MobHealthbar({ id, health }: MobHealthbarProps): Element {
	const wave = useSelector(selectCurrentWave);
	const max = useMemo((): number => {
		const health = MobUtility.getMobHealth(id, wave);
		return health;
	}, [id, wave]);

	const healthText = useAbbreviation(math.ceil(health));
	const maxText = useAbbreviation(max);

	return (
		<Frame
			size={UDim2.fromScale(1, 1)}
			anchorPoint={Vector2.one.mul(0.5)}
			cornerRadius={new UDim(0, 2)}
			position={UDim2.fromScale(0.5, 0.5)}
			backgroundTransparency={1}
			key={"mob-frame"}
		>
			<Frame
				size={UDim2.fromScale(1, 1)}
				anchorPoint={new Vector2(0.5, 1)}
				position={UDim2.fromScale(0.5, 1)}
				backgroundColor={ColorUtil.darken(PALETTE.red, 0.25)}
				cornerRadius={new UDim(2)}
				key={"health-frame"}
			>
				<uistroke Color={Mocha.Base} Thickness={2} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<Text
					size={UDim2.fromScale(1, 0.8)}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
					cornerRadius={new UDim(0, 2)}
					backgroundTransparency={1}
					font={FONTS.inter.bold}
					textScaled={true}
					textColor={PALETTE.white}
					strokeColor={PALETTE.black}
					strokeTransparency={0}
					text={`${healthText}/${maxText}`}
					zIndex={2}
				/>
				<Frame
					size={UDim2.fromScale(health / max, getSizeFactor(health, max, 15))}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0, 0.5)}
					backgroundColor={PALETTE.green}
					cornerRadius={new UDim(2)}
					key={"current-health-frame"}
					zIndex={1}
				/>
			</Frame>
		</Frame>
	);
}
