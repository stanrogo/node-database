/**
 * @file Main.ts
 * @description The main database file, from which evaluation is done
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

import Bench from './benchmark/Bench';
import { retrieveFile } from './FileReader';
import './Console.ts';


async function runDefault(){
    const graphPath : string = './input/synthetic_graph.nt';
    const queriesPath : string = './input/synthetic_queries.csv';

    const graphFile : File = await retrieveFile(graphPath);
    const queriesFile : File = await retrieveFile(queriesPath);

    const benchmark : Bench = new Bench(graphFile, queriesFile);
    benchmark.benchmark();
}

// Export in the webpack style, in order to have access to global variables
module.exports = {
    runDefault
};
