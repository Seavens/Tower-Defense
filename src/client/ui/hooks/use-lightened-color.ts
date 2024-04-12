import { ColorUtil } from "../utility";
import { mapBinding } from "@rbxts/pretty-react-hooks";
import type { Binding } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";

export function useLightenedColor(color: BindingOrValue<Color3>, coefficient: number): Binding<Color3> {
	return mapBinding(color, (value: Color3): Color3 => ColorUtil.lighten(value, coefficient));
}
