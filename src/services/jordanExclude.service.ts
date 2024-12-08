import { IMatrixElem, TresolvableElementCoord } from '../types/types'
import { Fraction } from './fraction.service'

export function jordanExclude(
	matrix: Array<IMatrixElem[]>,
	selectedElem: TresolvableElementCoord
): Array<IMatrixElem[]> {
	const newMatrix = matrix.map((rowElem, indexRow) => {
		return rowElem.map((colElem, indexCol) => {
			if (indexCol === selectedElem.col && indexRow === selectedElem.row) {
				return new Fraction(colElem.denominator, colElem.numerator)
			}
			if (indexCol === selectedElem.col) {
				return new Fraction(-colElem.numerator, colElem.denominator).divide(
					selectedElem.elem as Fraction
				)
			}
			if (indexRow === selectedElem.row) {
				return new Fraction(colElem.numerator, colElem.denominator).divide(
					selectedElem.elem as Fraction
				)
			}

			const currentElem = new Fraction(colElem.numerator, colElem.denominator)

			const multipliedElems = new Fraction(matrix[indexRow][selectedElem.col].numerator, matrix[indexRow][selectedElem.col].denominator).multiply(matrix[selectedElem.row as number][indexCol] as Fraction)

			const dividedElems = new Fraction(multipliedElems.numerator, multipliedElems.denominator).divide(selectedElem.elem as Fraction)

			return new Fraction(currentElem.numerator, currentElem.denominator).subtract(dividedElems)
		})
	})

	return newMatrix
}
