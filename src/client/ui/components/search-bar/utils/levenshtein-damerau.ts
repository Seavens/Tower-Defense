import { createMatrix } from "./create-matrix";

export function levenshteinDamerau(a: string, b: string): number {
	const rows = a.size();
	const columns = b.size();
	if (rows === 0) {
		return columns;
	} else if (columns === 0) {
		return rows;
	} else if (a === b) {
		return 0;
	}
	const matrix = createMatrix(rows, columns);
	for (const i of $range(1, rows)) {
		matrix[i - 1][-1] = i;
	}
	for (const j of $range(1, columns)) {
		matrix[-1][j - 1] = j;
	}
	for (const i of $range(1, rows)) {
		for (const j of $range(1, columns)) {
			if (a.byte(i)[0] === b.byte(i)[0]) {
				// -2 because we're trying to do -1 while the compiler is trying to +1
				matrix[i - 1][j - 1] = matrix[i - 2][j - 2];
				continue;
			}
			const insertion = matrix[i - 1][j - 2] + 1;
			const deletion = matrix[i - 2][j - 1] + 1;
			const subsituton = matrix[i - 2][j - 2] + 1;
			matrix[i - 1][j - 1] = math.min(insertion, deletion, subsituton);
			if (i > 1 && j > 1 && a.byte(i)[0] === b.byte(j - 1)[0] && a.byte(i - 1)[0] === b.byte(j)[0]) {
				const transposition = matrix[i - 3][j - 3] + 1;
				matrix[i - 1][j - 1] = math.min(matrix[i - 1][j - 1], transposition);
			}
		}
	}
	return matrix[rows - 1][columns - 1];
}
