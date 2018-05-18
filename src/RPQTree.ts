/**
 * @file RPQTree.ts
 * @description Representation of a query as an AST
 * @author Stanley Clark<me@stanrogo.com>
 * @version 0.0.1
 */
import Query from "./interfaces/Query";

class RPQTree{
    data: string;
    left: RPQTree;
    right: RPQTree;

    constructor(data: string, left: RPQTree, right: RPQTree){
        this.data = data;
        this.left = left;
        this.right = right;
    }

    /**
     * Take a query and convert it into an RPQ Tree representation
     * @param {Query} query The query to convert
     * @returns {RPQTree}
     */
    public static queryToTree(query : Query) : RPQTree {
        console.log(`\nProcessing query: ${query.s},${query.path},${query.t}`);
        const rpq : RPQTree = RPQTree.strToTree(query.path);
        console.log(`\nParsed query tree: ${rpq.toString()}`);
        return rpq;
    }

    /**
     * Take a path, and convert this into an RPQ Tree representation
     * @param str The chain join path to parse
     */
    static strToTree(str : string) : RPQTree {
        const query : string = str.replace(" ", ""); // Remove spaces
        const charArr : string[] = [...query]; // Explode into characters
        let level : number = 0; // Inside parentheses check

        // Check if we have a query enclosed in brackets - '(...)'
        if (charArr[0] === '(' && charArr[charArr.length - 1] === ')') {
            // Pull out the inside of the () and run strToTree again
            const exp: string = query.substring(1, charArr.length - 1);
            return RPQTree.strToTree(exp);
        }
    
        // Attempt to find the right most '/' not inside '()' and split on this
        for(let i : number = charArr.length - 1; i >= 0; i--){
            const c : string = charArr[i];

            if (c === ')') {
                level++;
                continue;
            }

            if (c === '(') {
                level--;
                continue;
            }

            if (level > 0) {
                continue;
            }

            if (c === '/') {
                const left : string = query.substring(0, i);
                const right : string = query.substring(i + 1);
                const payload : string = c;
                return new RPQTree(
                    payload, 
                    RPQTree.strToTree(left), 
                    RPQTree.strToTree(right)
                );
            }
        }
    
        // Otherwise, the current query should not have any joins
        return new RPQTree(str, null, null);
    }

    /**
     * Print the contents of the RPQTree in a readable way
     */
    toString() : string {
        let res = '';

        if (this.isLeaf) {
            res = ` ${this.data} `;
        } else {
            res = `(${this.data} `;
            if(this.left !== null) res += this.left.toString();
            if(this.right !== null) res += this.right.toString();
            res += ')';
        }

        return res;
    }

    /**
     * Check if the root node is a join between two other nodes
     */
    get isConcat() : boolean {
        return this.data === "/" && this.isBinary;
    }

    /**
     * Check if both children have values
     */
    get isBinary() : boolean {
        return this.left !== null && this.right !== null;
    }

    /**
     * Check if only the left child has a value
     */
    get isUnary() : boolean {
        return this.left !== null && this.right === null;
    }

    /**
     * Check if this node has no children
     */
    get isLeaf() : boolean {
        return this.left === null && this.right === null;
    }
}

export default RPQTree;
