import { t } from "@rbxts/t";

const isString = t.string;

export function isKeycode(value: unknown): value is Keycode {
	if (!isString(value)) {
		return false;
	}
	const [success] = pcall((): void => {
		Enum.KeyCode[value as Keycode];
	});
	return success;
}
