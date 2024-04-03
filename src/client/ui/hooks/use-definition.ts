import { useMemo } from "@rbxts/react";

export function useDefinition<T extends defined>(definitions: { [K in keyof T]: T[K] }): <K extends keyof T>(
	id: K,
) => T[K] {
	return <K extends keyof T>(id: K): T[K] => {
		const definition = useMemo((): T[K] => {
			return definitions[id];
		}, [id]);
		return definition;
	};
}
