import { Flamework } from "@flamework/core";

export const enum UIKind {
	Inventory = "ui_kind:inventory",
}

export const isUIKind = Flamework.createGuard<UIKind>();
