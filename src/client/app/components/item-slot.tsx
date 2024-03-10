import { RarityId } from "shared/types/ids/rarity-id";
import { TowerDefinitions } from "shared/definitions/towers";
import { markPureComponent } from "@rbxts/roact-hooked";
import { rarityDefinitions } from "shared/definitions/rarities";
import Roact from "@rbxts/roact";
import type { Tower } from "shared/types/objects";

interface ItemSlotProps {
	towerData: Tower;
}

export function ItemSlot(props: ItemSlotProps): Roact.Element {
	const { id, level } = props.towerData;
	const { imageId, rarity, cost } = TowerDefinitions[id];
	const { color } = rarityDefinitions[rarity];

	return (
		<frame
			Key={"ItemSlot Invisiable Frame"}
			Size={new UDim2(0.8, 0, 0.8, 0)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BorderSizePixel={0}
			Transparency={1}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<imagelabel
				Key={"ItemSlot Frame Outter Border"}
				Size={new UDim2(1, 0, 1, 0)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(1, 1, 1), 0.5)}
				Image={`rbxassetid://12790545456`}
				ImageTransparency={0.5}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<imagelabel
					Key={"ItemSlot Frame Inner Border"}
					Size={new UDim2(0.95, 0, 0.95, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(color[0], color[1], color[2])}
					Image={`rbxassetid://12790545456`}
					ImageTransparency={0.5}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<imagebutton
						Key={"ItemSlot ImageButton"}
						Size={new UDim2(1, 0, 1, 0)}
						Position={new UDim2(0.5, 0, 1, 0)}
						AnchorPoint={new Vector2(0.5, 1)}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Image={`http://www.roblox.com/asset/?id=${imageId}`}
					>
						<uicorner CornerRadius={new UDim(0.15, 0)} />
					</imagebutton>
					<frame
						Key={"Level Frame Outter Border"}
						Size={new UDim2(0.235, 0, 0.235, 0)}
						Position={new UDim2(0.16, 0, 0.16, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={0.5}
						BorderSizePixel={0}
						BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(1, 1, 1), 0.25)}
					>
						<frame
							Key={"Level Frame Inner Border"}
							Size={new UDim2(0.925, 0, 0.925, 0)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundTransparency={0.5}
							BorderSizePixel={0}
							BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(1, 1, 1), 0.95)}
						>
							<uicorner CornerRadius={new UDim(0.5, 0)} />
							<textbox
								Key={"Level Text"}
								Size={new UDim2(0.8, 0, 0.8, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Text={`${level}`}
								TextScaled={true}
								BackgroundTransparency={1}
								TextColor3={new Color3(1, 1, 1)}
								TextStrokeColor3={new Color3(0, 0, 0)}
								TextStrokeTransparency={0}
							/>
						</frame>
						<uicorner CornerRadius={new UDim(0.5, 0)} />
					</frame>
					<uicorner CornerRadius={new UDim(0.15, 0)} />

					<imagelabel
						Key={"Cost Frame Outter Border"}
						Size={new UDim2(0.75, 0, 0.125, 0)}
						Position={new UDim2(0.5, 0, 1, 0)}
						AnchorPoint={new Vector2(0.5, 1)}
						BorderSizePixel={0}
						BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(0, 0, 0), 0.95)}
						Image={`rbxassetid://12790545456`}
						ImageTransparency={0.5}
					>
						<imagelabel
							Key={"Cost Frame inner Border"}
							Size={new UDim2(0.9625, 0, 0.9, 0)}
							Position={new UDim2(0.5, 0, 1.0, 0)}
							AnchorPoint={new Vector2(0.5, 1)}
							BorderSizePixel={0}
							BackgroundColor3={new Color3(color[0], color[1], color[2]).Lerp(new Color3(0, 0, 0), 0.65)}
							Image={`rbxassetid://12790545456`}
							ImageTransparency={0.5}
						>
							<textbox
								Key={"Cost Text"}
								Size={new UDim2(0.925, 0, 0.925, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Text={`$${cost}`}
								TextScaled={true}
								BackgroundTransparency={1}
								TextColor3={new Color3(1, 1, 1)}
								TextStrokeColor3={new Color3(0, 0, 0)}
								TextStrokeTransparency={0}
							/>
						</imagelabel>
					</imagelabel>
				</imagelabel>
			</imagelabel>
		</frame>
	);
}

markPureComponent(ItemSlot);
