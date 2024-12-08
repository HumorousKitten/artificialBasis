export class Fraction {
	numerator: number
	denominator: number

	constructor(numerator: number, denominator: number = 1) {
		if (denominator === 0) {
			throw new Error('Denominator cannot be zero.')
		}

		// Устанавливаем знак дроби в числитель
		if (denominator < 0) {
			numerator = -numerator
			denominator = -denominator
		}

		this.numerator = numerator
		this.denominator = denominator
		if(Number.isInteger(numerator)) this.simplify()
		else {
			const newFraction = Fraction.fromDecimal(this.numerator)
			this.numerator = newFraction.numerator
			this.denominator = newFraction.denominator
			this.simplify()
		}
	}

	// Нахождение НОД
	static gcd(a: number, b: number): number {
		return b === 0 ? a : Fraction.gcd(b, a % b)
	}

	// Упрощение дроби
	simplify(): void {
		const gcd = Fraction.gcd(
			Math.abs(this.numerator),
			Math.abs(this.denominator)
		)
		this.numerator /= gcd
		this.denominator /= gcd
	}

	// Сложение дробей
	add(other: Fraction): Fraction {
		const numerator =
			this.numerator * other.denominator + other.numerator * this.denominator
		const denominator = this.denominator * other.denominator

		return new Fraction(numerator, denominator)
	}

	// Вычитание дробей
	subtract(other: Fraction): Fraction {
		const numerator =
			this.numerator * other.denominator - other.numerator * this.denominator
		const denominator = this.denominator * other.denominator
		return new Fraction(numerator, denominator)
	}

	// Умножение дробей
	multiply(other: Fraction): Fraction {
		const numerator = this.numerator * other.numerator
		const denominator = this.denominator * other.denominator
		return new Fraction(numerator, denominator)
	}

	// Деление дробей
	divide(other: Fraction): Fraction {
		if (other.numerator === 0) {
			throw new Error('Cannot divide by zero.')
		}
		const numerator = this.numerator * other.denominator
		const denominator = this.denominator * other.numerator
		return new Fraction(numerator, denominator)
	}

	// Преобразование в строку
	toString(): string {
		return this.denominator === 1
			? `${this.numerator}`
			: `${this.numerator}/${this.denominator}`
	}

	// Преобразование в десятичное число
	toDecimal(): number {
		return this.numerator / this.denominator
	}

	// Преобразование строки в дробь
	fromString(str: string): Fraction {
		const [numerator, denominator = '1'] = str
			.split('/')
			.map(item => Number(item))

		// Приводим denominator в число, если это строка
		const denomNumber = denominator === '1' ? 1 : denominator

		return new Fraction(Number(numerator), denomNumber)
	}

	static fromDecimal(a: number): Fraction {
		if (Number.isInteger(a)) {
			// Если число целое, возвращаем его как дробь с знаменателем 1
			return new Fraction(a)
		}
		
		const decimalStr = a.toString()

		const [integerPart, fractionalPart] = decimalStr.split('.')

		// Количество цифр после запятой
		const decimalPlaces = fractionalPart.length

		// Числитель: преобразуем число в целое
		const numerator = (+integerPart >= 0) ? +integerPart * (10**decimalPlaces) + +fractionalPart :  -(-(+integerPart) * (10**decimalPlaces) + +fractionalPart)

		// Знаменатель: 10^количество цифр после запятой
		const denominator = 10**decimalPlaces

		return new Fraction(numerator, denominator)
	}
}
