/**
 * Utility to read files and retrieve them
 */

import * as fs from 'fs';
import { ReadLine, createInterface } from 'readline';

class FileUtility {

    /**
     * Read an entire file and then split into lines.
     * @param file The file object containing the data we need
     * @param processLine Function to call when reading a line
     * @param processHeader Function to call when having a header
     */
    static readLines (file: string, processLine : (string) => void, processHeader ?: (string) => void) : Promise<null> {
        return new Promise((resolve) => {
            let header : boolean = true;
            const lineReader: ReadLine = createInterface({
                input: fs.createReadStream(file),
            });

            lineReader.on('line', (line) => {
                if(header && processHeader){
                    processHeader(line);
                } else {
                    processLine(line);
                }
                header = false;
            });

            lineReader.on('close', () => {
                resolve();
            });
        });
    };
}

export default FileUtility;