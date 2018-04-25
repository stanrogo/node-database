/**
 * @file SingleGraph.ts
 * @description Simple representation of projections and joins
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

import Graph from './Graph';

class SingleGraph{
    E : number = 0;                         // Number of edges
    adj : Map<number, number[]>;            // Adjacency Matrix
    reverse_adj : Map<number, number[]>;    // Reverse Adjacency Matrix

    constructor() {
        this.adj = new Map();
        this.reverse_adj = new Map();
    }

    /**
     * Add an edge to the graph - source is array index with array of targets
     * @param from
     * @param to
     */
    addEdge(from: number, to: number) : void {
        // Initialise position in array to empty, if it doesn't exist yet
        let targetArr : number[] = this.adj.get(from);
        let sourceArr : number[] = this.reverse_adj.get(to);

        if(!targetArr) targetArr = [];
        if(!sourceArr) sourceArr = [];

        // Check for uniqueness
        if(targetArr.includes(to)) return;

        // Add the elements
        targetArr.push(to);
        sourceArr.push(from);
        this.adj.set(from, targetArr);
        this.reverse_adj.set(to, sourceArr);
        this.E++;
    }

    /**
     * Add a bunch of edges based on a label in one go
     * 
     * @param projectLabel The label on which to project
     * @param inverse True if an inverse edge match is used (e.g. O-)
     * @param inGraph The graph from which to add the edges
     */
    addEdges(projectLabel : number, inverse: boolean, inGraph : Graph){
        this.adj = inverse ? inGraph.reverse_adj[projectLabel] : inGraph.adj[projectLabel];
        this.reverse_adj = inverse ? inGraph.adj[projectLabel] : inGraph.reverse_adj[projectLabel];
        this.E = inGraph.edgeCounts[projectLabel];
    }
}

export default SingleGraph;
