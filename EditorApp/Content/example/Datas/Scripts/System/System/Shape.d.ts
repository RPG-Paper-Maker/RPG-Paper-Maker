import { Enum } from "../Common/index.js";
import CustomShapeKind = Enum.CustomShapeKind;
import { Base } from "./Base.js";
import { CustomGeometry } from "../Core/index.js";
/** @class
 *  A shape of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  shape
 *  @param {CustomShapeKind} [kind=CustomShapeKin] - The kind of custom shape
 */
declare class Shape extends Base {
    static loader: import("three").FileLoader;
    id: number;
    kind: CustomShapeKind;
    name: string;
    isBR: boolean;
    dlc: string;
    base64: string;
    mesh: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>;
    geometry: Record<string, any>;
    constructor(json?: Record<string, any>, kind?: CustomShapeKind);
    /**
     *  Assign the default members.
     *  @param {any[]} args
     */
    setup(args: any[]): void;
    /**
     *  Get string of custom shape kind.
     *  @param {CustomShapeKind} kind - The custom shape kind
     *  @returns {string}
     */
    static customShapeKindToString(kind: CustomShapeKind): string;
    /**
     *  Parse the .obj text.
     *  @param {string } - text
     *  @returns {Record<string, any>}
     */
    static parse(text: string): Record<string, any>;
    /**
     *  Get the folder associated to a kind of custom shape.
     *  @static
     *  @param {CustomShapeKind} kind - The kind of custom shape
     *  @param {boolean} isBR - Indicate if the shape is a BR
     *  @param {string} dlc - The dlc name
     *  @returns {string}
     */
    static getFolder(kind: CustomShapeKind, isBR: boolean, dlc: string): string;
    /**
     *  Get the local folder associated to a kind of custom shape.
     *  @param {CustomShapeKind} kind - The kind of custom shape
     *  @returns {string}
     */
    static getLocalFolder(kind: CustomShapeKind): string;
    /**
     *  Read the JSON associated to the shape
     *  @param {Record<string, any>} - json Json object describing the shape
     */
    read(json: Record<string, any>): void;
    /**
     *  Load the .obj.
     */
    load(): Promise<void>;
    /**
     *  Get the absolute path associated to this picture.
     *  @returns {string}
     */
    getPath(): string;
}
export { Shape };
