/**
 * @file FileReader.ts
 * @description A helper function to be able to read lines synch from files
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

import { openSync, readSync } from 'fs';

// Acquire the OS default line separator
const endOfLine = require('os').EOL;

/**
 * Read a file continuously into a set buffer frame size
 * @param fileName The name of the file to read from
 * @param processLine Function to call when reading a line
 * @param processHeader Function to call when having a header
 */
const readLines = (fileName: string, processLine : Function, processHeader ?: Function) : void => {
    const fd = openSync(fileName, 'r');
    const bufferSize = 1024;
    const buffer = new Buffer(bufferSize);
    let leftOver = '';
    let read, line, idxStart, idx, idx2;
    let header = true;

    while ((read = readSync(fd, buffer, 0, bufferSize, null)) !== 0) {
        leftOver += buffer.toString('utf8', 0, read + 1);
        idxStart = 0

        idx ;
        idx2 

        while (((idx = leftOver.indexOf(endOfLine, idxStart)) !== -1) || ((idx2 = leftOver.indexOf('\n', idxStart)) !== -1)) {
            idx = idx !== -1 ? idx : idx2;
            line = leftOver.substring(idxStart, idx);

            // We have a line, so now call the appropriate functions
            if(header && processHeader){
                processHeader(line);
            } else {
                processLine(line);
            }

            header = false;
            idxStart = idx + 1;
        }
        leftOver = leftOver.substring(idxStart);
    }
}

export default readLines;
