import { Corner } from "./corner";
import { Dictionary } from "@rbxts/sift";
import { Events } from "client/network";
import { Fragment } from "@rbxts/react";
import { ItemSlot } from "./item-slot";
import { LevelFunctions } from "shared/functions/level-functions";
import { useMouse } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { InventoryData } from "shared/types/data";
import type { ProfileData } from "shared/types/data";
import type { Tower } from "shared/types/objects";

interface HotbarProps {
	inventoryData: InventoryData;
	profileData: ProfileData;
}

export function Hotbar(props: HotbarProps): Element {
	const { inventoryData } = props;
	const { stored, equipped } = inventoryData;
	const { level, experience, coins, gems } = props.profileData;
	const maxExp = LevelFunctions.getMaxExp(level);
	const expSize = experience / maxExp;
	return (
		<frame
			key={"Hotbar Invisiable Frame"}
			Size={UDim2.fromScale(0.5, 0.18)}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={UDim2.fromScale(0.5, 0.995)}
			BorderSizePixel={0}
			Transparency={1}
		>
			<uiaspectratioconstraint AspectRatio={4.5} />
			<frame
				key={"Grid Frame"}
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
				{Dictionary.map<Record<string, Tower>, string, Element>(
					equipped as never, // This is required because of how `Sift.Dictionary.map` types work.
					(tower: Tower, key: string): Element => {
						warn(`Tower: ${tower.id}, Key: ${key}`);
						return <ItemSlot tower={tower} key={key} />;
					},
				)}
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
					BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
					ZIndex={0}
				>
					<imagelabel
						key={"Level Bar Inline"}
						Size={UDim2.fromScale(0.989, 0.7)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BorderSizePixel={0}
						BackgroundColor3={new Color3(0.44, 0.2, 0.2)}
						Image={`rbxassetid://12790545456`}
						ImageTransparency={0.5}
						ZIndex={1}
					>
						<frame
							key={"Level Bar"}
							Size={UDim2.fromScale(expSize, 1)}
							Position={UDim2.fromScale(0, 0)}
							AnchorPoint={new Vector2(0, 0)}
							BorderSizePixel={0}
							BackgroundColor3={new Color3(0.25, 0.3, 0.51)}
							ZIndex={1}
						>
							<uicorner CornerRadius={new UDim(0.25, 0)} />
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
						Text={`${experience}/${maxExp}`}
						ZIndex={2}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
				</frame>
				<frame
					key={"Level Bar"}
					Size={UDim2.fromScale(0.005, 0.6)}
					Position={UDim2.fromScale(expSize, 0.5)}
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={0}
					BorderSizePixel={2}
					BackgroundColor3={new Color3(0.4, 0.4, 0.61)}
					ZIndex={1}
				/>
			</frame>
			<imagelabel
				key={"Side Box L"}
				Size={UDim2.fromScale(0.19, 0.19)}
				Position={UDim2.fromScale(0.003, 0.86)}
				AnchorPoint={new Vector2(0.35, 0.5)}
				BorderSizePixel={3}
				BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
				BorderColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={0}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uiaspectratioconstraint AspectRatio={0.5} />
				<Corner
					pos={UDim2.fromScale(0.1, 0.5)}
					innerSize={UDim2.fromScale(0.6, 0.6)}
					outSize={UDim2.fromScale(1, 1)}
					rotation={0}
				/>
			</imagelabel>
			<imagelabel
				key={"Side Box R"}
				Size={UDim2.fromScale(0.19, 0.19)}
				Position={UDim2.fromScale(0.992, 0.86)}
				AnchorPoint={new Vector2(0.35, 0.5)}
				BorderSizePixel={3}
				BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
				BorderColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={0}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uiaspectratioconstraint AspectRatio={0.5} />
				<Corner
					pos={UDim2.fromScale(0.9, 0.5)}
					innerSize={UDim2.fromScale(0.6, 0.6)}
					outSize={UDim2.fromScale(1, 1)}
					rotation={0}
				/>
			</imagelabel>
			<imagelabel
				key={"Level Box"}
				Size={UDim2.fromScale(0.275, 0.275)}
				Position={UDim2.fromScale(0.5, 0.86)}
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
					Size={UDim2.fromScale(0.85, 0.85)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
					ZIndex={5}
					Image={`rbxassetid://12790545456`}
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
			<imagelabel
				key={"Coin Outter Box"}
				Size={UDim2.fromScale(0.275, 0.2)}
				Position={UDim2.fromScale(0.2025, -0.07)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={5}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<imagelabel
					key={"Coin Inner Box"}
					Size={UDim2.fromScale(0.95, 0.725)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
					ZIndex={5}
					Image={`rbxassetid://12790545456`}
					ImageTransparency={0.5}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<textlabel
						key={"Coin Text"}
						Size={UDim2.fromScale(0.85, 0.85)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
						TextScaled={true}
						Font={Enum.Font.GothamMedium}
						Text={`Coins: ${coins}`}
						TextStrokeColor3={new Color3(0, 0, 0)}
						TextStrokeTransparency={0.5}
					></textlabel>
				</imagelabel>
			</imagelabel>
			<imagelabel
				key={"Gems Outter Box"}
				Size={UDim2.fromScale(0.275, 0.2)}
				Position={UDim2.fromScale(0.4985, -0.07)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={5}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<imagelabel
					key={"Gems inner Box"}
					Size={UDim2.fromScale(0.95, 0.725)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
					ZIndex={5}
					Image={`rbxassetid://12790545456`}
					ImageTransparency={0.5}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<textlabel
						key={"Gems Text"}
						Size={UDim2.fromScale(0.85, 0.85)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
						TextScaled={true}
						Font={Enum.Font.GothamMedium}
						Text={`Gems: ${coins}`}
						TextStrokeColor3={new Color3(0, 0, 0)}
						TextStrokeTransparency={0.5}
					></textlabel>
				</imagelabel>
			</imagelabel>
			<imagelabel
				key={"IDK Outter Box"}
				Size={UDim2.fromScale(0.275, 0.2)}
				Position={UDim2.fromScale(0.795, -0.07)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
				ZIndex={5}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<imagelabel
					key={"IDK inner Box"}
					Size={UDim2.fromScale(0.95, 0.725)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(0.49, 0.49, 0.49)}
					ZIndex={5}
					Image={`rbxassetid://12790545456`}
					ImageTransparency={0.5}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<textlabel
						key={"IDK Text"}
						Size={UDim2.fromScale(0.85, 0.85)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						TextColor3={new Color3(1, 1, 1)}
						TextScaled={true}
						Font={Enum.Font.GothamMedium}
						Text={`IDK`}
						TextStrokeColor3={new Color3(0, 0, 0)}
						TextStrokeTransparency={0.5}
					></textlabel>
				</imagelabel>
			</imagelabel>
			<imagelabel
				key={"Inventory Button Outter Frame"}
				Size={UDim2.fromScale(0.2, 0.4)}
				Position={UDim2.fromScale(1.125, 0.4)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BorderSizePixel={0}
				BackgroundColor3={new Color3(0.18, 0.18, 0.18)}
				Image={`rbxassetid://12790545456`}
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
					Image={`rbxassetid://12790545456`}
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
