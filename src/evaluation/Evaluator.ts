import Estimator from '../estimation/Estimator';
import Graph from '../graph/Graph';
import SingleGraph from '../graph/SingleGraph';
import RPQTree from '../RPQTree';
import CardStat from '../interfaces/CardStat';

class Evaluator{
    graph : Graph;
    est : Estimator;

    constructor(g : Graph, e: Estimator){
        this.graph = g;
        this.est = e;
    }

    prepare(){
        if (this.est !== null) this.est.prepare();
    }

    computeStats(g : SingleGraph) : CardStat {
        return {
            noIn : g.adj.size,
            noPaths : g.E, // No duplicates, so distinct amount of edges
            noOut : g.reverse_adj.size,
        };
    }

    project(projectLabel : number, inverse: boolean, inGraph : Graph) : SingleGraph {
        const outGraph : SingleGraph = new SingleGraph();
        outGraph.addEdges(projectLabel, inverse, inGraph);
        return outGraph;
    }

    /**
     * Perform a join between two graphs
     * 
     * When performing a join, we know that the two graphs will only
     * contain one label each.
     * @param left 
     * @param right 
     */
    join(left : SingleGraph, right : SingleGraph) : SingleGraph {
        const outGraph : SingleGraph = new SingleGraph();
        left.adj.forEach((leftTargets, leftSource) => {
            leftTargets.forEach((leftTarget) => {
                const rightTargets = right.adj.get(leftTarget);
                if(!rightTargets) return;
                rightTargets.forEach((rightTarget) => {
                    outGraph.addEdge(leftSource, rightTarget);
                });
            });
        });

        return outGraph;
    }

    evaluate_aux(q : RPQTree) : SingleGraph {

        // evaluate according to the AST bottom-up
    
        if(q.isLeaf) {
            // project out the label in the AST
            const directLabel : RegExp = /((\d+)\+)/;
            const inverseLabel : RegExp = /((\d+)\-)/;
            let label : number;
            let inverse : boolean;

            let directMatch : RegExpExecArray = directLabel.exec(q.data);
            let inverseMatch : RegExpExecArray = inverseLabel.exec(q.data);
            if (directMatch !== null) {
                label = parseInt(directMatch[1], 10);
                inverse = false;
            } else if (inverseMatch !== null) {
                label = parseInt(inverseMatch[1], 10);
                inverse = true;
            } else {
                console.log('Label parsing failed!');
                return null;
            }
    
            return this.project(label, inverse, this.graph);
        }
    
        if(q.isConcat) {
    
            // evaluate the children
            const leftGraph : SingleGraph = this.evaluate_aux(q.left);
            const rightGraph : SingleGraph = this.evaluate_aux(q.right);
    
            // join left with right
            return this.join(leftGraph, rightGraph);
    
        }
    
        return null;
    }

    evaluate(query : RPQTree) : CardStat {
        const res : SingleGraph = this.evaluate_aux(query);
        return this.computeStats(res);
    }
}

export default Evaluator;
