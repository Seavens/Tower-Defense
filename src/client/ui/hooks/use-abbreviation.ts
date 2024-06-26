import { useMemo } from "@rbxts/react";

const NUMBER_ABBREVIATIONS = [
	"k",
	"M",
	"B",
	"T",
	"Qd",
	"Qn",
	"Sx",
	"Sp",
	"O",
	"N",
	"De",
	"Ud",
	"DD",
	"tdD",
	"QnD",
	"SxD",
	"SpD",
	"OcD",
	"NvD",
	"VgN",
	"UvG",
	"DvG",
	"TvG",
	"QtV",
	"QnV",
	"SeV",
	"SpG",
	"OvG",
	"NvG",
	"TgN",
	"UtG",
	"DtG",
	"TsTg",
	"QtTg",
	"QnTg",
	"SsTg",
	"SpTg",
	"OcTg",
	"NoTg",
	"QdDr",
	"UnAg",
	"DuAg",
	"TeAg",
	"QdAg",
	"QnAG",
	"SxAg",
	"SpAg",
	"OcAg",
	"NvAg",
	"CT",
];

export function useAbbreviation(value: number, decimals = 1): string {
	const positive = value > 0 ? value : value * -1;
	const index = math.floor(math.log10(positive) / 3);
	if (index <= 0) {
		return `${round(value, decimals)}`;
	}
	const abbreviation = NUMBER_ABBREVIATIONS[index - 1];
	const significant = value / (10 ** 3) ** index;
	if (significant % 1 === 0) {
		return `${math.floor(significant)}${abbreviation}`;
	} else {
		return `${round(significant, decimals)}${abbreviation}`;
	}
}

export function round(num: number, numDecimalPlaces: number): number {
	const mult = math.pow(10, numDecimalPlaces);
	return math.floor(num * mult + 0.5) / mult;
}
