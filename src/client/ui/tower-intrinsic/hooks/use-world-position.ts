import { useCamera, useEventListener, useUpdate } from "@rbxts/pretty-react-hooks";
import { useMemo, useRef } from "@rbxts/react";

export function useWorldPosition(position: Vector3): Vector2 {
	const camera = useCamera();

	// const last = useRef(Vector3.zero);
	// const update = useUpdate();

	// useEventListener(camera.GetPropertyChangedSignal("CFrame"), (): void => {
	// 	const previous = last.current;
	// 	const cframe = camera.CFrame;
	// 	const current = cframe.Position;
	// 	if (current.FuzzyEq(previous)) {
	// 		return;
	// 	}
	// 	last.current = current;
	// 	update();
	// });

	// const [point] = useMemo((): LuaTuple<[Vector3, boolean]> => {
	// 	return camera.WorldToScreenPoint(position);
	// }, [camera, position, update]);

	const [point] = camera.WorldToScreenPoint(position);

	return useMemo((): Vector2 => {
		return new Vector2(point.X, point.Y);
	}, [point]);
}
