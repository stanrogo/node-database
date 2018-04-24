/**
 * @file SingleGraph.ts
 * @description Simple representation of projections and joins
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

import Graph from './Graph';

class SingleGraph{
    E : number = 0;                    // Number of edges
    adj : number[][] = [];             // Adjacency Matrix
    reverse_adj : number[][] = [];     // Reverse Adjacency Matrix

    /**
     * Add an edge to the graph - source is array index with array of targets
     * @param from
     * @param to
     * @param edgeLabel
     */
    addEdge(from: number, to: number, edgeLabel: number) : void {
        // Initialise position in array to empty, if it doesn't exist yet
        if(!this.adj[from]) this.adj[from] = [];
        if(!this.reverse_adj[to]) this.reverse_adj[to] = [];

        // Check for uniqueness
        if(this.adj[from].includes(to)) return;

        // Add the elements
        this.adj[from].push(to);
        this.reverse_adj[to].push(from);
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
