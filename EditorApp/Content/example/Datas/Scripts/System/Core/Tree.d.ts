import { Node } from "./Node.js";
/** @class
 *  Datas structure of tree.
 *  @param {any} data - The data
 */
declare class Tree {
    root: Node;
    /**
     * The data of the visual tree.
     * @param {any} data
     */
    constructor(data: any);
    /**
     * Add a new child.
     * @param {Record<string, any>} - data
     * @returns {Node}
     */
    add(data: Record<string, any>): Node;
}
export { Tree };
