import readLines from '../FileReader';

class Graph{
    E : number = 0; // The number of edges
    adj : number[][][] = [];
    reverse_adj : number[][][] = [];
    edgeCounts : number[] = [];

    constructor(n : number = 1){
        this.setDataStructureSizes(n);
    }

    setDataStructureSizes(n : number){
        this.adj = [...Array(n)].map(x => []);
        this.reverse_adj = [...Array(n)].map(x => []);
        this.edgeCounts = [...Array(n)].map(x => 0);
    }

    /**
     * Add an edge to the graph, stored under its label and then src and target
     * @param from 
     * @param to 
     * @param edgeLabel 
     */
    addEdge(from: number, to: number, edgeLabel: number) : void {
        if(!this.adj[edgeLabel][from]) this.adj[edgeLabel][from] = [];
        if(!this.reverse_adj[edgeLabel][to]) this.reverse_adj[edgeLabel][to] = [];

        if(this.adj[edgeLabel][from].includes(to)) return;

        this.adj[edgeLabel][from].push(to);
        this.reverse_adj[edgeLabel][to].push(from);
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
        const headerPattern : RegExp = /((\d+),(\d+),(\d+))/; 
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
