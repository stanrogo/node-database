/**
 * @file Main.ts
 * @description The main database entry point
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.1.0
 *
 * The application can do three things:
 * - Upload a graph database file into browser memory
 * - Run a query, complete with estimation and evaluation time reports
 * - Run a full benchmark with any of the provided graph + query file pairs
 *
 * Future applications may involve letting the user add additional
 * query entries and therefore instigate local file writing. However, this is
 * for a moment that is very far in the future.
 */

import Bench from './benchmark/Bench';
import FileUtility from './FileUtility';
import './Console.ts';

const benchmark : Bench = new Bench();

function uploadDefault() : void {
    const graphPath : string = './input/synthetic_graph.nt';
    FileUtility.retrieveFile(graphPath).then((graphFile : File) => {
        benchmark.loadGraph(graphFile).then(() => {
            benchmark.prepareComponents();
        });
    });
}

function runQuery(query : string) : void {
    benchmark.loadQuery(query);
    benchmark.runQueries();
}

// Export in the webpack style, in order to have access to global variables
module.exports = {
    uploadDefault,
    runQuery
};
