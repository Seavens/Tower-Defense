import { useCallback, useState } from "@rbxts/roact-hooked";
import { useSpring } from "@rbxts/roact-hooked-plus";
import type { Binding } from "@rbxts/roact";
import type { SpringOptions } from "@rbxts/roact-hooked-plus";

interface HoverConfig {
	onInputBegan: (rbx: GuiObject, input: InputObject) => void;
	onInputEnded: (rbx: GuiObject, input: InputObject) => void;
	hovering: boolean;
	alpha: Binding<number>;
}

export function useHover(config?: SpringOptions): HoverConfig {
	const [hovering, setHovering] = useState(false);
	const alpha = useSpring(
		hovering ? 1 : 0,
		config ?? {
			dampingRatio: hovering ? 5 : 10,
			frequency: 10,
		},
	);

	const onInputBegan = useCallback((rbx: GuiObject, input: InputObject): void => {
		if (input.UserInputType !== Enum.UserInputType.MouseMovement) {
			return;
		}
		setHovering(true);
	}, []);

	const onInputEnded = useCallback((rbx: GuiObject, input: InputObject): void => {
		if (input.UserInputType !== Enum.UserInputType.MouseMovement) {
			return;
		}
		setHovering(false);
	}, []);

	return {
		onInputBegan,
		onInputEnded,
		hovering,
		alpha,
	};
}
