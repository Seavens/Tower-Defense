import { RunService } from "@rbxts/services";
import { createMotion } from "@rbxts/ripple";
import { useBinding, useEffect, useMemo } from "@rbxts/react";
import { useLatestCallback } from "@rbxts/pretty-react-hooks";
import type { Binding } from "@rbxts/react";
import type { Motion, MotionGoal } from "@rbxts/ripple";

export function useMotion<T = number>(
	goal: number,
	mapper?: (value: number) => T,
): LuaTuple<[Binding<T>, Motion<number>]>;

export function useMotion<T extends MotionGoal, U = T>(
	goal: T,
	mapper?: (value: T) => U,
): LuaTuple<[Binding<U>, Motion<T>]>;

export function useMotion<T extends MotionGoal, U>(
	goal: T,
	mapper?: (value: T) => U,
): LuaTuple<[Binding<T | U>, Motion<T>]> {
	const motion = useMemo(() => {
		return createMotion(goal);
	}, []);

	const get = useLatestCallback(() => {
		const value = motion.get();
		return mapper ? mapper(value) : value;
	});

	const [binding, setValue] = useBinding(get());

	useEffect(() => {
		setValue(get());
	}, [mapper]);

	useEffect(() => {
		const connection = RunService.Heartbeat.Connect((delta) => {
			motion.step(delta);
			setValue(get());
		});

		return () => {
			connection.Disconnect();
			motion.destroy();
		};
	}, [motion]);

	return $tuple(binding, motion);
}
