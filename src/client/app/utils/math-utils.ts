export function formatNumber(num: number): string {
	if (num >= 1_000_000_000_000_000_000) {
		return math.round((num / 1_000_000_000_000_000_000) * 10) / 10 + "QN";
	} else if (num >= 1_000_000_000_000_000) {
		return math.round((num / 1_000_000_000_000_000) * 10) / 10 + "QT";
	} else if (num >= 1_000_000_000_000) {
		return math.round((num / 1_000_000_000_000) * 10) / 10 + "T";
	} else if (num >= 1_000_000_000) {
		return math.round((num / 1_000_000_000) * 10) / 10 + "B";
	} else if (num >= 1_000_000) {
		return math.round((num / 1_000_000) * 10) / 10 + "M";
	} else if (num >= 1_000) {
		return math.round((num / 1_000) * 10) / 10 + "K";
	} else {
		return tostring(num);
	}
}
