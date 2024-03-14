import * as prettyReactHooks from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";
import { createMotion } from "@rbxts/ripple";
import { useBinding, useMemo } from "@rbxts/react";
import type { Binding } from "@rbxts/react";
import type { Motion, MotionGoal } from "@rbxts/ripple";

export function useMotion(initialValue: number): LuaTuple<[Binding<number>, Motion]>;

export function useMotion<T extends MotionGoal>(initialValue: T): LuaTuple<[Binding<T>, Motion<T>]>;

export function useMotion<T extends MotionGoal>(initialValue: T): LuaTuple<[Binding<T>, Motion<T>]> {
	const motion = useMemo(() => {
		return createMotion(initialValue);
	}, []);

	const [binding, setValue] = useBinding(initialValue);

	prettyReactHooks.useEventListener(RunService.Heartbeat, (delta) => {
		const value = motion.step(delta);

		if (value !== binding.getValue()) {
			setValue(value);
		}
	});

	return $tuple(binding, motion);
}
