import { t } from "@rbxts/t";

const isString = t.string;
const isNumber = t.number;

export function isSlot(value: unknown): value is Slot {
	if (!isString(value)) {
		return false;
	}
	const number = tonumber(value);
	return isNumber(number);
}
