import { ColorUtil } from "../utils";
import { mapBinding } from "@rbxts/pretty-react-hooks";
import type { Binding } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";

export function useDarkenedColor(color: BindingOrValue<Color3>, coefficient: number): Binding<Color3> {
	return mapBinding(color, (value: Color3): Color3 => ColorUtil.darken(value, coefficient));
}
