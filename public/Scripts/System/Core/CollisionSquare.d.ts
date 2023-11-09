/** @class
 *  A collision settings in a texture square.
*/
declare class CollisionSquare {
    rect: number[];
    left: boolean;
    right: boolean;
    top: boolean;
    bot: boolean;
    terrain: number;
    climbing: boolean;
    constructor();
    /**
     *  Union of the collision squares.
     *  @static
     *  @param {number[][]} squares - All the squares and their corresponding
     *  rects
     *  @param {number} l - The squares numbers
     *  @param {number} w - The number of squares width
     *  @param {number} h - The number of squares height
     *  @returns {number[][]}
     */
    static unionSquares(squares: number[][], l: number, w: number, h: number): number[][];
    /**
     *  Get the BB according to rect and size.
     *  @static
     *  @param {number[]} rect - The rect
     *  @param {number} w - The number of squares width
     *  @param {number} h - The number of squares height
     */
    static getBB(rect: number[], w: number, h: number): number[];
    /**
     * Read the JSON associated to the collision square.
     *
     * @param {Record<string, any>} json  - Json object describing the collision square
     * @memberof CollisionSquare
     */
    read(json: Record<string, any>): void;
    /**
     *  Indicate if all the direction are OK.
     *  @returns {boolean}
     */
    hasAllDirections(): boolean;
}
export { CollisionSquare };
