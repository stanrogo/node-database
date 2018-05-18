/**
 * @file Bench.ts
 * @description Class to benchmark query estimation and evaluation time
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.1.0
 */

import Graph from '../graph/Graph';
import RPQTree from '../RPQTree';
import CardStat from '../interfaces/CardStat';
import Query from '../interfaces/Query';
import Evaluator from '../evaluation/Evaluator';
import Estimator from '../estimation/Estimator';
import FileUtility from '../FileUtility';
import Performance from "../Performance";

class Bench {
    g : Graph = null;
    est : Estimator = null;
    ev : Evaluator = null;
    queries: Query[] = [];

    /**
     * Load a single graph file into memory
     * @param {File} graphFile The graph file to load
     */
    public async loadGraph(graphFile : File) : Promise<any> {
        console.log('\n- Reading the graph into memory and preparing the estimator...');
        this.g = new Graph();
        await Performance.measurePerfAsync(
            'read the graph into memory',
            () => this.g.readFromContiguousFile(graphFile)
        );
    }

    /**
     * Load multiple queries, from file
     * @param {File} queryFile
     */
    public async loadQueries(queryFile : File) : Promise<any> {
        console.log('\n- Loading queries from file...');
        this.queries = [];
        await FileUtility.readLines(queryFile, (line) => {
            this.queries.push(Bench.queryFromString(line));
        });
    }

    /**
     * Load a single query into memory, in query form
     * @param {string} query
     */
    public loadQuery(query : string) : void {
        console.log('\n- Loading query:', query);
        this.queries = [Bench.queryFromString(query)];
    }

    /**
     * Measure preparation time for estimator and evaluator
     */
    public prepareComponents() : void {
        if(this.g === null) throw new Error('Graph not initialised!');

        console.log('\n- Preparing estimator and evaluation engine...');
        this.est = new Estimator(this.g);
        this.ev = new Evaluator(this.g, new Estimator(this.g));

        // Benchmark estimator preparation time
        Performance.measurePerf(
            'prepare the estimator',
            this.est.prepare.bind(this)
        );

        // Benchmark evaluator preparation time (including estimator prep)
        Performance.measurePerf(
            'prepare the evaluator',
            this.ev.prepare.bind(this)
        );
    }

    /**
     * Parse queries and run them one by one
     */
    public runQueries() : void {
        console.log('\n- Running the query workload...');
        if(this.queries.length === 0){
            throw new Error('No queries found!');
        }

        this.queries.forEach((query : Query) => {
            this.runQuery(query);
        });
    }

    /**
     * Benchmark the running of a single RPQ
     * @param {Query} query The query string to parse
     */
    private runQuery(query : Query) {
        const rpq : RPQTree = RPQTree.queryToTree(query);

        // Benchmark estimation results and time
        let estimate : CardStat;
        Performance.measurePerf(
            'estimate',
            () => {estimate = this.est.estimate(rpq);}
        );
        Bench.printResults('Estimation', estimate);

        // Benchmark evaluation results and time
        let actual : CardStat;
        Performance.measurePerf(
            'evaluate',
            () => {actual = this.ev.evaluate(rpq);}
        );
        Bench.printResults('Actual', actual);
    }

    /**
     * Take a query string and convert it to the Query format
     * @param {string} query
     * @returns {Query}
     */
    private static queryFromString(query : string) : Query {
        const edgePattern : RegExp = /(.+),(.+),(.+)/;
        const matches : RegExpExecArray = edgePattern.exec(query);

        if(matches.length === 0){
            throw new Error(`Invalid Query ${query}!`);
        }

        const s: string = matches[1];
        const path: string = matches[2];
        const t: string = matches[3];
        return  {s, path, t};
    }

    /**
     * Print statistics about obtained results to the console
     * @param type The type of result obtained e.g. estimate or actual
     * @param results The results object with statistics to print
     */
    private static printResults (type: string, results: CardStat) : void {
        console.log(
            `\n${type} (noOut, noPaths, noIn) :`,
            `(${results.noOut}, ${results.noPaths}, ${results.noIn})`
        );
    }
}

export default Bench;
