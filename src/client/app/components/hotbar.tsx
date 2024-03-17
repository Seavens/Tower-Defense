import { ItemSlot } from "./item-slot";
import { LevelFunctions } from "shared/functions/level-functions";
import { MAXIMUM_EQUIPPED } from "shared/constants/inventory-constants";
import { brighten } from "client/app/utils/color-utils";
import { formatNumber } from "../utils/math-utils";
import { palette } from "client/app/utils/palette";
import { selectInventoryData, selectProfileData } from "client/state/selectors";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface HotbarProps {}

export function Hotbar(props: HotbarProps): Element {
	const { equipped } = useSelector(selectInventoryData);
	const { coins, experience, gems, level } = useSelector(selectProfileData);

	const max = useMemo((): number => {
		return LevelFunctions.getMaxExp(level);
	}, [level]);

	const texture = "rbxassetid://12790545456";

	const elements = useMemo(() => {
		const elements: Array<Element> = [];
		for (const index of $range(1, MAXIMUM_EQUIPPED)) {
			const slot = `${index}`;
			const tower = equipped.get(slot);
			elements.push(<ItemSlot {...tower} />);
		}
		return elements;
	}, [equipped]);

	return (
		<frame
			key={"Hotbar Main Frame"}
			Size={UDim2.fromOffset(900, 200)}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={UDim2.fromScale(0.5, 0.99)}
			BorderSizePixel={0}
			Transparency={1}
		>
			<frame
				key={"Equipped Frame"}
				Size={UDim2.fromScale(1, 0.8)}
				Position={UDim2.fromScale(0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				BorderSizePixel={0}
				Transparency={1}
			>
				<uilistlayout
					key={"Hotbar GridLayout"}
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0.005, 0)}
				/>
				{elements}
			</frame>
			<frame
				key={"Level Frame"}
				Size={UDim2.fromScale(1, 0.28)}
				Position={UDim2.fromScale(0.5, 1)}
				AnchorPoint={new Vector2(0.5, 1)}
				BorderSizePixel={0}
				Transparency={1}
			>
				<frame
					key={"Level Bar Outline"}
					Size={UDim2.fromScale(1, 0.55)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BorderSizePixel={0}
					BackgroundColor3={brighten(palette.purple, -0.5)}
					ZIndex={0}
				>
					<uicorner CornerRadius={new UDim(0.5, 0)} />
					<imagelabel
						key={"Level Bar Inline"}
						Size={UDim2.fromScale(0.989, 0.7)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BorderSizePixel={0}
						BackgroundColor3={brighten(palette.purple, -0.5)}
						Image={texture}
						ImageTransparency={0.5}
						ZIndex={1}
					>
						<uicorner CornerRadius={new UDim(0.5, 0)} />
						<frame
							key={"Level Bar"}
							Size={UDim2.fromScale(math.min(experience / max, 1), 1)}
							Position={UDim2.fromScale(0, 0)}
							AnchorPoint={new Vector2(0, 0)}
							BorderSizePixel={0}
							BackgroundColor3={palette.purple}
							ZIndex={1}
						>
							<uicorner CornerRadius={new UDim(0.5, 0)} />
						</frame>
					</imagelabel>
					<textlabel
						key={"Level Text"}
						Size={UDim2.fromScale(1, 0.6)}
						Position={UDim2.fromScale(0.015, 0.5)}
						AnchorPoint={new Vector2(0, 0.5)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
						TextScaled={true}
						Font={Enum.Font.GothamMedium}
						Text={`${formatNumber(experience)}/${formatNumber(max)}`}
						ZIndex={2}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
				</frame>
			</frame>
			<imagelabel
				key={"Level Box"}
				Size={UDim2.fromScale(0.275, 0.275)}
				Position={UDim2.fromScale(0.5, 0.86)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={5}
				Image={texture}
				ImageTransparency={0.5}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<imagelabel
					key={"Level Box"}
					Size={UDim2.fromScale(0.85, 0.85)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
					ZIndex={5}
					Image={texture}
					ImageTransparency={0.5}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(0.5, 0)} />

					<textlabel
						key={"Level Text"}
						Size={UDim2.fromScale(0.85, 0.85)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
						TextScaled={true}
						Font={Enum.Font.GothamMedium}
						Text={`${level}`}
						TextStrokeColor3={new Color3(0, 0, 0)}
						TextStrokeTransparency={0.5}
					/>
				</imagelabel>
			</imagelabel>
			<textlabel
				key={"Coins Text"}
				Size={UDim2.fromScale(0.25, 0.15)}
				Position={UDim2.fromScale(0.25, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				Font={Enum.Font.GothamMedium}
				Text={`Coins: ${formatNumber(coins)}`}
				TextStrokeColor3={new Color3(0, 0, 0)}
				TextStrokeTransparency={0.5}
			/>
			<textlabel
				key={"Gems Text"}
				Size={UDim2.fromScale(0.25, 0.15)}
				Position={UDim2.fromScale(0.75, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				Font={Enum.Font.GothamMedium}
				Text={`Gems: ${formatNumber(gems)}`}
				TextStrokeColor3={new Color3(0, 0, 0)}
				TextStrokeTransparency={0.5}
			/>
			<imagelabel
				key={"Inventory Button Outter Frame"}
				Size={UDim2.fromScale(0.2, 0.4)}
				Position={UDim2.fromScale(1.125, 0.4)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BorderSizePixel={0}
				BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
				Image={texture}
				ImageTransparency={0.5}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<imagebutton
					key={"Inventory Button Inner Frame"}
					Size={UDim2.fromScale(0.9, 0.8)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BorderSizePixel={0}
					BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
					Image={texture}
					ImageTransparency={0.5}
					Event={{
						MouseButton1Click: () => {
							warn("Inventory Button Clicked");
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<textlabel
						key={"Inventory Button Text"}
						Size={UDim2.fromScale(0.85, 0.85)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
						TextScaled={true}
						Font={Enum.Font.GothamMedium}
						Text={`Inventory`}
						TextStrokeColor3={new Color3(0, 0, 0)}
						TextStrokeTransparency={0.5}
					/>
				</imagebutton>
			</imagelabel>
		</frame>
	);
}
