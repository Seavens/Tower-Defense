import { usePx } from "client/ui/hooks";

// export function getSizeFactor(currentValue: number, maxValue: number, cornerSize: number): number {
// 	const px = usePx();
// 	const ratio = currentValue / maxValue;
// 	const adjustedRatio = (ratio * px(cornerSize)) / maxValue;
// 	let sizeFactor = adjustedRatio > 0.02 ? adjustedRatio : math.max(0.5, adjustedRatio * 45);
// 	// Apply a logarithmic scale to the sizeFactor
// 	sizeFactor = math.log(sizeFactor * currentValue + 1);
// 	// Multiply the sizeFactor by a constant less than 1 to make it smaller
// 	sizeFactor = sizeFactor * 0.8;
// 	sizeFactor = math.min(sizeFactor, 1);
// 	return sizeFactor;
// }

export function getSizeFactor(currentValue: number, maxValue: number, cornerSize: number): number {
	const percentage = cornerSize / 100;
	const alpha = currentValue / maxValue;
	const factor = alpha / percentage;
	return math.min(factor, 1);
}
