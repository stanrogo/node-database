/**
 * Start the database application
 */

import { processInput } from './cli/cli';
import InputPaths from './interfaces/InputPaths';
import Bench from './benchmark/bench';

async function main(): Promise<void> {
    const input: InputPaths = await processInput();
    const benchmark: Bench = new Bench();
    await benchmark.loadGraph(input.graph);
    await benchmark.loadQueries(input.queries);
    await benchmark.prepareComponents();
    await benchmark.runQueries();
}

main();
