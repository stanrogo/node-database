/**
 * @file Main.ts
 * @description The main database entry point
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.2.0
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
const defaultGraphPath : string = './input/synthetic_graph.nt';

/**
 * Upload a graph into memory based on the given default file
 *
 * Once the graph is loaded, the estimator and evaluator components
 * are prepared for use as well.
 */
function uploadDefault() : void {
    FileUtility.retrieveFile(defaultGraphPath).then((graphFile : File) => {
        benchmark.loadGraph(graphFile).then(() => {
            benchmark.prepareComponents();
        });
    }).catch((reason) => {
        console.log(reason);
    });
}

/**
 * Upload a custom graph file, based on a file selection event
 * @param {Event} event
 */
function uploadCustom(event : Event) : void {
    const filePicker : HTMLInputElement = <HTMLInputElement> event.target;
    const files: FileList = filePicker.files;
    const file : File = files.item(0); // We only support 1 file at a time
    benchmark.loadGraph(file).then(() => {
        benchmark.prepareComponents();
    });
}

/**
 * Run a single query based on the value of the input of the submitted form
 * @param {event} event The form submit event
 */
function runQuery(event : Event) : void {
    event.preventDefault();
    const form : HTMLFormElement = <HTMLFormElement> event.target;
    const query : string = form[0].value;
    benchmark.loadQuery(query);
    benchmark.runQueries();
}

// Export in the webpack style, in order to have access to global variables
module.exports = {
    uploadDefault,
    uploadCustom,
    runQuery
};
