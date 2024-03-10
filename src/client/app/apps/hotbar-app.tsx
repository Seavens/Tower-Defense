import { Hotbar } from "../components";
import { Players } from "@rbxts/services";
import { markPureComponent } from "@rbxts/roact-hooked";
import { selectInventoryData, selectProfileData } from "client/state/selectors";
import { useSelector } from "@rbxts/roact-reflex";
import { useViewportSize } from "@rbxts/roact-hooked-plus";
import Roact from "@rbxts/roact";
import type { Element } from "@rbxts/roact";

export function HotbarApp(): Element {
	const profileData = useSelector(selectProfileData);
	const inventoryData = useSelector(selectInventoryData);

	return (
		<frame
			Key={"Hotbar App Frame"}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={Vector2.one.mul(0.5)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
		>
			<Hotbar inventoryData={inventoryData} playerData={profileData} />
		</frame>
	);
}
