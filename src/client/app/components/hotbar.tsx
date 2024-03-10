import { ItemSlot } from "./item-slot";
import { TowerId } from "shared/types/ids";
import { markPureComponent } from "@rbxts/roact-hooked";
import Roact from "@rbxts/roact";
import type { PlayerData } from "shared/types/data/player-data";
import type { Tower } from "shared/types/objects";

interface hotbarProps {
	inventoryData: Array<Tower>;
	playerData: PlayerData;
}

export function Hotbar(props: hotbarProps): Roact.Element {
	const { inventoryData } = props;
	const [tower1, tower2, tower3, tower4, tower5, tower6] = props.inventoryData;
	const { level, experience } = props.playerData;
	return (
		<frame
			Key={"Hotbar Invisiable Frame"}
			Size={new UDim2(0.5, 0, 0.2, 0)}
			AnchorPoint={new Vector2(0.5, 1)}
			// Position={new UDim2(0.5, 0, 1, 0)}
			Position={new UDim2(0.25, 0, 0.5, 0)}
			BorderSizePixel={0}
			Transparency={1}
		>
			<uiaspectratioconstraint AspectRatio={4.5} />
			<frame
				Key={"Grid Frame"}
				Size={new UDim2(1, 0, 0.8, 0)}
				Position={new UDim2(0.5, 0, 0, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				BorderSizePixel={0}
				Transparency={1}
			>
				<uilistlayout
					Key={"Hotbar GridLayout"}
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0.005, 0)}
				/>
				<ItemSlot towerData={tower1} />
				<ItemSlot towerData={tower2} />
				<ItemSlot towerData={tower3} />
				<ItemSlot towerData={tower4} />
				<ItemSlot towerData={tower5} />
				<ItemSlot towerData={tower6} />
			</frame>

			<frame
				Key={"Level Frame"}
				Size={new UDim2(1, 0, 0.28, 0)}
				Position={new UDim2(0.5, 0, 1, 0)}
				AnchorPoint={new Vector2(0.5, 1)}
				BorderSizePixel={0}
				Transparency={0.5}
				BackgroundColor3={new Color3(1, 0.04, 0.04)}
			>
				<frame
					Key={"Level Bar Outline"}
					Size={new UDim2(1, 0, 0.5, 0)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BorderSizePixel={0}
					BackgroundColor3={new Color3(0.15, 0.15, 0.36)}
				>
					<uicorner CornerRadius={new UDim(0.5, 0)} />
					<imagelabel
						Key={"Level Bar Inline"}
						Size={new UDim2(0.991, 0, 0.8, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BorderSizePixel={0}
						BackgroundColor3={new Color3(0.12, 0.03, 0.2)}
						Image={`rbxassetid://12790545456`}
						ImageTransparency={0.5}
					>
						<uicorner CornerRadius={new UDim(0.5, 0)} />
						<frame
							Key={"Level Bar"}
							Size={new UDim2(0.5, 0, 1, 0)}
							Position={new UDim2(0, 0, 0, 0)}
							AnchorPoint={new Vector2(0, 0)}
							BorderSizePixel={0}
							BackgroundColor3={new Color3(0.56, 0.55, 0.93)}
						>
							<uicorner CornerRadius={new UDim(0.5, 0)} />
						</frame>
					</imagelabel>
				</frame>
			</frame>
		</frame>
	);
}

markPureComponent(Hotbar);
