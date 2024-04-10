import { FONTS, PALETTE } from "client/ui/constants";
import { Frame, Group, Image, Text } from "client/ui/components";
import { TowerUtility } from "shared/tower/utility";
import { useAbbreviation } from "client/ui/hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ReplicatedTower } from "shared/tower/types";

interface TowerBillboardProps {
	replicatedTower: ReplicatedTower;
}

export function TowerBillboard({ replicatedTower }: TowerBillboardProps): Element {
	const { owner } = replicatedTower;
	const cooldown = TowerUtility.getTotalCooldown(replicatedTower);
	const damage = TowerUtility.getTotalDamage(replicatedTower);
	const range = TowerUtility.getTotalRange(replicatedTower);

	const damageText = useAbbreviation(damage);
	const rangeText = useAbbreviation(range);
	const cooldownText = useAbbreviation(cooldown);

	return (
		<Group
			size={UDim2.fromScale(1, 1)}
			anchorPoint={Vector2.one.mul(0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			key={"tower-frame"}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 3)}
			/>
			<Text
				text={owner}
				size={UDim2.fromScale(1, 0.4)}
				textScaled={true}
				font={FONTS.inter.bold}
				textColor={PALETTE.white}
				strokeColor={PALETTE.black}
				strokeTransparency={0}
			/>
			<Group size={UDim2.fromScale(1, 0.6)}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, 2)}
				/>
				<Frame
					size={UDim2.fromScale(0.3, 1)}
					cornerRadius={new UDim(0, 8)}
					backgroundColor={PALETTE.red}
					key={"damage-frame"}
				>
					<uigradient
						key={"damage-gradient"}
						Rotation={-90}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, PALETTE.dark_red),
								new ColorSequenceKeypoint(1, PALETTE.red),
							])
						}
					/>
					<Image
						size={UDim2.fromScale(0.4, 0.9)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0, 0.5)}
						image={"rbxassetid://17075279045"}
						scaleType={"Fit"}
						key={"damage-image"}
					/>
					<Text
						size={UDim2.fromScale(0.55, 0.8)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0.4, 0.5)}
						font={FONTS.inter.bold}
						textScaled={true}
						textXAlignment="Center"
						textColor={PALETTE.white}
						strokeColor={PALETTE.black}
						strokeTransparency={0}
						text={`${damageText}`}
						key={"damage-text"}
					/>
				</Frame>
				<Frame
					size={UDim2.fromScale(0.3, 1)}
					cornerRadius={new UDim(0, 8)}
					backgroundColor={PALETTE.green}
					key={"range-frame"}
				>
					<uigradient
						key={"damage-gradient"}
						Rotation={-90}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, PALETTE.dark_green),
								new ColorSequenceKeypoint(1, PALETTE.green),
							])
						}
					/>
					<Image
						size={UDim2.fromScale(0.4, 0.9)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0, 0.5)}
						image={"rbxassetid://17075536071"}
						scaleType={"Fit"}
						key={"range-image"}
					/>
					<Text
						size={UDim2.fromScale(0.55, 0.8)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0.4, 0.5)}
						font={FONTS.inter.bold}
						textScaled={true}
						textXAlignment="Center"
						textColor={PALETTE.white}
						strokeColor={PALETTE.black}
						strokeTransparency={0}
						text={`${rangeText}`}
						key={"damage-text"}
					/>
				</Frame>
				<Frame
					size={UDim2.fromScale(0.3, 1)}
					cornerRadius={new UDim(0, 8)}
					backgroundColor={PALETTE.blue}
					key={"cooldown-frame"}
				>
					<uigradient
						key={"damage-gradient"}
						Rotation={-90}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, PALETTE.dark_blue),
								new ColorSequenceKeypoint(1, PALETTE.blue),
							])
						}
					/>
					<Image
						size={UDim2.fromScale(0.4, 0.9)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0, 0.5)}
						image={"rbxassetid://17075279299"}
						scaleType={"Fit"}
						key={"cooldown-image"}
					/>
					<Text
						size={UDim2.fromScale(0.55, 0.8)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0.4, 0.5)}
						font={FONTS.inter.bold}
						textScaled={true}
						textXAlignment="Center"
						textColor={PALETTE.white}
						strokeColor={PALETTE.black}
						strokeTransparency={0}
						text={`${cooldownText}`}
						key={"cooldown-text"}
					/>
				</Frame>
			</Group>
		</Group>
	);
}
