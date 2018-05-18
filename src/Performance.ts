/**
 * @file Performance.ts
 * @description Measure time taken to perform a certain function
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.1.0
 *
 * This can be synchronous or asynchronous
 */

class Performance{
    public static async measurePerfAsync(timeTo : string, callback : Function) : Promise<any> {
        const label = `Time to ${timeTo}`;
        performance.mark('start');
        await callback();
        Performance.recordPerformance(label);
    }

    public static measurePerf(timeTo : string, callback : Function) : void {
        const label = `Time to ${timeTo}`;
        performance.mark('start');
        callback();
        Performance.recordPerformance(label);
    }

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