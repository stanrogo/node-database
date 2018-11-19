/**
 * Class to benchmark query estimation and evaluation time
 */

import Graph from '../graph/graph';
import RpqTree from '../rpqTree';
import CardStat from '../interfaces/CardStat';
import Query from '../interfaces/Query';
import Evaluator from '../evaluation/evaluator';
import Estimator from '../estimation/estimator';
import FileUtility from '../fileUtility';
import Performance from "../performance";

class Bench {
    private g : Graph = null;
    private est : Estimator = null;
    private ev : Evaluator = null;
    private queries: Query[] = [];

    /**
     * Load a single graph file into memory
     * @param graphFile The graph file to load
     */
    public async loadGraph(graphFile : string) : Promise<any> {
        console.log('\n- Reading the graph into memory and preparing the estimator...');
        this.g = new Graph();
        await Performance.measurePerformance(
            'read the graph into memory',
            () => this.g.readFromContiguousFile(graphFile)
        );
    }

    /**
     * Load multiple queries, from file
     * @param queryFile
     */
    public async loadQueries(queryFile : string) : Promise<void> {
        console.log('\n- Loading queries from file...');
        this.queries = [];
        await FileUtility.readLines(queryFile, (line) => {
            const query : Query = Bench.queryFromString(line);
            if(query === null) return;
            this.queries.push(query);
        });
    }

    /**
     * Load a single query into memory, in query form
     * @param {string} queryString
     */
    public loadQuery(queryString : string) : void {
        console.log('\n- Loading query:', queryString);
        const query : Query = Bench.queryFromString(queryString);
        if(query === null) return;
        this.queries = [query];
    }

    /**
     * Measure preparation time for estimator and evaluator
     */
    public async prepareComponents() : Promise<void> {
        if(this.g === null) throw new Error('Graph not initialised!');

        console.log('\n- Preparing estimator and evaluation engine...');
        this.est = new Estimator(this.g);
        this.ev = new Evaluator(this.g, new Estimator(this.g));

        // Benchmark estimator preparation time
        await Performance.measurePerformance(
            'prepare the estimator',
            this.est.prepare.bind(this)
        );

        // Benchmark evaluator preparation time (including estimator prep)
        await Performance.measurePerformance(
            'prepare the evaluator',
            this.ev.prepare.bind(this)
        );
    }

    /**
     * Parse queries and run them one by one
     */
    public async runQueries() : Promise<void> {
        console.log('\n- Running the query workload...');
        if(this.queries.length === 0){
            throw new Error('No queries found!');
        }

        for (const query of this.queries) {
            await this.runQuery(query);
        }
    }

    /**
     * Benchmark the running of a single RPQ
     * @param {Query} query The query string to parse
     */
    private async runQuery(query : Query): Promise<void> {
        console.log(`\n`);
        const rpq : RpqTree = RpqTree.queryToTree(query);

        // Benchmark estimation results and time
        let estimate : CardStat;
        await Performance.measurePerformance(
            'estimate',
            () => {estimate = this.est.estimate(rpq);}
        );
        Bench.printResults('Estimation', estimate);

        // Benchmark evaluation results and time
        let actual : CardStat;
        await Performance.measurePerformance(
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
            console.log(`Invalid Query ${query}!`);
            return null;
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
            `${type} (noOut, noPaths, noIn) :`,
            `(${results.noOut}, ${results.noPaths}, ${results.noIn})`
        );
    }
}

export default Bench;
