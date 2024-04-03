import { useMemo } from "@rbxts/react";
import { ColorUtil } from "../utils";

export function useDarkenedColor(color: Color3, coefficient: number): Color3 {
	return useMemo((): Color3 => {
		return ColorUtil.darken(color, coefficient);
	}, [color, coefficient]);
}
