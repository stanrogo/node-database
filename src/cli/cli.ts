/**
 * Run the main CLI to select a graph and a queries file
 */

import InputPaths from "../interfaces/InputPaths";

process.stdout.write('-------- Graph Database Project by Stanrogo --------\n');

function getInput(text: string): Promise<string> {
    return new Promise((resolve: (string) => void) => {
        process.stdout.write(text);
        process.stdin.once("data", (data: Buffer) =>{
            process.stdin.resume();
            resolve(data.toString().trim());
        });
    });
}

async function processInput(): Promise<InputPaths> {
    const graph = await getInput('Graph file (default: input/graph.nt): ') || './input/graph.nt';
    const queries = await getInput('Queries file (default: input/queries.csv): ') || './input/queries.csv';
    return { graph, queries }
}

export { processInput };
