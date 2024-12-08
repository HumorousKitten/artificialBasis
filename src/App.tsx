import React from 'react'
import './App.css'
import MatrixInputForm from './components/formMatrix/MatrixInputForm'
import Matrix from './components/matrix/Matrix'
import { IFinalResult, IMatrixElem, IMatrixList } from './types/types'

/*
	TODO:
		1) Написать функцию для выбора разрешающего элемента согласно правилам
			Note: 
			Функция принимает матрицу, 
			в нулевом столбце она не ищет,
			среди последней строки выбирает самый отрицательный элемент
			исходя из координат этого элемента, ищет строку, где при делении константы на значение в координатном столбце будет наименьшее значение
			берет это значение и возвращает его

			Если отрицательных элементов не найдено, тогда смотрит элементы с нулями, если иx нет то план оптимален, если есть, то смотрим над ними элементы и если они отрицательны, то выбираем самый отрицательный и повторяем все до жордана и его в том числе, иначе если все значения неотрицательны, то план оптимален

			Если все элементы в координатном столбце равны нулю или отрицательны, то задача неразрешима (Done)


		2) Функция жордана (Done)

		3) Выделить зеленым цветом разрешающий элемент (Done)
		4) Рализовать пересчет матрицы жорданом (Done)
		5) Поменять местами нужный yCol с xCol (Done)
		6) сохранить полученное решение в список всех решений (матрицу и все y, x колонки) (Done)
		7) При необходимости вывести нужное решение (примерные решения описаны в файле selectMatrixElem)(Done)
		8) Сделать форму для ввода функции, размера матрицы, элементов матрицы 
		9) Научить программу самому высчитывать в самом начале G функцию
		10) Получить данные из формы и записать итоговую таблицу в первое решение в App
		11) Добавить логгирование, если изначально матрица будет пустая
*/

// const [matrixSolutions, setMatrixSolutions] = React.useState<IMatrixList[]>([
// 	{
// 		matrix: [
// 			[3, 1, -4, 2, -5, 9],
//       [6, 0, 1, -3, 4, -5],
//       [1, 0, 1, -1, 1, -1],
// 			[0, 2, 6, -5, -1, 4],
// 			[-10, 1, 2, 2, 0, 3]
// 		].map(row => row.map(col => new Fraction(col).fromDecimal())),
// 		xCols: new Array(5).fill(0).map((_, index) => index + 1),
// 		yCols: new Array(3).fill(0).map((_, index) => 'X' + (index + 6) + '='),
// 	},
// ])

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
						<h3>Задача не имеет решений</h3>
					</div>
				) : null}
			</section>
		</main>
	)
}

export default App
