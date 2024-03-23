// Resourced from Littensy: https://github.com/littensy/slither
import { useState } from "@rbxts/react";
import { useViewport } from "@rbxts/pretty-react-hooks";

export function useOrientation(): "landscape" | "portrait" {
	const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");

	useViewport((viewport) => {
		setOrientation(viewport.Y > viewport.X ? "portrait" : "landscape");
	});

	return orientation;
}
