import Lexer from './lexer';

interface TokenData {
	value: string;
	id: string;
	line: number;
	column: number;
	length: number;
}
export default class Token implements TokenData {
	public value: string;
	public id: string;
	public line: number;
	public column: number;
	public length: number;
	private lexer: Lexer;

	public constructor(params: TokenData, ctx: Lexer) {
		this.lexer = ctx;
		this.set(params, false);
	}

	public setValue(newValue: string, update = true): Token {
		this.value = newValue;
		this.length = newValue.length;
		if (update) {
			this.lexer.update();
		}
		return this;
	}

	public moveTo(line?: number, column?: number, update = true): Token {
		line && (this.line = line);
		column && (this.column = column);
		if (update) {
			this.lexer.update();
		}
		return this;
	}

	public moveBy(line?: number, column?: number, update = true): Token {
		line && (this.line += line);
		column && (this.column += column);
		if (update) {
			this.lexer.update();
		}
		return this;
	}

	public set(params: Partial<TokenData>, update = true): Token {
		this.value = params.value || this.value;
		this.id = params.id || this.id;
		this.line = params.line || this.line;
		this.column = params.column || this.column;
		this.length = params.length || this.length;
		if (update) {
			this.lexer.update();
		}
		return this;
	}

	public remove(): void {
		this.value = undefined;
		this.id = undefined;
		this.line = undefined;
		this.column = undefined;
		this.length = undefined;
		this.lexer.update();
	}
}
