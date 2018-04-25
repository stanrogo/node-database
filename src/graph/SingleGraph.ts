/**
 * @file SingleGraph.ts
 * @description Simple representation of projections and joins
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

import Graph from './Graph';

class SingleGraph{
    E : number = 0;                         // Number of edges
    adj : Map<number, Uint32Array>;            // Adjacency Matrix
    reverse_adj : Map<number, Uint32Array>;    // Reverse Adjacency Matrix

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
        let targetArr : Uint32Array = this.adj.get(from);
        let sourceArr : Uint32Array = this.reverse_adj.get(to);

        if(!targetArr){
            targetArr = new Uint32Array(1);
            targetArr[0] = to;
        } else {
            const newArr : Uint32Array = new Uint32Array(targetArr.length + 1);
            newArr.set(targetArr);
            targetArr = newArr;
        }

        if(!sourceArr){
            sourceArr = new Uint32Array(1);
            sourceArr[0] = to;
        } else {
            const newArr : Uint32Array = new Uint32Array(sourceArr.length + 1);
            newArr.set(sourceArr);
            sourceArr = newArr;
        }

        // Check for uniqueness
        if(targetArr.includes(to)) return;

        // Add the elements
        targetArr[targetArr.length - 1] = to;
        sourceArr[sourceArr.length - 1] = from;
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
