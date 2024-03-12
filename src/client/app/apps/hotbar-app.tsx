import { Hotbar } from "../components";
import { Players } from "@rbxts/services";
import { selectInventoryData, selectProfileData } from "client/state/selectors";
import { useSelector } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function HotbarApp(): Element {
	const profileData = useSelector(selectProfileData);
	const inventoryData = useSelector(selectInventoryData);

	return (
		<frame
			key={"Hotbar App Frame"}
			Size={UDim2.fromScale(1, 1)}
			Position={UDim2.fromScale(0.5, 0.5)}
			AnchorPoint={Vector2.one.mul(0.5)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
		>
			<Hotbar inventoryData={inventoryData} profileData={profileData} />
		</frame>
	);
}
