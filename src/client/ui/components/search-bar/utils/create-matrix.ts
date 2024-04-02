export type Matrix2D<T> = Array<Array<T>>;

export function createMatrix(rows: number, columns: number): Matrix2D<number> {
	const matrix: Matrix2D<number> = new Array<Array<number>>();
	for (const i of $range(0, rows)) {
		matrix[i - 1] = new Array<number>();
		for (const j of $range(0, columns)) {
			matrix[i - 1][j - 1] = 0;
		}
	}
	return matrix;
}
