import { Enum } from "../Common/index.js";
import { System } from "../index.js";
import CustomShapeKind = Enum.CustomShapeKind;
/** @class
 *  All the shapes datas.
 *  @static
 */
declare class Shapes {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to shapes.
     */
    static read(): Promise<void>;
    /**
     *  Get the corresponding shape
     *  @param {CustomShapeKind} kind - The shape kind
     *  @param {number} id - The shape id
     *  @returns {System.Shape}
     */
    static get(kind: CustomShapeKind, id: number): System.Shape;
}
export { Shapes };
