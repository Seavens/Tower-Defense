import { useCamera, useEventListener, usePrevious, useUpdate } from "@rbxts/pretty-react-hooks";
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
	const previous = usePrevious(point);

	return useMemo((): Vector2 => {
		const position = new Vector2((previous ?? point).X, (previous ?? point).Y);
		return position;
	}, [point, previous]);
}
