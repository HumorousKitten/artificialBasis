import React from 'react'
import './App.css'
import MatrixInputForm from './components/formMatrix/MatrixInputForm'
import Matrix from './components/matrix/Matrix'
import { IFinalResult, IMatrixElem, IMatrixList } from './types/types'

function App() {
	const [isMatrixForm, setIsMatrixForm] = React.useState<boolean>(true)
	const [initialExpandedMatrix, setInitialExpandedMatrix] = React.useState<
		Array<IMatrixElem[]>
	>([])

	const [matrixSolutions, setMatrixSolutions] = React.useState<IMatrixList[]>([
		{
			matrix: [],
			xCols: [],
			yCols: [],
		},
	])

	const [finalAnswer, setFinalAnswer] = React.useState<IFinalResult>({
		status: '',
	})

	const initialYcols = React.useRef<string[]>([])

	React.useEffect(() => {
		if (!initialExpandedMatrix.length) return
		initialYcols.current = new Array(initialExpandedMatrix.length - 2)
			.fill(0)
			.map((_, index) => 'X' + (index + initialExpandedMatrix[0].length) + '=')

		setMatrixSolutions([
			{
				matrix: initialExpandedMatrix,
				xCols: new Array(
					initialExpandedMatrix.length ? initialExpandedMatrix[0].length - 1 : 0
				)
					.fill(0)
					.map((_, index) => index + 1),
				yCols: initialYcols.current,
			},
		])
	}, [initialExpandedMatrix])

	return (
		<main className='App'>
			{isMatrixForm ? (
				<MatrixInputForm
					setInitialExpandedMatrix={setInitialExpandedMatrix}
					setIsMatrixForm={setIsMatrixForm}
				/>
			) : matrixSolutions[0].matrix.length ? (
				matrixSolutions.map((item, index) => (
					<Matrix
						matrix={item.matrix}
						key={index}
						setMatrixSolutions={setMatrixSolutions}
						xCols={item.xCols}
						yCols={item.yCols}
						initialYcols={initialYcols}
						setFinalAnswer={setFinalAnswer}
					/>
				))
			) : null}

			<section className='finalAnswer'>
				{finalAnswer.status === 'Unsolvable' ? (
					<div>
						<h3>Задача неразрешима</h3>
					</div>
				) : finalAnswer.status === 'Optimal' ? (
					<div>
						<h3>Оптимальный план задачи</h3>
						<p>
							x = (
							{finalAnswer.xValues?.map(item => (
								<span key={item[0]}>
									{typeof item[1] === 'number'
										? item[1]
										: item[1].denominator === 1
										? item[1].numerator
										: item[1].numerator + '/' + item[1].denominator}
									,
								</span>
							))}
							) в R{finalAnswer.xValues?.length}
						</p>
						<p>
							f(x) ={' '}
							{finalAnswer.f_result?.denominator === 1
								? finalAnswer.f_result?.numerator
								: finalAnswer.f_result?.numerator +
								  ' / ' +
								  finalAnswer.f_result?.denominator}
						</p>
						<p>
							тогда решение задачи x = (
							{finalAnswer.xValues
								?.slice(
									0,
									finalAnswer.yColsLength
										? finalAnswer.xValues.length - finalAnswer.yColsLength
										: 0
								)
								.map(item => (
									<span key={item[0]}>
										{typeof item[1] === 'number'
											? item[1]
											: item[1].denominator === 1
											? item[1].numerator
											: item[1].numerator + '/' + item[1].denominator}
										,
									</span>
								))}
							) в R
							{finalAnswer.yColsLength && finalAnswer.xValues
								? finalAnswer.xValues?.length - finalAnswer.yColsLength
								: null}
						</p>
					</div>
				) : finalAnswer.status === 'NoSolutions' ? (
					<div>
						<h3>Задача не имеет решения</h3>
						<p>Начальный оптимальный план: </p>
						<p>
							x = (
							{finalAnswer.xValues?.map(item => (
								<span key={item[0]}>
									{typeof item[1] === 'number'
										? item[1]
										: item[1].denominator === 1
										? item[1].numerator
										: item[1].numerator + '/' + item[1].denominator}
									,
								</span>
							))}
							) в R{finalAnswer.xValues?.length}
						</p>
					</div>
				) : null}
			</section>
		</main>
	)
}

export default App
