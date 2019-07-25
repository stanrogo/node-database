import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'
import { SparqlLexer } from '../sparql/SparqlLexer';
import { SparqlParser, QueryContext } from '../sparql/SparqlParser';
import { SparqlListener } from '../sparql/SparqlListener';

// Create the lexer and parser
let inputStream = CharStreams.fromString("SELECT ?x ?y WHERE { ?x owl:owns ?y }");
let lexer = new SparqlLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new SparqlParser(tokenStream);

// Parse the input, where `compilationUnit` is whatever entry point you defined
let tree = parser.query();

class EnterFunctionListener implements SparqlListener {
	public enterQuery(context: QueryContext): void {
		console.log(`Function start line number ${context._start.line}`)
	}
}

const listener: SparqlListener = new EnterFunctionListener();
ParseTreeWalker.DEFAULT.walk(listener, tree);