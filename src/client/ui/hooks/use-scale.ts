import { useCamera, useDebounceState, useEventListener } from "@rbxts/pretty-react-hooks";

function calculateScale(offset: Vector2, viewport: Vector2): Vector2 {
	const scale = new Vector2(offset.X / viewport.X, offset.Y / viewport.Y);
	return scale;
}

export function useScale(offset: Vector2): Vector2 {
	const camera = useCamera();

	const [scale, setScale] = useDebounceState(calculateScale(offset, camera.ViewportSize), {
		wait: 0.2,
		leading: true,
	});

	useEventListener(camera.GetPropertyChangedSignal("ViewportSize"), () => {
		setScale(calculateScale(offset, camera.ViewportSize));
	});

	return scale;
}
