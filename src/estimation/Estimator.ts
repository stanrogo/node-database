/**
 * @file Estimator.ts
 * @description The estimator, which returns cardinality estimates for a query
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

import Graph from '../graph/Graph';
import RPQTree from '../RPQTree';
import CardStat from '../interfaces/CardStat';

class Estimator{
    graph : Graph;

    constructor(g: Graph) {
        this.graph = g;
    }

    prepare() : void {

    }

    estimate(q : RPQTree) : CardStat {
        return { noOut: 0, noPaths: 0, noIn: 0};
    }
}

export default Estimator;
