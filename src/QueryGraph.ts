import QueryEdge from "./QueryEdge";

class QueryGraph {
	private id: number;
	private dictionary: Map<string, number>;
	private projection: number[];
	private edges: QueryEdge[];

	public constructor() {
		this.id = 0;
		this.dictionary = new Map<string, number>();
		this.projection = [];
		this.edges = [];
	}
	
	public addProjection(name: string): void {
		this.projection.push(this.getIntRepresentation(name));
	}
	
	public addEdge(src: string, predicate: string, trg: string): void {
		const srcID: number = this.getIntRepresentation(src);
		const predicateID: number = this.getIntRepresentation(predicate);
		const trgID: number = this.getIntRepresentation(trg);
		this.edges.push(new QueryEdge(srcID, predicateID, trgID));
	}
	
	private getIntRepresentation(name: string): number {
		if (!this.dictionary.has(name)){
			this.dictionary.set(name, this.id++);
		}
		return this.dictionary.get(name);
	}
}

export default QueryGraph;
