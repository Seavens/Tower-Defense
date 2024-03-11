import { Fragment } from "@rbxts/react";
import { ItemSlot } from "./item-slot";
import { LevelFunctions } from "shared/functions/level-functions";
import { TowerId } from "shared/types/ids";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { InventoryData } from "shared/types/data";
import type { ProfileData } from "shared/types/data";
import type { Tower } from "shared/types/objects";

interface HotbarProps {
	inventoryData: InventoryData;
	playerData: ProfileData;
}

export function Hotbar(props: HotbarProps): Element {
	const { inventoryData } = props;
	const { stored, equipped } = inventoryData;
	const { level, experience, coins } = props.playerData;
	const maxExp = LevelFunctions.getMaxExp(level);
	const expSize = experience / maxExp;
	return (
		<frame
			key={"Hotbar Invisiable Frame"}
			Size={new UDim2(0.5, 0, 0.18, 0)}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={new UDim2(0.5, 0, 0.995, 0)}
			BorderSizePixel={0}
			Transparency={1}
		>
			<uiaspectratioconstraint AspectRatio={4.5} />
			<frame
				key={"Grid Frame"}
				Size={new UDim2(1, 0, 0.8, 0)}
				Position={new UDim2(0.5, 0, 0, 0)}
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
				<Fragment>
					{...equipped.map((tower: Tower, index: number): Element => {
						return <ItemSlot tower={tower} key={`${index}`} />;
					})}
				</Fragment>
				{/* <ItemSlot towerData={eq} />
				<ItemSlot towerData={tower2} />
				<ItemSlot towerData={tower3} />
				<ItemSlot towerData={tower4} />
				<ItemSlot towerData={tower5} />
				<ItemSlot towerData={tower6} /> */}
			</frame>
			<frame
				key={"Level Frame"}
				Size={new UDim2(1, 0, 0.28, 0)}
				Position={new UDim2(0.5, 0, 1, 0)}
				AnchorPoint={new Vector2(0.5, 1)}
				BorderSizePixel={0}
				Transparency={1}
			>
				<frame
					key={"Level Bar Outline"}
					Size={new UDim2(1, 0, 0.55, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BorderSizePixel={0}
					BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
					ZIndex={0}
				>
					<imagelabel
						key={"Level Bar Inline"}
						Size={new UDim2(0.989, 0, 0.7, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BorderSizePixel={0}
						BackgroundColor3={new Color3(0.44, 0.2, 0.2)}
						Image={`rbxassetid://12790545456`}
						ImageTransparency={0.5}
						ZIndex={1}
					>
						<frame
							key={"Level Bar"}
							Size={new UDim2(expSize, 0, 1, 0)}
							Position={new UDim2(0, 0, 0, 0)}
							AnchorPoint={new Vector2(0, 0)}
							BorderSizePixel={0}
							BackgroundColor3={new Color3(0.25, 0.3, 0.51)}
							ZIndex={1}
						>
							<uicorner CornerRadius={new UDim(0.25, 0)} />
						</frame>
					</imagelabel>
					<textbox
						key={"Level Text"}
						Size={new UDim2(1, 0, 0.6, 0)}
						Position={new UDim2(0.015, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0, 0.5)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
						TextScaled={true}
						Font={Enum.Font.GothamMedium}
						Text={`${experience}/${maxExp}`}
						ZIndex={2}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
				</frame>
				<frame
					key={"Level Bar"}
					Size={new UDim2(0.005, 0, 0.6, 0)}
					Position={new UDim2(expSize, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={0}
					BorderSizePixel={2}
					BackgroundColor3={new Color3(0.4, 0.4, 0.61)}
					ZIndex={1}
				/>
			</frame>
			<imagelabel
				key={"Side Box L"}
				Size={new UDim2(0.19, 0, 0.19, 0)}
				Position={new UDim2(0.003, 0, 0.86, 0)}
				AnchorPoint={new Vector2(0.35, 0.5)}
				BorderSizePixel={3}
				BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
				BorderColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={0}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uiaspectratioconstraint AspectRatio={0.5} />
			</imagelabel>
			<imagelabel
				key={"Side Box R"}
				Size={new UDim2(0.19, 0, 0.19, 0)}
				Position={new UDim2(0.992, 0, 0.86, 0)}
				AnchorPoint={new Vector2(0.35, 0.5)}
				BorderSizePixel={3}
				BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
				BorderColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={0}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uiaspectratioconstraint AspectRatio={0.5} />
			</imagelabel>
			<imagelabel
				key={"Level Box"}
				Size={new UDim2(0.275, 0, 0.275, 0)}
				Position={new UDim2(0.5, 0, 0.86, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={5}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<imagelabel
					key={"Level Box"}
					Size={new UDim2(0.85, 0, 0.85, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
					ZIndex={5}
					Image={`rbxassetid://12790545456`}
					ImageTransparency={0.5}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(0.5, 0)} />

					<textbox
						key={"Level Text"}
						Size={new UDim2(0.85, 0, 0.85, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
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
		</frame>
	);
}
