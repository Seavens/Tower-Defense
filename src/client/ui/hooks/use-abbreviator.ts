import { useMemo } from "@rbxts/react";
import Abbreviator from "@rbxts/abbreviate";

export function useAbbreviator(): Abbreviator {
	const abbreviator = useMemo((): Abbreviator => {
		return new Abbreviator();
	}, []);
	return abbreviator;
}
