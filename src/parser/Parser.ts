import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'
import { SparqlLexer } from '../sparql/SparqlLexer';
import {
	SparqlParser,
	SelectQueryContext,
	WhereClauseContext,
	VarContext,
	TriplesBlockContext, IriRefContext
} from '../sparql/SparqlParser';
import { SparqlListener } from '../sparql/SparqlListener';
import QueryGraph from '../QueryGraph';
import QueryEdge from "../QueryEdge";

// Create the lexer and parser
let inputStream = CharStreams.fromString("SELECT ?x ?y WHERE { ?x owl:owns ?y }");
let lexer = new SparqlLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new SparqlParser(tokenStream);

// Parse the input, where `compilationUnit` is whatever entry point you defined
let tree = parser.query();

enum Clauses {
	SELECT,
	WHERE
}

enum TriplePos {
	SRC,
	PREDICATE,
	TRG
}

interface TempEdge {
	src: string;
	predicate: string;
	trg: string;
}

class EnterFunctionListener implements SparqlListener {
	private clause: Clauses;
	private positionInTriple: TriplePos;

	private queryGraph: QueryGraph;
	private queryEdge: TempEdge;

	public constructor() {
		this.queryGraph = new QueryGraph();
		this.queryEdge = { src: '', predicate: '', trg: ''};
	}

	public enterSelectQuery(context: SelectQueryContext): void {
		this.clause = Clauses.SELECT;
	}

	public enterWhereClause(context: WhereClauseContext): void {
		this.clause = Clauses.WHERE;
	}

	public enterTriplesBlock(context: TriplesBlockContext): void {
		this.positionInTriple = TriplePos.SRC;
		this.queryEdge = { src: '', predicate: '', trg: ''};
	}

	public exitTriplesBlock(context: TriplesBlockContext): void {
		const { src, predicate, trg } = this.queryEdge;
		this.queryGraph.addEdge(src, predicate, trg);
	}

	public enterVar(context: VarContext): void {
		if (this.clause === Clauses.SELECT) {
			this.queryGraph.addProjection(context.VAR1().text);
		}
		if (this.clause === Clauses.WHERE) {
			if (this.positionInTriple === TriplePos.SRC) {
				this.queryEdge.src = context.VAR1().text;
				this.positionInTriple = TriplePos.PREDICATE;
			}
			if (this.positionInTriple === TriplePos.TRG) {
				this.queryEdge.trg = context.VAR1().text;
			}
		}
	}

	public enterIriRef(context: IriRefContext): void {
		context.getToken(0, 1);
		if (this.clause === Clauses.WHERE) {
			if (this.positionInTriple === TriplePos.PREDICATE) {
				this.queryEdge.predicate = context.IRI_REF().text;
				this.positionInTriple = TriplePos.TRG;
			}
		}
	}
}

const listener: SparqlListener = new EnterFunctionListener();
ParseTreeWalker.DEFAULT.walk(listener, tree);
console.clear();