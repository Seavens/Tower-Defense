import { BILLBOARD_SIZE } from "./constants";
import { FONTS, PALETTE } from "../constants";
import { Frame, Group, Text } from "../components";
import { MapId } from "shared/map/types";
import { Mocha } from "@rbxts/catppuccin";
import { getSizeFactor } from "../inventory/utility";
import { mapDefinitions } from "shared/map/definitions";
import { useAbbreviation, useDarkenedColor, usePx } from "../hooks";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface GameStatusUIProps {
	health: number;
	wave: number;
	mapId: MapId;
}

export function GameStatusUI({ health, wave, mapId }: GameStatusUIProps): Element {
	const px = usePx();

	const mapDef = useMemo(() => (mapId === undefined ? mapDefinitions[MapId.Test] : mapDefinitions[mapId]), [mapId]);
	const { waves } = mapDef;
	const max = useMemo((): number => {
		const { baseHealth } = mapDefinitions[mapId];
		return baseHealth;
	}, [mapId]);

	const healthText = useAbbreviation(math.ceil(health));
	const maxText = useAbbreviation(max);

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
		</Group>
	);
}
