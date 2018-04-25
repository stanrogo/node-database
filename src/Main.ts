/**
 * @file Main.ts
 * @description The main database file, from which evaluation is done
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

import Bench from './benchmark/Bench';

const graphFile : string = './input/graph_local.nt';
const queriesFile : string = './input/queries_local.csv';

const benchmark : Bench = new Bench(graphFile, queriesFile);
benchmark.benchmark();
