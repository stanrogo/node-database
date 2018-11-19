/**
 * Measure time taken to perform a certain function
 */

class Performance{

    /**
     * Measure performance for an action
     * @param timeTo Description of action
     * @param callback The async function to execute
     */
    public static async measurePerformance(timeTo : string, callback : Function) : Promise<void> {
        const label = `Time to ${timeTo}`;
        console.time(label);
        await callback();
        console.timeEnd(label);
    }
}

export default Performance;