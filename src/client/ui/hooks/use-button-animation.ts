import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import type React from "@rbxts/react";
import { useMemo } from "@rbxts/react";
import { SPRINGS } from "../constants";
import { useMotion } from "./use-motion";

export interface ButtonAnimation {
	position: React.Binding<number>;
	press: React.Binding<number>;
	hover: React.Binding<number>;
	hoverOnly: React.Binding<number>;
}

export function useButtonAnimation(pressedState: boolean, hoveredState: boolean): ButtonAnimation {
	const [press, pressMotion] = useMotion(0);
	const [hover, hoverMotion] = useMotion(0);
	const [hoverExclusive, hoverExclusiveMotion] = useMotion(0);
	const [position, positionMotion] = useMotion(0);

	useUpdateEffect(() => {
		pressMotion.spring(pressedState ? 1 : 0, SPRINGS.responsive);
		hoverExclusiveMotion.spring(hoveredState && !pressedState ? 1 : 0, SPRINGS.responsive);
	}, [pressedState, hoveredState]);

	useUpdateEffect(() => {
		hoverMotion.spring(hoveredState ? 1 : 0, SPRINGS.responsive);
	}, [hoveredState]);

	useUpdateEffect(() => {
		if (pressedState) {
			positionMotion.spring(1, SPRINGS.responsive);
		} else if (hoveredState) {
			positionMotion.spring(-1, { ...SPRINGS.bubbly, impulse: -0.1 });
		} else {
			positionMotion.spring(0, { ...SPRINGS.bubbly, impulse: -0.07 });
		}
	}, [pressedState]);

	useUpdateEffect(() => {
		if (hoveredState) {
			positionMotion.spring(-1, SPRINGS.responsive);
		} else {
			positionMotion.spring(0, SPRINGS.responsive);
		}
	}, [hoveredState]);

	return useMemo<ButtonAnimation>(() => {
		return {
			press,
			hover: hover.map((t) => math.clamp(t, 0, 1)),
			hoverOnly: hoverExclusive.map((t) => math.clamp(t, 0, 1)),
			position,
		};
	}, []);
}
