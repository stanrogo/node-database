import Token from './token';

export interface GrammarStruct {
	id: string;
	match: string;
}

export default class Lexer {
	private index: number = 0;
	private expr: string = '';
	private regex?: RegExp;
	public tokens: Token[] = [];
	public column: number = 1;
	public line: number = 1;
	public data: string = '';
	public grammar: GrammarStruct[] = [
		{
			id: 'newline',
			match: '\\n'
		},
		{
			id: 'whitespace',
			match: '\\s'
		}
	];


	private getRegex(): RegExp {
		if (!this.regex) {
			this.regex = new RegExp(this.expr, 'gmu');
		}
		this.regex.lastIndex = this.index;
		return this.regex;
	}

	public loadDefinition(def: GrammarStruct): void {
		if (this.expr.length > 0) this.expr += '|';
		this.expr += `(${def.match})`;
		this.regex = undefined;
		this.grammar.push(def);
	}

	public loadGrammar(grammar: GrammarStruct[]): Lexer {
		grammar.forEach((def): void => this.loadDefinition(def));
		return this;
	}

	public loadData(data: string): Lexer {
		this.data += data;
		return this;
	}

	public next(): Token {
		const regex = this.getRegex();
		const match = regex.exec(this.data);
		if (match) {
			const length = match[0].length;
			const token = this.grammar[match.indexOf(match[0], 1) - 1];
			const id = token.id;
			this.index += length;
			this.tokens.push(
				new Token(
					{
						column: this.column,
						line: this.line,
						value: match[0],
						length,
						id
					},
					this
				)
			);
			if (id === 'newline') {
				this.column = 1;
				this.line += 1;
			} else if (id === 'whitespace') {
				this.column += 1;
			} else {
				this.column += length;
			}
			return this.tokens[this.tokens.length - 1];
		}
	}

	public processAll(): Token[] {
		for (let i = 0; i < Infinity; i += 1) {
			const token = this.next();
			if (!token) break;
		}
		return this.tokens;
	}

	public update(): Lexer {
		this.tokens = this.tokens
			.filter((token) => token.value && token.value !== '')
			.sort((a, b) => {
				const line = a.line - b.line;
				const column = a.column - b.column;
				return line === 0 ? column : line;
			})
			.map((token, index, tokens) => {
				if (index > 0) {
					const previous = tokens[index - 1];
					if (previous.id === 'newline') {
						return token.moveTo(previous.line + 1, 1, false);
					}
					return token.moveTo(
						previous.line,
						previous.column + previous.length,
						false
					);
				}
				return token.moveTo(1, 1, false);
			});

		return this;
	}

	public empty(): Lexer {
		this.data = '';
		this.line = 1;
		this.column = 1;
		this.index = 0;
		this.tokens = [];
		return this;
	}
}
