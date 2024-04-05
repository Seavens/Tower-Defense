import { Group } from "client/ui/components";
import { useItemModel } from "../utils";
import React, { useEffect, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ItemId } from "shared/inventory/types";

interface InventoryViewportProps {
	id: ItemId;
}

export function InventoryViewport({ id }: InventoryViewportProps): Element {
	const model = useItemModel(id);
	const [viewport, setViewport] = useState<ViewportFrame>();

	useEffect((): (() => void) | void => {
		if (viewport === undefined || model === undefined) {
			return undefined;
		}
		const camera = new Instance("Camera");
		camera.Parent = viewport;
		camera.CFrame = new CFrame(0, 0, -3).mul(CFrame.Angles(0, math.rad(180), 0));
		const world = new Instance("WorldModel");
		world.Parent = viewport;
		model.PivotTo(CFrame.identity);
		model.Parent = world;
		viewport.CurrentCamera = camera;
		return (): void => {
			viewport.CurrentCamera = undefined;
			camera.Destroy();
			model.Destroy();
			world.Destroy();
		};
	}, [model, viewport]);

	return (
		<Group
			size={UDim2.fromScale(1, 1)}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={Vector2.one.mul(0.5)}
			key={"viewport-group"}
		>
			<viewportframe
				Size={UDim2.fromScale(1, 1)}
				AnchorPoint={Vector2.one.mul(0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Ambient={new Color3(1, 1, 1)}
				LightDirection={Vector3.yAxis}
				ZIndex={0}
				ref={setViewport}
				key={"viewport-frame"}
			/>
		</Group>
	);
}
