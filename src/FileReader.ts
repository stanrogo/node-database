/**
 * @file FileReader.ts
 * @description A helper function to be able to read lines synch from files
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

/**
 * Read an entire file and then split into lines.
 * TODO: make the file reading process more efficient by asynchronously reading in chunks
 * @param file The file object containing the data we need
 * @param processLine Function to call when reading a line
 * @param processHeader Function to call when having a header
 */
const readLines = (file : File, processLine : Function, processHeader ?: Function) : Promise<null> => {

    return new Promise((resolve) => {

        const reader : FileReader = new FileReader();
        let header = true;
        reader.onload = function(){

            const lines : string[] = this.result.split('\n');
            for(let line : number = 0; line < lines.length; line++){

                // We have a line, so now call the appropriate functions
                if(header && processHeader){

                    processHeader(lines[line]);
                } else {

                    processLine(lines[line]);
                }

                header = false;
            }

            resolve();
        };
        reader.readAsText(file);
    });
};

/**
 * Retrieve a file from a URL as a File object
 * @param {string} filePath
 * @returns {Promise<File>}
 */
const retrieveFile = (filePath: string) : Promise<File> => {

    return new Promise((resolve, reject) => {
        fetch(filePath).then((response) => {

            return response.blob();
        }).then((blob) => {

            const file = new File([blob], filePath.replace('/','_').slice(1));
            resolve(file);
        }).catch((reason) => {

            reject(reason);
        });
    });
};

export { retrieveFile, readLines as default };