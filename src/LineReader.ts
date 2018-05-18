/**
 * @file LineReader.ts
 * @description Utility to read lines from files, without having to load the entire file into memory
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.2.0
 */

class LineReader {
    static chunkSize : number = 1024 * 4;

    fileReader : FileReader; // Single file reader instance
    readPosition : number; // Position of read head
    chunk : string;
    lines : string[];
    fileLength : number; // The length of the file in bytes
    file : File; // The file to read
    events : Function[]; // Array of events to call

    constructor(file : File){
        this.fileReader = new FileReader();
        this.readPosition = 0;
        this.chunk = '';
        this.lines = [];
        this.fileLength = file.size;
        this.file = file;
        this.events = [];

        // Attach events to the file reader
        this.fileReader.onerror = () => {this.emit('error', [ this.fileReader.error ]);};
        this.fileReader.onload = this.onLoad.bind(this);
    }

    private onLoad(){

        // Store the processed text by appending it to any existing processed text
        this.chunk += this.fileReader.result;

        // If the processed text contains a newline character
        if ( /\n/.test(this.chunk) ) {
            // Split the text into an array of lines
            this.lines = this.chunk.split('\n');

            // If there is still more data to read, save the last line, as it may be incomplete
            if ( this.hasMoreData() ) {
                this.chunk = this.lines.pop();
            }

            // Start stepping through each line
            this.step();
        }
        // If the text did not contain a newline character
        else {

            // Start another round of the read process if there is still data to read
            if ( this.hasMoreData() ) {
                return this.read();
            }

            // If there is no data left to read, but there is still data stored in 'chunk', emit it as a line
            if ( this.chunk.length ) {
                return this.emit('line', [
                    this.chunk,
                    this.emit.bind(this, 'end')
                ]);
            }

            // If there is no data stored in 'chunk', emit the end event
            this.emit('end');
        }
    }

    /**
     * Read all lines of the file and return when complete
     * @param {Function} callback Function to execute on every line read
     * @returns {Promise<any>}
     */
    readLines(callback) : Promise<any> {
        return new Promise((resolve) => {
            this.on('line', callback);
            this.on('end', resolve);
            this.read();
        });
    }

    /**
     * Read a single chunk
     */
    read() : void {
        // Extract section of file for reading
        const blob : Blob = this.file.slice(this.readPosition, this.readPosition + LineReader.chunkSize);

        // Update current read position
        this.readPosition += LineReader.chunkSize;

        // Read the blob as text
        this.fileReader.readAsText(blob);
    }

    private hasMoreData() : boolean {
        return this.readPosition <= this.fileLength;
    };

    public on(eventName, callback) {
        this.events[eventName] = callback;
    };

    private emit (event, args ?: any[]) {
        const boundEvents = this.events;

        if ( typeof boundEvents[event] === 'function' ) {
            boundEvents[event].apply(this, args);
        }
    };

    private step() : void {
        /**
         * If there are no lines left to emit and there is still
         * data left to read, start the read process again,
         * otherwise, emit the 'end' event
         */
        if (this.lines.length === 0) {
            if ( this.hasMoreData() ) {
                this.read();
                return;
            }
            this.emit('end');
            return;
        }

        /**
         * If the reading process hasn't been aborted, emit the
         * first element of the line array and pass in '_step'
         * for the user to call when they are ready for the
         * next line. We have to bind '_step' to 'this', otherwise
         * it will be in the wrong scope when the user calls it
         */

        this.emit('line', [
            this.lines.shift(),
            this.step.bind(this)
        ]);
    };
}

export default LineReader;
