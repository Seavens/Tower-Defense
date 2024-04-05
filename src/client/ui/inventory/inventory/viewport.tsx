import { Group } from "client/ui/components";
import { ReplicatedStorage } from "@rbxts/services";
import { ViewportUtil } from "client/ui/utils";
import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ItemId } from "shared/inventory/types";
import type { ViewportCalculations } from "client/ui/utils";

interface InventoryViewportProps {
	id: ItemId;
}

const { assets } = ReplicatedStorage;
const { items } = assets;

export function InventoryViewport({ id }: InventoryViewportProps): Element {
	const prefab = useMemo((): Option<Model> => {
		const prefab = items.FindFirstChild(id);
		if (prefab === undefined || !prefab.IsA("Model")) {
			return undefined;
		}
		return prefab;
	}, [id]);
	const [viewport, setViewport] = useState<ViewportFrame>();

	const calibrate = useCallback((viewport: ViewportFrame, camera: Camera): ViewportCalculations => {
		return ViewportUtil.calibrateViewport(viewport, camera);
	}, []);

	const points = useMemo((): Option<Array<Vector3>> => {
		if (prefab === undefined) {
			return undefined;
		}
		const points = ViewportUtil.getModelPointCloud(prefab);
		return points;
	}, [prefab]);

	useEffect((): (() => void) | void => {
		if (viewport === undefined || prefab === undefined || points === undefined) {
			return undefined;
		}
		const model = prefab.Clone();
		const camera = new Instance("Camera");
		const world = new Instance("WorldModel");
		const pivot = model.GetPivot();
		const look = pivot.LookVector;
		const right = look.Cross(Vector3.yAxis);
		const calcs = calibrate(viewport, camera);
		const cframe = ViewportUtil.getMinimumFitCFrame(
			points,
			calcs,
			CFrame.fromMatrix(Vector3.zero, look, right).mul(CFrame.Angles(math.rad(180), math.rad(90), math.rad(90))),
		);
		viewport.CurrentCamera = camera;
		camera.CFrame = cframe;
		camera.Parent = viewport;
		world.Parent = viewport;
		model.Parent = world;
		return (): void => {
			viewport.CurrentCamera = undefined;
			camera.Destroy();
			model.Destroy();
			world.Destroy();
		};
	}, [viewport, prefab, points]);

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
