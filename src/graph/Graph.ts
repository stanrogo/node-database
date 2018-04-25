import readLines from '../FileReader';

class Graph{
    E : number = 0; // The number of edges
    adj : Array<Map<number, number[]>>;
    reverse_adj : Array<Map<number, number[]>>;
    edgeCounts : Uint32Array;

    constructor(n : number = 1){
        this.setDataStructureSizes(n);
    }

    /**
     * Initialise sizes of all datastructures used
     * @param numLabels The number of labels in the graph
     */
    setDataStructureSizes(numLabels : number){
        this.adj = [...Array(numLabels)].map(x => new Map());
        this.reverse_adj = [...Array(numLabels)].map(x => new Map());
        this.edgeCounts = new Uint32Array(numLabels);
    }

    /**
     * Add an edge to the graph, stored under its label and then src and target
     * @param from 
     * @param to 
     * @param edgeLabel 
     */
    addEdge(from: number, to: number, edgeLabel: number) : void {

        let targetArr : number[] = this.adj[edgeLabel].get(from);
        let sourceArr : number[] = this.reverse_adj[edgeLabel].get(to);

        if(!targetArr) targetArr = [];
        if(!sourceArr) sourceArr = [];

        if(targetArr.includes(to)) return;

        targetArr.push(to);
        sourceArr.push(from);
        this.adj[edgeLabel].set(from, targetArr);
        this.reverse_adj[edgeLabel].set(to, sourceArr);
        this.E++;
        this.edgeCounts[edgeLabel]++;
    }

    /**
     * Wrapper function to read lines from the graph
     * @param fileName The name of the file to read
     */
    readFromContiguousFile(fileName: string) : void {
        readLines(fileName, this.processLine.bind(this), this.processHeader.bind(this));
    }

    /**
     * Try to read in a header of the form: noNodes, noEdges, noLabels
     * @param line The header line to read in
     */
    processHeader(line : string) : void {
        const headerPattern : RegExp = /(\d+),(\d+),(\d+)/; 
        const match : RegExpExecArray = headerPattern.exec(line);

        if(!match){
            throw new Error(`Invalid graph header! Got: ${line}`);
        }

        const noLabels : number = parseInt(match[3], 10);
        this.setDataStructureSizes(noLabels);
    }

    /**
     * Try to read in a single edge of the graph as: subject, predicate, object
     * @param line The line containing the edge to read in
     */
    processLine(line : string) {
        const edgePattern : RegExp = /(\d+)\s(\d+)\s(\d+)\s\./;
        const match : RegExpExecArray = edgePattern.exec(line);
        if(match){
            const subject : number = parseInt(match[1], 10);
            const predicate : number = parseInt(match[2], 10);
            const object : number = parseInt(match[3], 10);
            this.addEdge(subject, object, predicate);
        }
    }
}

export default Graph;
