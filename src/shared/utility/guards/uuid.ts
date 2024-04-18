import { t } from "@rbxts/t";

const isString = t.string;

export function isUUID(value: unknown): value is UUID {
	if (!isString(value)) {
		return false;
	}
	return value.size() === 32;
}
