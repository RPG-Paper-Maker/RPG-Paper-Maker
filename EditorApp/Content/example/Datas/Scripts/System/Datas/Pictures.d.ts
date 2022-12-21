import { System } from "../index.js";
import { Enum } from "../Common/index.js";
import PictureKind = Enum.PictureKind;
import { Picture2D } from "../Core/index.js";
/** @class
*   All the pictures datas.
*   @static
*/
declare class Pictures {
    private static list;
    constructor();
    /**
     *  Read the JSON file associated to pictures.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the corresponding picture.
     *  @param {PictureKind} kind - The picture kind
     *  @param {number} id - The picture id
     *  @returns {Picture}
     */
    static get(kind: PictureKind, id: number): System.Picture;
    /**
     *  Get the corresponding picture list by kind.
     *  @param {PictureKind} kind - The picture kind
     *  @returns {Picture}
     */
    static getListByKind(kind: PictureKind): System.Picture[];
    /** Get a copy of the picture 2D.
    *   @param {PictureKind} kind - The picture kind
    *   @param {number} id - The picture id
    *   @returns {Picture2D}
    */
    static getPictureCopy(kind: PictureKind, id: number): Picture2D;
}
export { Pictures };
