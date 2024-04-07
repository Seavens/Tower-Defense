export function getSizeFactor(experience: number, maxExperience: number): number {
	const ratio = experience / maxExperience;
	if (ratio > 0.02) return 1;
	else return math.max(0.5, ratio * 45);
}