import { IMatrixElem, TSearchResult } from '../types/types'
import { Fraction } from './fraction.service'

function checkingForUnsolvability(
	matrix: Array<IMatrixElem[]>,
	col: number
): boolean {
	return matrix.every(row => row[col].numerator <= 0)
}

function findNesseccaryRow(matrix: Array<IMatrixElem[]>, col: number): number {
	const ratios = matrix
		.map((row, rowIndex) => {
			const divisor = row[col]
			if (divisor.numerator <= 0) return null

			return {
				value: new Fraction(row[0].numerator, row[0].denominator).divide(
					divisor as Fraction
				),
				rowCoord: rowIndex,
			}
		})
		.filter(Boolean) as { value: IMatrixElem; rowCoord: number }[]

	return ratios.reduce((minElem, currentElem) =>
		currentElem.value < minElem.value ? currentElem : minElem
	).rowCoord
}

function findMinElemInF(
	G_STR: IMatrixElem[],
	F_STR: IMatrixElem[]
): IMatrixElem {
	const values = G_STR.slice(1)
		.map((item, index) => (!item.numerator ? F_STR[index + 1] : undefined))
		.filter(item => item) as IMatrixElem[]
  
	const minCol = findMinFraction(!values.length ? G_STR.slice(1) : values)
	return minCol
}

function findMinFraction(fractions: Array<IMatrixElem>): IMatrixElem {
	return fractions.reduce((minFraction, currentFraction) => {
		const minValue = minFraction.numerator / minFraction.denominator
		const currentValue = currentFraction.numerator / currentFraction.denominator

		return currentValue < minValue ? currentFraction : minFraction
	})
}

export function searchSolvableValue(
	matrix: Array<IMatrixElem[]>
): TSearchResult {

	const G_STR = matrix[matrix.length - 1]
	const F_STR = matrix[matrix.length - 2]
	const NEW_MATRIX = matrix.slice(0, matrix.length - 2)

	const MOST_NEGATIVE_NUMBER = findMinFraction(G_STR.slice(1))

	const colIndex = G_STR.indexOf(MOST_NEGATIVE_NUMBER)


	if (MOST_NEGATIVE_NUMBER.numerator < 0) {
		if(checkingForUnsolvability(NEW_MATRIX, colIndex)){
			return { status: 'Unsolvable' }
		}
		const row = findNesseccaryRow(NEW_MATRIX, colIndex)
		return {
			status: 'Solvable',
			elem: { row: row, col: colIndex, elem: NEW_MATRIX[row][colIndex] },
		}
	}

	const minCol = findMinElemInF(G_STR, F_STR)
	
	if (minCol.numerator >= 0) {
		return { status: 'Optimal' }
	}

	const minColIndex = F_STR.indexOf(minCol)
	
	if (checkingForUnsolvability(NEW_MATRIX, minColIndex)) {
		return { status: 'Unsolvable' }
	}

	
	const row = findNesseccaryRow(NEW_MATRIX, minColIndex)
	return {
		status: 'Solvable',
		elem: { row: row, col: minColIndex, elem: NEW_MATRIX[row][minColIndex] },
	}
}
