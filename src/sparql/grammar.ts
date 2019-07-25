// https://dev.to/areknawo/lexing-in-js-style--b5e
// https://tomassetti.me/parsing-in-javascript/#useful
// https://www.w3.org/TR/rdf-sparql-query/#introduction
// https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb

import { GrammarStruct } from './lexer';

const grammar: GrammarStruct[] = [
	{
		id: 'char',
		match: `(?<=(?:(?:\\b|^)["'\`])|[\\x00-\\x7F])[\\x00-\\x7F](?=(?:[\\x00-\\x7F]+)?["'\`](?:\\b|$))`
	},
];

export default grammar;
