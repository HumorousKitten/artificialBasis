import React, { FC } from 'react'
import cl from '../matrixInputForm.module.css'

interface IFuncForm {
	sizeMatrix: { row: number; col: number }
	setFuncValues: React.Dispatch<React.SetStateAction<number[]>>
	setIsFuncForm: React.Dispatch<React.SetStateAction<boolean>>
}

const FuncForm: FC<IFuncForm> = ({ sizeMatrix, setFuncValues, setIsFuncForm }) => {
	const { row, col } = sizeMatrix
	const funcValues: number[] = [0, ]


	const handleFuncValuesCreate = (index: number, value: string) => {
		funcValues[index] = +value
	}

	function handleCreateFuncValues() {
		setFuncValues(funcValues)
		setIsFuncForm(false)
	}

	return (
		<>
			<h2 className={cl.title}>Введите функцию</h2>
			<div className={cl.funcForm}>
				<div className={cl.funcValue}>
					{Array.from({ length: sizeMatrix.col }, (_, index) => (
						<label key={`constant-${index}`} className={cl.matrixLabel}>
							x{index + 1}:
							<input
								type='number'
								className={cl.matrixInput}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleFuncValuesCreate(index + 1, e.target.value)
								}
							/>
						</label>
					))}
				</div>
				<button
					className={cl.createMatrixBtn}
					type='button'
					onClick={handleCreateFuncValues}
				>
					Создать
				</button>
			</div>
		</>
	)
}

export default FuncForm
