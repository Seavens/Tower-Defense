import { Group } from "./group";
import { IS_EDIT } from "shared/core/constants";
import React from "@rbxts/react";
import type { Element, PropsWithChildren } from "@rbxts/react";

interface LayerProps extends PropsWithChildren {
	displayOrder?: number;
}

export function Layer({ displayOrder, children }: LayerProps): Element {
	return IS_EDIT ? (
		<Group zIndex={displayOrder}>{children}</Group>
	) : (
		<screengui ResetOnSpawn={false} DisplayOrder={displayOrder} IgnoreGuiInset ZIndexBehavior="Sibling">
			{children}
		</screengui>
	);
}
