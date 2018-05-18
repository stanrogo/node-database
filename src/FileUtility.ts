/**
 * @file FileReader.ts
 * @description Utility to read files as well as retrieve them
 * @author Stanley Clark <me@stanrogo.com>
 * @version 0.1.0
 */

import LineReader from './LineReader';

class FileUtility{
    /**
     * Read an entire file and then split into lines.
     * @param {File} file The file object containing the data we need
     * @param {Function} processLine Function to call when reading a line
     * @param {Function} processHeader Function to call when having a header
     * @returns {Promise<null>}
     */
    static readLines (file : File, processLine : Function, processHeader ?: Function) : Promise<null> {
        return new Promise((resolve, reject) => {
            let header : boolean = true;
            const reader : LineReader = new LineReader(file);

            reader.readLines((line, next) => {
                if(header && processHeader){
                    processHeader(line);
                } else {
                    processLine(line);
                }
                header = false;
                next();
            }).then(() => {
                resolve();
            }).catch((err) => {
                console.log(err, err.stack);
                reject();
            });
        });
    };

    /**
     * Retrieve a file from a URL as a File object
     * @param {string} filePath
     * @returns {Promise<File|string>}
     */
    static retrieveFile (filePath: string) : Promise<File|string> {
        return new Promise((resolve, reject) => {
            fetch(filePath).then((response) => {
                return response.blob();
            }).then((blob) => {
                // Convert the file path to one without slashes
                const fileName = filePath.replace('/','_').slice(1);
                const file = new File([blob], fileName);
                resolve(file);
            }).catch((reason) => {
                reject(reason);
            });
        });
    };
}

export default FileUtility;