import { FONTS, PALETTE } from "client/ui/constants";
import { Frame, Group, Image, Text } from "client/ui/components";
import { Mocha } from "@rbxts/catppuccin";
import { Players } from "@rbxts/services";
import { useAbbreviation } from "client/ui/hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";

interface TowerBillboardProps {
	owner: string;
	unique: ItemTowerUnique;
}

export function TowerBillboard({ owner, unique }: TowerBillboardProps): Element {
	const { damage, range, cooldown } = unique;

	const abb = useAbbreviation;
	const damageText = abb(damage);
	const rangeText = abb(range);
	const cooldownText = abb(cooldown);

	return (
		<Group
			size={UDim2.fromOffset(225, 50)}
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
					Padding={new UDim(0, 3)}
				/>
				<Frame
					size={UDim2.fromScale(0.33, 1)}
					cornerRadius={new UDim(0, 8)}
					backgroundColor={PALETTE.red}
					key={"damage-frame"}
				>
					<uistroke Thickness={1} Transparency={0.5} Color={PALETTE.dark_red} />
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
					<Text
						size={UDim2.fromScale(0.5, 0.78)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0.4, 0.5)}
						font={FONTS.inter.bold}
						textScaled={true}
						textXAlignment="Left"
						textColor={PALETTE.white}
						strokeColor={PALETTE.black}
						strokeTransparency={0}
						text={`${damageText}`}
						key={"damage-text"}
					/>
					<Image
						size={UDim2.fromScale(0.8, 0.8)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0.05, 0.5)}
						image={"rbxassetid://17075279045"}
						key={"damage-image"}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</Image>
				</Frame>
				<Frame
					size={UDim2.fromScale(0.33, 1)}
					cornerRadius={new UDim(0, 8)}
					backgroundColor={PALETTE.green}
					key={"range-frame"}
				>
					<uistroke Thickness={1} Transparency={0.5} Color={PALETTE.dark_green} />
					<uigradient
						key={"range-gradient"}
						Rotation={-90}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, PALETTE.dark_green),
								new ColorSequenceKeypoint(1, PALETTE.green),
							])
						}
					/>
					<Text
						size={UDim2.fromScale(0.5, 0.78)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0.4, 0.5)}
						font={FONTS.inter.bold}
						textScaled={true}
						textXAlignment="Left"
						textColor={PALETTE.white}
						strokeColor={PALETTE.black}
						strokeTransparency={0}
						text={`${rangeText}`}
						key={"range-text"}
					/>
					<Image
						size={UDim2.fromScale(0.8, 0.8)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0.05, 0.5)}
						image={"rbxassetid://17075536071"}
						key={"range-image"}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</Image>
				</Frame>
				<Frame
					size={UDim2.fromScale(0.33, 1)}
					cornerRadius={new UDim(0, 8)}
					backgroundColor={PALETTE.blue}
					key={"cooldown-frame"}
				>
					<uistroke Thickness={1} Transparency={0.5} Color={PALETTE.dark_blue} />
					<uigradient
						key={"cooldown-gradient"}
						Rotation={-90}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, PALETTE.dark_blue),
								new ColorSequenceKeypoint(1, PALETTE.blue),
							])
						}
					/>
					<Text
						size={UDim2.fromScale(0.5, 0.78)}
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(0.4, 0.5)}
						font={FONTS.inter.bold}
						textScaled={true}
						textXAlignment="Left"
						textColor={PALETTE.white}
						strokeColor={PALETTE.black}
						strokeTransparency={0}
						text={`${cooldownText}s`}
						key={"cooldown-text"}
					/>
					<Image
						size={UDim2.fromScale(0.8, 0.8)}
						anchorPoint={new Vector2(0, 0.52)}
						position={UDim2.fromScale(0.05, 0.5)}
						image={"rbxassetid://17075279299"}
						key={"cooldown-image"}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</Image>
				</Frame>
			</Group>
		</Group>
	);
}
