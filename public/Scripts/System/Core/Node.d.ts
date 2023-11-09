/** @class
 *  Datas structure of tree.
 *  @param {Node} parent - Parent of the node
 *  @param {any} data - Data of the node
 */
declare class Node {
    data: any;
    parent: Node;
    firstChild: Node;
    lastChild: Node;
    next: Node;
    constructor(parent: Node, data: any);
    /**
     * Add a new child.
     * @param data
     */
    add(data: any): Node;
    /**
     *  Check if this node is the root of the tree.
     *  @returns {boolean}
     */
    isRoot(): boolean;
    /**
     *  Get the next parent child
     *  @returns {Node}
     */
    getNext(): Node;
}
export { Node };
