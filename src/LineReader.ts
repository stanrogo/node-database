/**
 * @file LineReader.ts
 * @description Utility to read lines from files, without having to load the entire file into memory
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.1.0
 */

class LineReader {
    private static chunkSize: number = 1024 * 4; // Chunk size to use for reading

    private readonly fileReader: FileReader; // Single file reader instance
    private readonly file: File; // The file to read
    private readonly events: Function[]; // Array of events to call
    private readPosition: number; // Position of read head
    private chunk: string; // Current chunk text contents
    private lines: string[]; // Array of current lines read

    constructor(file: File) {
        this.fileReader = new FileReader();
        this.readPosition = 0;
        this.chunk = '';
        this.lines = [];
        this.file = file;
        this.events = [];

        // Attach events to the file reader
        this.fileReader.onerror = () => {
            this.emit('error', [this.fileReader.error.message]);
        };
        this.fileReader.onload = this.onLoad.bind(this);
    }

    /**
     * Read all lines of the file and return when complete
     * @param {Function} callback Function to execute on every line read
     * @returns {Promise<void|string>}
     */
    public readLines(callback): Promise<void|string> {
        return new Promise((resolve : Function, reject : Function) => {
            this.on('line', (line) => {
                callback(line);
                this.step();
            });
            this.on('end', resolve);
            this.on('error', reject);
            this.read();
        });
    }

    /**
     * Operations to perform on a successful file reader load event
     */
    private onLoad() : void {
        // Store the processed text by appending it to any existing processed text
        this.chunk += this.fileReader.result;

        // If the processed text contains a newline character
        if (/\n/.test(this.chunk)) {
            // Split the text into an array of lines
            this.lines = this.chunk.split('\n');

            // If there is still more data to read, save the last line, as it may be incomplete
            if (this.hasMoreData()) this.chunk = this.lines.pop();

            // Start stepping through each line
            this.step();
            return;
        }
        // If the text did not contain a newline character,
        // start another round of the read process if there is still data to read
        if (this.hasMoreData()) return this.read();

        // If there is no data left to read, but there is still data stored in 'chunk',
        // emit it as a line
        if (this.chunk.length) return this.emit('line', [this.chunk]);

        // If there is no data stored in 'chunk', emit the end event
        this.emit('end');
    }

    /**
     * Read a single chunk
     */
    private read(): void {
        // Extract section of file for reading
        const blob: Blob = this.file.slice(this.readPosition, this.readPosition + LineReader.chunkSize);
        // Update current read position
        this.readPosition += LineReader.chunkSize;
        // Read the blob as text
        this.fileReader.readAsText(blob);
    }

    /**
     * Step through the current lines and emit them if found.
     *
     * If no new lines are found then:
     * - if we still have file data, continue reading
     * - if we do not, emit the end event
     */
    private step(): void {
        if (this.lines.length === 0 && this.hasMoreData()) {
            this.read();
        } else if (this.lines.length === 0 && !this.hasMoreData()){
            this.emit('end');
        } else {
            this.emit('line', [this.lines.shift()]);
        }
    }

    /**
     * Check if the read position is less than total file size, thus we have more data
     * @returns {boolean}
     */
    private hasMoreData(): boolean {
        return this.readPosition <= this.file.size;
    };

    /**
     * Subscribe to event
     * @param {string} eventName
     * @param {Function} callback
     */
    private on(eventName : string, callback : Function) {
        this.events[eventName] = callback;
    };

    /**
     * Emit event
     * @param {string} eventName
     * @param {string[]} args
     */
    private emit(eventName : string, args ?: string[]) {
        this.events[eventName].apply(this, args);
    };
}

export default LineReader;
