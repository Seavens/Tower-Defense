import { TowerDefinitions } from "shared/definitions/towers";
import { markPureComponent } from "@rbxts/roact-hooked";
import Roact from "@rbxts/roact";
import type { Tower } from "shared/types/objects";
import type { TowerId } from "shared/types/ids";

interface ItemSlotProps {
	towerData: Tower;
}

export function ItemSlot(props: ItemSlotProps): Roact.Element {
	const { id, level } = props.towerData;
	const { imageId } = TowerDefinitions[id];
	return (
		<frame
			Key={"ItemSlot Invisiable Frame"}
			Size={new UDim2(0, 700, 0, 700)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={new Color3(0.73, 0.73, 0.73)}
			BorderSizePixel={0}
			Transparency={1}
		>
			<frame
				Key={"ItemSlot Frame Outter Border"}
				Size={new UDim2(1, 0, 1, 0)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(0.73, 0.73, 0.73)}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<frame
					Key={"ItemSlot Frame Inner Border"}
					Size={new UDim2(0.95, 0, 0.95, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<imagelabel
						Key={"ItemSlot ImageButton"}
						Size={new UDim2(1, 0, 1, 0)}
						Position={new UDim2(0.5, 0, 1, 0)}
						AnchorPoint={new Vector2(0.5, 1)}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Image={`http://www.roblox.com/asset/?id=${imageId}`}
					>
						<uicorner CornerRadius={new UDim(0.15, 0)} />
					</imagelabel>
					<textbox
						Key={"Level Textbox"}
						Size={new UDim2(0.2, 0, 0.2, 0)}
						Position={new UDim2(0.5, 0, 0, 0)}
						AnchorPoint={new Vector2(0.5, 0)}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Text={`${level}`}
						TextColor3={new Color3(0, 0, 0)}
						TextSize={24}
						Font={Enum.Font.GothamMedium}
					/>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
				</frame>
			</frame>
		</frame>
	);
}

markPureComponent(ItemSlot);
