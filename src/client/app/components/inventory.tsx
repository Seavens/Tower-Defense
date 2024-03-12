import { Corner } from "./corner";
import { Dictionary } from "@rbxts/sift";
import { ItemSlot } from "./item-slot";
import { Players } from "@rbxts/services";
import { TowerDefinitions } from "shared/definitions/towers";
import { TowerId } from "shared/types/ids";
import { clientProducer } from "client/state/producer";
import { number } from "@rbxts/react/src/prop-types";
import { selectInventoryData, selectProfileData } from "client/state/selectors";
import { useSelector } from "@rbxts/react-reflex";
import { useViewport } from "@rbxts/pretty-react-hooks";
import React, { Fragment } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { InventoryData } from "shared/types/data";
import type { Tower } from "shared/types/objects";

interface InventoryProps {}

export function Inventory(props: InventoryData): Element {
	const viewportSize = useViewport().getValue();
	const { stored } = useSelector(selectInventoryData);
	const selectedItem = stored.get("1")!;
	const assetID = `${TowerDefinitions[selectedItem.id].imageId}`;

	return (
		<imagelabel
			key={"Inventory Frame Outter Border"}
			Size={new UDim2(-0.2, viewportSize.X, -0.2, viewportSize.Y)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
			Image={`rbxassetid://12790545456`}
			ImageTransparency={0.5}
		>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<imagelabel
				key={"Inventory Frame Inner Border"}
				Size={UDim2.fromScale(0.98, 0.965)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundColor3={new Color3(0.32, 0.3, 0.15)}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uicorner CornerRadius={new UDim(0.05, 0)} />

				<imagelabel
					key={"Inventory Selection Frame Outter"}
					Size={UDim2.fromScale(0.65, 0.95)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.658, 0.5)}
					BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
					Image={`rbxassetid://12790545456`}
					ImageTransparency={0.5}
				>
					<Corner
						pos={UDim2.fromScale(0.0175, 0.0175)}
						outSize={UDim2.fromScale(0.06, 0.06)}
						innerSize={UDim2.fromScale(0.65, 0.65)}
						rotation={0}
					/>
					<Corner
						pos={UDim2.fromScale(0.0175, 1 - 0.0175)}
						outSize={UDim2.fromScale(0.06, 0.06)}
						innerSize={UDim2.fromScale(0.65, 0.65)}
						rotation={0}
					/>
					<Corner
						pos={UDim2.fromScale(1 - 0.0175, 0.0175)}
						outSize={UDim2.fromScale(0.06, 0.06)}
						innerSize={UDim2.fromScale(0.65, 0.65)}
						rotation={0}
					/>
					<Corner
						pos={UDim2.fromScale(1 - 0.0175, 1 - 0.0175)}
						outSize={UDim2.fromScale(0.06, 0.06)}
						innerSize={UDim2.fromScale(0.65, 0.65)}
						rotation={0}
					/>

					<uicorner CornerRadius={new UDim(0.06, 0)} />
					<imagelabel
						key={"Inventory Selection Frame Inner"}
						Size={UDim2.fromScale(0.97, 0.97)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						BackgroundColor3={new Color3(0.56, 0.53, 0.33)}
						Image={`rbxassetid://12790545456`}
						ImageTransparency={0.5}
					>
						<uicorner CornerRadius={new UDim(0.065, 0)} />
						<imagelabel
							key={"Inventory Selection Frame Background"}
							Size={UDim2.fromScale(0.965, 0.965)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							BackgroundColor3={new Color3(0.27, 0.25, 0.16)}
							Image={`rbxassetid://12790545456`}
							ImageTransparency={0.5}
							BackgroundTransparency={0.5}
						>
							<uicorner CornerRadius={new UDim(0.05, 0)} />
							<scrollingframe
								key={"Inventory Scrolling Selection Frame"}
								Size={UDim2.fromScale(0.95, 0.95)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={UDim2.fromScale(0.5, 0.5)}
								BackgroundColor3={new Color3(0.27, 0.25, 0.16)}
								BorderSizePixel={5}
								BorderColor3={new Color3(0.14, 0.14, 0.14)}
								BorderMode={Enum.BorderMode.Outline}
								ScrollBarImageColor3={new Color3(0.55, 0.51, 0.33)}
								Transparency={0.5}
								CanvasSize={new UDim2(0, 0, 0, 2000)}
							>
								<uigridlayout
									CellSize={new UDim2(0, 138, 0, 138)}
									CellPadding={new UDim2(0, 5, 0, 5)}
									SortOrder={Enum.SortOrder.LayoutOrder}
									HorizontalAlignment={Enum.HorizontalAlignment.Left}
									VerticalAlignment={Enum.VerticalAlignment.Top}
								/>
								{Dictionary.map<Record<string, Tower>, string, Element>(
									stored as never, // This is required because of how `Sift.Dictionary.map` types work.
									(tower: Tower, key: string): Element => {
										return <ItemSlot tower={tower} key={key} />;
									},
								)}
							</scrollingframe>
						</imagelabel>
					</imagelabel>
				</imagelabel>
				<imagelabel
					key={"Stats Frame Outter"}
					Size={UDim2.fromScale(0.275, 0.945)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.165, 0.5)}
					BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
					Image={`rbxassetid://12790545456`}
					BorderSizePixel={0}
					ImageTransparency={0.5}
				>
					<Corner
						pos={UDim2.fromScale(0.0175, 0.0175)}
						outSize={UDim2.fromScale(0.11, 0.11)}
						innerSize={UDim2.fromScale(0.65, 0.65)}
						rotation={0}
					/>
					<Corner
						pos={UDim2.fromScale(0.0175, 1 - 0.0175)}
						outSize={UDim2.fromScale(0.11, 0.11)}
						innerSize={UDim2.fromScale(0.65, 0.65)}
						rotation={0}
					/>
					<Corner
						pos={UDim2.fromScale(1 - 0.0175, 0.0175)}
						outSize={UDim2.fromScale(0.11, 0.11)}
						innerSize={UDim2.fromScale(0.65, 0.65)}
						rotation={0}
					/>
					<Corner
						pos={UDim2.fromScale(1 - 0.0175, 1 - 0.0175)}
						outSize={UDim2.fromScale(0.11, 0.11)}
						innerSize={UDim2.fromScale(0.65, 0.65)}
						rotation={0}
					/>
					<imagelabel
						key={"Stats Frame Inner"}
						Size={UDim2.fromScale(0.96, 0.975)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						BackgroundColor3={new Color3(0.56, 0.53, 0.33)}
						Image={`rbxassetid://12790545456`}
						ImageTransparency={0.5}
					>
						<uicorner CornerRadius={new UDim(0.1, 0)} />

						<imagelabel
							key={"Stats Frame Background"}
							Size={UDim2.fromScale(0.92, 0.96)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							BackgroundColor3={new Color3(0.27, 0.25, 0.16)}
							Image={`rbxassetid://12790545456`}
							ImageTransparency={0.5}
							BackgroundTransparency={0.5}
							BorderSizePixel={5}
						>
							<uicorner CornerRadius={new UDim(0.05, 0)} />
							<uilistlayout
								FillDirection={Enum.FillDirection.Vertical}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Center}
								SortOrder={Enum.SortOrder.LayoutOrder}
								Padding={new UDim(0, 8)}
							/>
							<imagelabel
								key={"Tower Image Outter Frame"}
								Size={UDim2.fromScale(0.95, 0.45)}
								AnchorPoint={new Vector2(0.5, 0)}
								Position={UDim2.fromScale(0.5, 0.01)}
								BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
								Image={`rbxassetid://12790545456`}
								ImageTransparency={0.5}
							>
								<uicorner CornerRadius={new UDim(0.05, 0)} />
								<imagelabel
									key={"Tower Image Inner"}
									Size={UDim2.fromScale(0.95, 0.95)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.5, 0.5)}
									BackgroundColor3={new Color3(0.27, 0.25, 0.16)}
									Image={assetID}
									ImageTransparency={0.5}
									BackgroundTransparency={0.5}
								>
									<uicorner CornerRadius={new UDim(0.1, 0)} />
									<imagelabel
										key={"Tower Image Icon"}
										Size={UDim2.fromScale(1, 1)}
										AnchorPoint={new Vector2(0.5, 0.5)}
										Position={UDim2.fromScale(0.5, 0.5)}
										BackgroundTransparency={1}
									/>
								</imagelabel>
							</imagelabel>
							<imagelabel
								key={"Stats Tile One Frame"}
								Size={UDim2.fromScale(0.93, 0.12)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={UDim2.fromScale(0.5, 0.45)}
								BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
								Image={`rbxassetid://12790545456`}
								ImageTransparency={0.5}
							>
								<uicorner CornerRadius={new UDim(0.2, 0)} />
								<textlabel
									key={"Damage Stat"}
									Size={UDim2.fromScale(0.9, 0.9)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.5, 0.5)}
									Text={`Damage: ${math.round(selectedItem.damage)}`}
									TextColor3={new Color3(1, 1, 1)}
									TextStrokeColor3={new Color3(0, 0, 0)}
									TextStrokeTransparency={0}
									BackgroundTransparency={1}
									Font={Enum.Font.GothamMedium}
									TextScaled={true}
								/>
							</imagelabel>
							<imagelabel
								key={"Stats Tile Two Frame"}
								Size={UDim2.fromScale(0.93, 0.12)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={UDim2.fromScale(0.5, 0.565)}
								BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
								Image={`rbxassetid://12790545456`}
								ImageTransparency={0.5}
							>
								<uicorner CornerRadius={new UDim(0.2, 0)} />
								<textlabel
									key={"Range Stat"}
									Size={UDim2.fromScale(0.9, 0.9)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.5, 0.5)}
									Text={`Range: ${math.round(selectedItem.range)}`}
									TextColor3={new Color3(1, 1, 1)}
									TextStrokeColor3={new Color3(0, 0, 0)}
									TextStrokeTransparency={0}
									BackgroundTransparency={1}
									Font={Enum.Font.GothamMedium}
									TextScaled={true}
								/>
							</imagelabel>
							<imagelabel
								key={"Stats Tile Three Frame"}
								Size={UDim2.fromScale(0.93, 0.12)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={UDim2.fromScale(0.5, 0.68)}
								BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
								Image={`rbxassetid://12790545456`}
								ImageTransparency={0.5}
							>
								<uicorner CornerRadius={new UDim(0.2, 0)} />
								<textlabel
									key={"Attack Stat"}
									Size={UDim2.fromScale(0.9, 0.9)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.5, 0.5)}
									Text={`Cooldown: ${math.round(selectedItem.attackSpeed)}`}
									TextColor3={new Color3(1, 1, 1)}
									TextStrokeColor3={new Color3(0, 0, 0)}
									TextStrokeTransparency={0}
									BackgroundTransparency={1}
									Font={Enum.Font.GothamMedium}
									TextScaled={true}
								/>
							</imagelabel>
							<imagelabel
								key={"Stats Tile Four Frame"}
								Size={UDim2.fromScale(0.93, 0.12)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={UDim2.fromScale(0.5, 0.795)}
								BackgroundColor3={new Color3(0.09, 0.09, 0.09)}
								Image={`rbxassetid://12790545456`}
								ImageTransparency={0.5}
							>
								<uicorner CornerRadius={new UDim(0.2, 0)} />
								<textbutton
									Text={"Sell"}
									Size={UDim2.fromScale(0.45, 0.65)}
									AnchorPoint={new Vector2(0.45, 0.5)}
									Position={UDim2.fromScale(0.25, 0.5)}
									TextColor3={new Color3(1, 1, 1)}
									TextStrokeColor3={new Color3(0, 0, 0)}
									TextStrokeTransparency={0}
									Font={Enum.Font.GothamMedium}
									TextScaled={true}
									BackgroundColor3={new Color3(0.57, 0.19, 0.19)}
									Event={{
										MouseButton1Click: () => {
											// Need to remove tower from inventory and add the coins to the player.
											// Couldn't figure out how to get the slot selected.
											//
											//
											//
											// warn(
											// 	`Sold: ${selectedItem.id} for $${math.round(
											// 		TowerDefinitions[selectedItem.id].cost,
											// 	)} in slot ${1} from storage ${
											// 		useSelector(selectInventoryData).stored
											// 	}`,
											// 	`Removed Item: ${clientProducer.inventoryRemoveItem(
											// 		{ slot: "1" },
											// 		{
											// 			user: `${Players.LocalPlayer.UserId}`,
											// 			replicate: true,
											// 		},
											// 	)}`,
											// 	`Coins: ${
											// 		clientProducer.profileAddCoins(
											// 			TowerDefinitions[selectedItem.id].cost,
											// 			{
											// 				user: `${Players.LocalPlayer.Name}`,
											// 				replicate: true,
											// 			},
											// 		).profile.data.coins
											// 	}`,
											// );
											warn(`Sold: ${selectedItem.id} for $${math.round(selectedItem.cost)}`);
										},
									}}
								>
									<uicorner CornerRadius={new UDim(0.2, 0)} />
								</textbutton>
								<textlabel
									key={"Etc Stats"}
									Size={UDim2.fromScale(0.45, 0.5)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.75, 0.5)}
									Text={`+$${math.round(selectedItem.cost)}`}
									TextColor3={new Color3(0.95, 0.9, 0.24)}
									TextStrokeColor3={new Color3(0, 0, 0)}
									BackgroundTransparency={1}
									TextStrokeTransparency={0}
									Font={Enum.Font.GothamMedium}
									TextScaled={true}
								/>
							</imagelabel>
						</imagelabel>
					</imagelabel>
				</imagelabel>
			</imagelabel>
		</imagelabel>
	);
}
