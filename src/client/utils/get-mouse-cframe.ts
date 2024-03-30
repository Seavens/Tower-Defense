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
	return new CFrame(position);
}
