import { FC } from 'react'
import cl from '../matrixInputForm.module.css'
import React from 'react'

type TErrorMessage = {
	rowMessage: string
	colMessage: string
}

interface IsizeMatrix {
	row: number
	col: number
}

interface ISizeFormProps {
	setSizeMatrix: React.Dispatch<React.SetStateAction<IsizeMatrix>>
	setIsSizeForm:  React.Dispatch<React.SetStateAction<boolean>>
	setIsFuncForm: React.Dispatch<React.SetStateAction<boolean>>
}

const SizeForm: FC<ISizeFormProps> = ({setSizeMatrix, setIsSizeForm, setIsFuncForm}) => {
	const [isError, setIsError] = React.useState<TErrorMessage>({
		rowMessage: '',
		colMessage: '',
	})


	function wrongInputValue(message: string) {
		return {
			message: message,
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		try {
			if (!+value) {
				throw wrongInputValue('значение не может быть нулевым')
			}

			setIsError(prev => ({ ...prev, [`${name}Message`]: '' }))

			setSizeMatrix(prev => ({
				...prev,
				[name]: +value,
			}))
		} catch (error) {
			setIsError(prev => ({ ...prev, [`${name}Message`]: error.message }))
		}
	}

	const handleCreateMatrixForm = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (isError.colMessage || isError.rowMessage) return

		setIsSizeForm(false)
		setIsFuncForm(true)
	}


	return (
		<>
			<h2 className={cl.title}>Введите размерность матрицы</h2>
			<div className={cl.sizeMatrixForm}>
				<div className={cl.sizeInputs}>
					<label htmlFor='rows'>
						<span>Количество строк: </span>
						<input type='number' name='row' onChange={handleInputChange} />
						{isError.rowMessage ? (
							<p className={cl.errorMessage}>{isError.rowMessage}</p>
						) : null}
					</label>

					<label htmlFor='cols'>
						<span>Количество столбцев: </span>
						<input type='number' name='col' onChange={handleInputChange} />
						{isError.colMessage ? (
							<p className={cl.errorMessage}>{isError.colMessage}</p>
						) : null}
					</label>
				</div>
				<button
					className={`${
						isError.rowMessage || isError.colMessage ? cl.errorBtn : ''
					} ${cl.createMatrixBtn}`}
					onClick={handleCreateMatrixForm}
					type='button'
				>
					Создать
				</button>
			</div>
		</>
	)
}

export default SizeForm
