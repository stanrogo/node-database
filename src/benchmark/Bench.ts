/**
 * @file Bench.ts
 * @description Class to benchmark query estimation and evaluation time
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

import Graph from '../graph/Graph';
import RPQTree from '../RPQTree';
import CardStat from '../interfaces/CardStat';
import Query from '../interfaces/Query';
import Evaluator from '../evaluation/Evaluator';
import Estimator from '../estimation/Estimator';
import readLines from '../FileReader';

class Bench {
    graphFile : File;
    queriesFile : File;
    g : Graph;
    est : Estimator;
    ev : Evaluator;

    constructor(graphFile : File, queriesFile : File) {
        this.graphFile = graphFile;
        this.queriesFile = queriesFile;
    }

    /**
     * Main method to start benchmarking process
     */
    benchmark() : void {
        // Setup a new graph instance
        console.log('\n(1) Reading the graph into memory and preparing the estimator...');
        this.g = new Graph();

        // Read file into memory and measure time taken
        this.measurePerfAsync('read the graph into memory', () => {
            return new Promise((resolve) => {
                this.g.readFromContiguousFile(this.graphFile).then(() => {
                    resolve();
                });
            });
        }).then(() => {

            // Perform follow up tasks
            this.prepareComponents();
            this.runQueries();
            console.log(process.memoryUsage());
        });
    }

    /**
     * Measure preparation time for estimator and evaluator
     */
    prepareComponents() : void {
        this.est = new Estimator(this.g);
        this.ev = new Evaluator(this.g, new Estimator(this.g));

        // Benchmark estimator preparation time
        this.measurePerf('prepare the estimator', this.est.prepare.bind(this));

        // Benchmark evaluator preparation time (including estimator prep)
        this.measurePerf('prepare the evaluator', this.ev.prepare.bind(this));
    }

    /**
     * Parse queries and run them one by one
     */
    runQueries() : void {
        console.log('\n(2) Running the query workload...');
        this.parseQueries().then((queries: Query[]) => {
            queries.forEach((query : Query) => {
                const rpq : RPQTree = this.parseQueryToAST(query);
                this.runQuery(rpq);
            });
        });
    }

    /**
     * Benchmark the running of a single RPQ
     * @param rpq The regular path query to execute
     */
    runQuery(rpq : RPQTree) {
         // Benchmark estimation results and time
         let estimate : CardStat;
         this.measurePerf('estimate', () => {
            estimate = this.est.estimate(rpq);
         });
         this.printResults('Estimation', estimate);

         // Benchmark evaluation results and time
         let actual : CardStat;
         this.measurePerf('evaluate', () => {
            actual = this.ev.evaluate(rpq);
         });
         this.printResults('Actual', actual);
     }

     /**
      * Take a query and convert it into an RPQ Tree representation
      * @param query The query to convert
      */
    parseQueryToAST(query: Query) : RPQTree {
        console.log(`\nProcessing query: ${query.s},${query.path},${query.t}`);
        const queryTree : RPQTree = RPQTree.strToTree(query.path);
        console.log(`\nParsed query tree: ${queryTree.toString()}`);
        return queryTree;
    }

    /**
     * Print statistics about obtained results to the console
     * @param type The type of result obtained e.g. estimate or actual
     * @param results The results object with statistics to print
     */
    printResults (type: string, results: CardStat) : void {
        console.log(
            `\n${type} (noOut, noPaths, noIn) :`,
            `(${results.noOut}, ${results.noPaths}, ${results.noIn})`
        );
    }

    async measurePerfAsync(timeTo, callback) : Promise<any> {
        const label = `Time to ${timeTo}`;
        console.time(label);
        await callback();
        console.timeEnd(label);
    }

    measurePerf(timeTo, callback) : void {
        const label = `Time to ${timeTo}`;
        console.time(label);
        callback();
        console.timeEnd(label);
    }

    async parseQueries() : Promise<Query[]> {
        const queries : Query[] = [];
        const edgePattern : RegExp = /(.+),(.+),(.+)/;

        await readLines(this.queriesFile, (line) => {
            console.log(line);
            const match : RegExpExecArray = edgePattern.exec(line);
            if(match){
                const s : string = match[1];
                const path : string = match[2];
                const t : string = match[3];

                queries.push({ s, path, t });
            }
        });

        if(queries.length === 0){
            console.log('Did not parse any queries... Check query file.');
        }

        return queries;
    }
}

export default Bench;
