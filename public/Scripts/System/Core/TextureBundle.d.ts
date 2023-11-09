/** @class
 *  Several textures in a single file.
 */
declare class TextureBundle {
    list: any[][];
    material: THREE.MeshPhongMaterial;
    beginID: number;
    beginPoint: number[];
    endID: number;
    endPoint: number[];
    isAnimated: boolean;
    constructor();
    /**
     *  Set the begining texture.
     *  @param {number} id - The begining texture ID
     *  @param {number[]} point - The begining texture point offset
     */
    setBegin(id: number, point: number[]): void;
    /**
     *  Set the ending texture.
     *  @param {number} id - The ending texture ID
     *  @param {number[]} point - The ending texture point offset
     */
    setEnd(id: number, point: number[]): void;
    /**
     *  Check which point is on top.
     *  @param {number[]} rect
     *  @param {number[]} point
     *  @returns {boolean}
     */
    isSup(rect: number[], point: number[]): boolean;
    /**
     *  Check which point is on bot.
     *  @param {number[]} rect
     *  @param {number[]} point
     *  @returns {boolean}
     */
    isInf(rect: number[], point: number[]): boolean;
    /**
     *  Check if a couple (id, rect) is inside this texture.
     *  @param {number} id
     *  @param {number[]} rect
     *  @returns {boolean}
     */
    isInTexture(id: number, rect?: number[]): boolean;
    /**
     *  Add a couple (id, point) inside the list.
     *  @param {number} id
     *  @param {number[]} point
     */
    addToList(id: number, point: number[]): void;
    /**
     *  Get the offset of couple (id, rect).
     *  @param {number} id
     *  @param {number[]} rect
     *  @returns {number}
     */
    getOffset(id: number, rect: number[]): number;
}
export { TextureBundle };
