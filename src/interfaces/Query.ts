/**
 * @file Query.ts
 * @description Interface for how a query is represented
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

/*
 * A query is represented by:
 * - it's subject
 * - the path that needs to be taken between the two nodes
 * - the target node
 * 
 * In most cases, there will be no explicit target and subject nodes given.
 */
 
interface Query{
    s: string;
    path: string;
    t: string;
}

export default Query;