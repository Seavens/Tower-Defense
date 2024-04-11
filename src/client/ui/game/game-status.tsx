import { BILLBOARD_SIZE } from "./constants";
import { FONTS, PALETTE } from "../constants";
import { Frame, Group, Text } from "../components";
import { GameStatus } from "shared/game/types";
import { INTERMISSION_TIME } from "shared/game/constants";
import { MapId } from "shared/map/types";
import { Mocha } from "@rbxts/catppuccin";
import { getSizeFactor } from "../inventory/utility";
import { mapDefinitions } from "shared/map/definitions";
import { selectGameData, selectGameStatus } from "shared/game/selectors";
import { useAbbreviation, useDarkenedColor, usePx } from "../hooks";
import { useLifetime, usePrevious } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import type { AnyMapDefinition } from "shared/map/definitions";
import type { Element } from "@rbxts/react";

interface GameStatusUIProps {
	health: number;
	wave: number;
	map: MapId;
	status: GameStatus;
}

export function GameStatusUI({ health, wave, map, status }: GameStatusUIProps): Element {
	const px = usePx();

	const definition = useMemo((): AnyMapDefinition => {
		if (map === undefined) {
			mapDefinitions[MapId.Test];
		}
		return mapDefinitions[map];
	}, [map]);
	const { waves } = definition;

	const max = useMemo((): number => {
		const { baseHealth } = definition;
		return baseHealth;
	}, [definition]);

	const healthText = useAbbreviation(math.ceil(health));
	const maxText = useAbbreviation(max);

	// const status = useSelector(selectGameStatus);
	const [timestamp, setTimestamp] = useState(0);
	const lifetime = useLifetime([timestamp]);

	useEffect(() => {
		if (status === GameStatus.Waiting) {
			// Start countdown
			warn("countdown");
			setTimestamp(os.clock() + INTERMISSION_TIME);
		} else {
			setTimestamp(0);
		}
		// UWU OMG THIS IS SO FREAKING EPIC!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// const {} = useSelector(selectGameData);
		// return countdown;
	}, [status]);

	return (
		<Group
			size={UDim2.fromOffset(px(BILLBOARD_SIZE.X), px(BILLBOARD_SIZE.Y))}
			anchorPoint={new Vector2(0.5, 0)}
			position={UDim2.fromScale(0.5, 0.025)}
			key={"game-status"}
		>
			<Frame
				size={UDim2.fromScale(1, 0.35)}
				anchorPoint={new Vector2(0.5, 0)}
				position={UDim2.fromScale(0.5, 0)}
				cornerRadius={new UDim(0, px(8))}
				key={"health-frame"}
			>
				<uistroke Color={Mocha.Base} Thickness={2} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, PALETTE.dark_red),
							new ColorSequenceKeypoint(1, PALETTE.red),
						])
					}
				/>
				<Text
					size={UDim2.fromScale(0.25, 1)}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0.01, 0.5)}
					font={FONTS.inter.bold}
					textSize={px(26)}
					textXAlignment="Left"
					textColor={PALETTE.white}
					strokeColor={PALETTE.black}
					strokeTransparency={0}
					text={`${healthText}/${maxText}`}
					zIndex={2}
				/>
				<Frame
					size={UDim2.fromScale(health / max, getSizeFactor(health, max, 2))}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0, 0.5)}
					backgroundColor={PALETTE.green}
					cornerRadius={new UDim(0, px(8))}
					key={"current-health-frame"}
					zIndex={1}
				>
					<uigradient
						Rotation={-90}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, PALETTE.dark_green),
								new ColorSequenceKeypoint(1, PALETTE.green),
							])
						}
					/>
				</Frame>
			</Frame>
			<Text
				size={UDim2.fromOffset(px(150), px(25))}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.6)}
				font={FONTS.inter.bold}
				textColor={PALETTE.accent}
				strokeColor={PALETTE.black}
				strokeTransparency={0}
				text={`Wave: ${wave}/${waves.size()}`}
				textXAlignment="Left"
				textSize={px(30)}
			/>
			{status === GameStatus.Waiting && (
				<Text
					size={UDim2.fromOffset(px(70), px(50))}
					anchorPoint={new Vector2(0.5, 1)}
					position={UDim2.fromScale(0.5, 1.5)}
					cornerRadius={new UDim(0, px(4))}
					font={FONTS.inter.bold}
					textColor={PALETTE.accent}
					strokeColor={PALETTE.black}
					strokeTransparency={0}
					text={lifetime.map((value: number): string =>
						string.format(
							"%.1f",
							math.abs(
								math.clamp(math.round((INTERMISSION_TIME - value) * 10) / 10, 0, INTERMISSION_TIME),
							),
						),
					)}
					textXAlignment="Center"
					textSize={px(40)}
					backgroundColor={useDarkenedColor(PALETTE.black, 0.5)}
					backgroundTransparency={0.5}
				/>
			)}
		</Group>
	);
}
