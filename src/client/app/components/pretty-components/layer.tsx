// Resourced from Littensy: https://github.com/littensy/slither
import { IS_EDIT } from "shared/constants/core-constants";
import React from "@rbxts/react";

import { Group } from "./group";

interface LayerProps extends React.PropsWithChildren {
	displayOrder?: number;
}

export function Layer({ displayOrder, children }: LayerProps): JSX.Element {
	return IS_EDIT ? (
		<Group zIndex={displayOrder}>{children}</Group>
	) : (
		<screengui ResetOnSpawn={false} DisplayOrder={displayOrder} IgnoreGuiInset ZIndexBehavior="Sibling">
			{children}
		</screengui>
	);
}
