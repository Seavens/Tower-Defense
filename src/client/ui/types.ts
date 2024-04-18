import { Flamework } from "@flamework/core";

export const enum UIKind {
	Inventory = "ui_kind:inventory",
	Settings = "ui_kind:settings",
}

export const isUIKind = Flamework.createGuard<UIKind>();
