import { useLifetime } from "@rbxts/pretty-react-hooks";
import type { Binding } from "@rbxts/react";

export function useRainbow(speed = 3): Binding<Color3> {
	const lifetime = useLifetime();
	return lifetime.map((value: number): Color3 => Color3.fromHSV((value % speed) / speed, 1, 1));
}
