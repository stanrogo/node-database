/**
 * @file Performance.ts
 * @description Measure time taken to perform a certain function
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.1.0
 *
 * This can be synchronous or asynchronous
 */

class Performance{
    /**
     * Measure performance for an async action
     * @param {string} timeTo Description of action
     * @param {Function} callback The async function to execute
     * @returns {Promise}
     */
    public static async measurePerfAsync(timeTo : string, callback : Function) : Promise<any> {
        const label = `Time to ${timeTo}`;
        performance.mark('start');
        await callback();
        Performance.recordPerformance(label);
    }

    /**
     * Measure performance for a synchronous action
     * @param {string} timeTo
     * @param {Function} callback
     */
    public static measurePerf(timeTo : string, callback : Function) : void {
        const label = `Time to ${timeTo}`;
        performance.mark('start');
        callback();
        Performance.recordPerformance(label);
    }

    /**
     * Log how long a particular action took
     * @param {string} label The name of the action
     */
    private static recordPerformance(label : string) : void {
        performance.mark('end');
        performance.measure(label, 'start', 'end');
        const measure : PerformanceEntry = performance.getEntriesByName(label)[0];
        console.log(label, measure.duration, 'ms');
        performance.clearMarks();
        performance.clearMeasures();
    }
}

export default Performance;