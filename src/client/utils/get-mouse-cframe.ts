import { UserInputService, Workspace } from "@rbxts/services";

let camera = Workspace.CurrentCamera;

export function getMouseCFrame(params: RaycastParams): CFrame {
	if (camera === undefined) {
		camera = Workspace.CurrentCamera;
		return CFrame.identity;
	}
	const location = UserInputService.GetMouseLocation();
	const ray = camera.ViewportPointToRay(location.X, location.Y);
	const origin = ray.Origin;
	const direction = ray.Direction.mul(100);
	const raycast = Workspace.Raycast(origin, direction, params);
	if (raycast === undefined) {
		return new CFrame(origin.add(direction));
	}
	const position = raycast.Position;
	const normal = raycast.Normal;
	const normalized = CFrame.lookAlong(position, normal);
	const relative = normalized.PointToObjectSpace(position);
	const xVector = normalized.VectorToWorldSpace(Vector3.xAxis.mul(-math.sign(relative.X)));
	const yVector = normalized.VectorToWorldSpace(Vector3.yAxis.mul(-math.sign(relative.Y)));
	const cframe = CFrame.fromMatrix(position, xVector, yVector, normal);
	return cframe.mul(CFrame.Angles(math.rad(90), 0, 0));
}
