import { useMemo } from "@rbxts/react";
import { ColorUtil } from "../utils";

export function useLightenedColor(color: Color3, coefficient: number): Color3 {
	return useMemo((): Color3 => {
		return ColorUtil.lighten(color, coefficient);
	}, [color, coefficient]);
}
