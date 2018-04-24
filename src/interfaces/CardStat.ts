/**
 * @file CardStat.ts
 * @description Interface for how statistics about results are stored
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */

 /*
  * We are mostly interested in the number of paths,
  * however, the number of out and in nodes is also appreciated.
  */

interface CardStat {
    noOut : number;
    noPaths: number;
    noIn : number;
}

export default CardStat;
