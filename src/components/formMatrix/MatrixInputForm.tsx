import React from 'react'
import { IMatrixElem } from '../../types/types'
import FuncForm from './funcForm/FuncForm'
import cl from './matrixInputForm.module.css'
import SizeForm from './sizeForm/SizeForm'
import { Fraction } from '../../services/fraction.service'

interface IsizeMatrix {
	row: number
	col: number
}

interface ImatrixInputFormProps {
	setInitialExpandedMatrix: React.Dispatch<
		React.SetStateAction<IMatrixElem[][]>
	>
	setIsMatrixForm: React.Dispatch<React.SetStateAction<boolean>>
}

const MatrixInputForm: React.FC<ImatrixInputFormProps> = ({
	setInitialExpandedMatrix,
	setIsMatrixForm,
}) => {
	const [sizeMatrix, setSizeMatrix] = React.useState<IsizeMatrix>({
		row: 0,
		col: 0,
	})

	const [isSizeForm, setIsSizeForm] = React.useState<boolean>(true)
	const [isFuncForm, setIsFuncForm] = React.useState<boolean>(false)

	const [matrix, setMatrix] = React.useState<number[][]>([])

	const [constants, setConstants] = React.useState<number[]>([])
	const [funcValues, setFuncValues] = React.useState<number[]>([])


	React.useEffect(() => {
		if (isSizeForm || isFuncForm) return
		const initialMatrix = Array.from({ length: sizeMatrix.row }, () =>
			Array(sizeMatrix.col).fill(0)
		)

		const initialConstants: number[] = new Array(sizeMatrix.row).fill(0)

		setMatrix(initialMatrix)
		setConstants(initialConstants)
	}, [isSizeForm, isFuncForm])

	//разобраться с заполнением матрицы
	function handleCreateMatrix(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		const initialMatrix: Array<IMatrixElem[]> = matrix.map((row, rowIndex) =>
			[constants[rowIndex], ...row].map((col, colIndex) => new Fraction(col))
		)

		initialMatrix.push(funcValues.map(item => new Fraction(item)))
		initialMatrix.push(createGfuncElems(initialMatrix))
		setInitialExpandedMatrix(initialMatrix)
		setIsMatrixForm(false)
	}

	function createGfuncElems(matrix: Array<IMatrixElem[]>) {
		let G_FUNC = matrix[0]
		
		matrix.slice(1, matrix.length - 1).forEach(row => {
			G_FUNC = row.map((col,index) => {
				return new Fraction(G_FUNC[index].numerator, G_FUNC[index].denominator).add(col as Fraction)
			})
		})
		return G_FUNC.map(item => new Fraction(item.numerator, item.denominator).multiply({numerator: -1, denominator: 1} as Fraction))
	}

	const handleMatrixCreate = (
		indexRow: number,
		indexCol: number,
		value: string
	) => {
		setMatrix(prev => {
			const updatedMatrix = [...prev]
			updatedMatrix[indexRow][indexCol] = +value
			return updatedMatrix
		})
	}

	const handleConstantsCreate = (index: number, value: string) => {
		setConstants(prev => {
			const updatedConstants = [...prev]
			updatedConstants[index] = +value
			return updatedConstants
		})
	}

	return (
		<form className={cl.matrixForm}>
			{isSizeForm ? (
				<SizeForm
					setSizeMatrix={setSizeMatrix}
					setIsSizeForm={setIsSizeForm}
					setIsFuncForm={setIsFuncForm}
				/>
			) : isFuncForm ? (
				<FuncForm sizeMatrix={sizeMatrix} setFuncValues={setFuncValues} setIsFuncForm = {setIsFuncForm}/>
			) : (
				<>
					<h2 className={cl.title}>Введите значения матрицы и констант</h2>
					<div className={cl.matrixFormValues}>
						<div className={cl.matrixContainer}>
							<div className={cl.matrixGroup}>
								<h3>Значения матрицы:</h3>
								<div
									className={cl.matrixGrid}
									style={{
										gridTemplateColumns: `repeat(${sizeMatrix.col}, 1fr)`,
									}}
								>
									{Array.from({ length: sizeMatrix.row }, (_, indexRow) => {
										return Array.from(
											{ length: sizeMatrix.col },
											(_, indexCol) => (
												<label
													key={`row: ${indexRow}, col: ${indexCol}`}
													className={cl.matrixLabel}
												>
													x{indexCol + 1}:
													<input
														type='number'
														className={cl.matrixInput}
														onChange={(
															e: React.ChangeEvent<HTMLInputElement>
														) =>
															handleMatrixCreate(
																indexRow,
																indexCol,
																e.target.value
															)
														}
													/>
												</label>
											)
										)
									})}
								</div>
							</div>

							<div className={cl.constantsGroup}>
								<h3>Значения констант:</h3>
								<div className={cl.constantsGrid}>
									{Array.from({ length: sizeMatrix.row }, (_, index) => (
										<label key={`constant-${index}`} className={cl.matrixLabel}>
											<input
												type='number'
												className={cl.matrixInput}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													handleConstantsCreate(index, e.target.value)
												}
											/>
										</label>
									))}
								</div>
							</div>
						</div>
						<button
							className={cl.createMatrixBtn}
							type='button'
							onClick={handleCreateMatrix}
						>
							Создать
						</button>
					</div>
				</>
			)}
		</form>
	)
}

export default MatrixInputForm
