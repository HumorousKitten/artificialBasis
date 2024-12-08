import React, { FC } from 'react'
import { jordanExclude } from '../../services/jordanExclude.service'
import { searchSolvableValue } from '../../services/selectMatrixElem.service'
import { searchSameElements } from '../../services/searchSameElements.service'
import {
	IFinalResult,
	IMatrixElem,
	IMatrixList,
	TSearchResult,
} from '../../types/types'
import st from './matrix.module.css'

interface IMatrixProps {
	matrix: Array<IMatrixElem[]>
	setMatrixSolutions: React.Dispatch<React.SetStateAction<IMatrixList[]>>
	xCols: number[]
	yCols: string[]
	initialYcols: React.MutableRefObject<string[]>
	setFinalAnswer: React.Dispatch<React.SetStateAction<IFinalResult>>
}

const Matrix: FC<IMatrixProps> = ({
	matrix,
	setMatrixSolutions,
	xCols,
	yCols,
	initialYcols,
	setFinalAnswer,
}) => {
	const [solvableValue, setSolvableValue] = React.useState<
		TSearchResult | { status: '' }
	>({ status: '' })

	React.useEffect(() => {
		setSolvableValue(searchSolvableValue(matrix))
	}, [])

	React.useEffect(() => {
		if (solvableValue.status === 'Solvable') {
			const newMatrix = jordanExclude(matrix, solvableValue.elem)

			const newYCols = yCols.map((item, index) =>
				index === solvableValue.elem.row ? `X${xCols[solvableValue.elem.col - 1]}=` : item
			)
			const newXCols = xCols.map((item, index) =>
				index === solvableValue.elem.col - 1
					? +yCols[solvableValue.elem.row].replace(/X|=/g, '')
					: item
			)

			setMatrixSolutions(prevState => {
				return [
					...prevState,
					{
						matrix: newMatrix,
						xCols: newXCols,
						yCols: newYCols,
					},
				]
			})
		}

		

		if (solvableValue.status === 'Unsolvable'){
			setFinalAnswer({
				status: 'Unsolvable',
			})
			return
		}
		
		if(searchSameElements(initialYcols.current, yCols)){
			setFinalAnswer({
				status: 'Unsolvable',
			})
			return 
		}
		if (solvableValue.status === 'Optimal') {
			const xResult = new Map()
			xCols.forEach(item => xResult.set(`X${item}`, 0))
			const yValues = matrix.slice(0, matrix.length - 2).map(row => {
				return row[0]
			})

			yCols.forEach((item, index) => xResult.set(item, yValues[index]))
			const sortedMap = new Map(
				Array.from(xResult.entries()).sort(
					(a, b) => +a[0].match(/\d+/) - b[0].match(/\d+/)
				)
			)

			setFinalAnswer({
				status: 'Optimal',
				f_result: matrix.slice(matrix.length - 2, matrix.length - 1)[0][0],
				xValues: Array.from(sortedMap),
				yColsLength: yCols.length
			})
			return
		}
	}, [solvableValue.status])

	return (
		<div className={st.jordanTable}>
			<div className={st.nulls}>
				<div></div>
				{yCols.map((item, index) => (
					<div key={'RowId: ' + index}>{item}</div>
				))}

				<div>F</div>
				<div>g</div>
			</div>

			<div
				className={st.matrix}
				style={{
					gridTemplateColumns: `repeat(${matrix[0].length}, 50px)`,
				}}
			>
				<div className={`${st.gridElement} ${st.constantsColor}`}>1</div>

				{xCols.map(item => (
					<div
						className={`${st.gridElement} ${st.constantsCol}`}
						key={'ColId: ' + item}
					>
						-X{item}
					</div>
				))}

				{matrix.map((rowElem, indexRow) =>
					rowElem.map((colElem, indexCol) => (
						<div
							className={`${st.gridElement}  
								${!indexCol ? '' : st.constantsCol}
								${!indexCol ? st.constantsColor : ''}
								${
									solvableValue.status === 'Solvable'
										? solvableValue.elem.row === indexRow &&
										  solvableValue.elem.col === indexCol
											? st.selectGridElem
											: ''
										: ''
								}
							`}
							key={'RowId: ' + indexRow + ' / ' + 'ColId: ' + indexCol}
						>
							<span style={{ display: 'none' }}>
								Координаты матрицы: {indexRow} | {indexCol}
							</span>
							<span>
								{colElem.numerator}{' '}
								{colElem.denominator !== 1 ? ' / ' + colElem.denominator : null}
							</span>
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default Matrix
