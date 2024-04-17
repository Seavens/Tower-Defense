export function truncateNumber(number: number, decimals: number): string {
	return string.format(`%.${decimals}f`, number);
}
