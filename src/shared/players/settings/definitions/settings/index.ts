import { keybinds } from "./keybinds";
import { sliders } from "./sliders";
import { toggles } from "./toggles";
import type { SettingId, SettingKind } from "../../types";
import type { t } from "@rbxts/t";

interface DefinitionKinds {
	[SettingKind.Keybind]: KeybindDefinition;
	[SettingKind.Slider]: SliderDefinition;
	[SettingKind.Toggle]: ToggleDefinition;
}

export interface KeybindDefinition {
	kind: SettingKind.Keybind;
	guard: t.check<Keycode>;
	default: Keycode;
}

export interface SliderDefinition {
	kind: SettingKind.Slider;
	guard: t.check<number>;
	max: number;
	min: number;
	default: number;
}

export interface ToggleDefinition<V extends defined = defined> {
	kind: SettingKind.Toggle;
	guard: t.check<V>;
	values: Array<V>;
	default: V;
}

export interface SettingDefinition<I extends SettingId, K extends SettingKind> {
	id: I;
	name: string;
	desc: string;

	kind: DefinitionKinds[K];
}

export type InferSettingKind<T> =
	T extends SettingDefinition<SettingId, infer K>
		? K
		: T extends SettingId
			? (typeof settingDefinitions)[T] extends SettingDefinition<T, infer K>
				? K
				: SettingKind
			: never;
export type SettingValueOfId<T extends SettingId> = DefinitionKinds[InferSettingKind<T>]["default"];
export type SettingIdOfKind<K extends SettingKind> = {
	[I in keyof typeof settingDefinitions]: (typeof settingDefinitions)[I] extends SettingDefinition<I, K> ? I : never;
}[keyof typeof settingDefinitions];
export type AnySettingDefinition = (typeof settingDefinitions)[SettingId];

export const settingDefinitions = {
	...sliders,
	...keybinds,
	...toggles,
} as const;
settingDefinitions satisfies { [I in SettingId]: SettingDefinition<I, InferSettingKind<I>> };
