class QueryEdge {
	public src: number;
	public predicate: number;
	public trg: number;

	public constructor(src: number, predicate: number, trg: number) {
		this.src = src;
		this.predicate = predicate;
		this.trg = trg;
	}
}

export default QueryEdge;
