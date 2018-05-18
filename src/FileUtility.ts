/**
 * @file FileReader.ts
 * @description Utility to read files as well as retrieve them
 * @author Stanley Clark <me@stanrogo.com>
 * @version 0.1.0
 */

class FileUtility{
    /**
     * Read an entire file and then split into lines.
     * TODO: make the file reading process more efficient by asynchronously reading in chunks
     * @param {File} file The file object containing the data we need
     * @param {Function} processLine Function to call when reading a line
     * @param {Function} processHeader Function to call when having a header
     * @returns {Promise<null>}
     */
    static readLines (file : File, processLine : Function, processHeader ?: Function) : Promise<null> {
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
    static retrieveFile (filePath: string) : Promise<File> {
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