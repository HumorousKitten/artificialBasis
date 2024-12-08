export interface IMatrixElem {
	numerator: number
	denominator: number
}

export interface IMatrixList {
	matrix: Array<IMatrixElem[]>
	xCols: number[]
	yCols: string[]
}

export type TresolvableElementCoord = { row: number; col: number, elem: IMatrixElem };

export type TSearchResult = { status: 'Unsolvable' | 'Optimal'} | { status: 'Solvable'; elem: TresolvableElementCoord };

export interface IFinalResult {
	status: 'Unsolvable' | 'Optimal' | 'NoSolutions' | ''
	f_result?: IMatrixElem
	xValues?: Array<[string, number | IMatrixElem]>
	yColsLength?: number
}