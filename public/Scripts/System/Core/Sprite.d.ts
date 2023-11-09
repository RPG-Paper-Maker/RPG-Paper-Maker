import { Enum } from '../Common/index.js';
import ElementMapKind = Enum.ElementMapKind;
import { MapElement, StructMapElementCollision } from './MapElement.js';
import { Position } from './Position.js';
import { Core } from '../index.js';
import { Vector3 } from './Vector3.js';
import { Vector2 } from './Vector2.js';
import { CustomGeometry } from './CustomGeometry.js';
import { CustomGeometryFace } from './CustomGeometryFace.js';
/** @class
 *  A sprite in the map.
 *  @extends MapElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  sprite
 */
declare class Sprite extends MapElement {
    static MODEL: Core.Vector3[];
    static Y_AXIS: Core.Vector3;
    static X_AXIS: Core.Vector3;
    static Z_AXIS: Core.Vector3;
    kind: ElementMapKind;
    textureRect: number[];
    constructor(json?: Record<string, any>);
    /**
     *  Create a new sprite.
     *  @static
     *  @param {ElementMapKind} kind - The element map kind
     *  @param {number[]} texture - Texture UV coords
     */
    static create(kind: ElementMapKind, texture: number[]): Sprite;
    /**
     *  Rotate a vertex around a specified center.
     *  @static
     *  @param {Vector3} vec - The vertex to rotate
     *  @param {Vector3} center - The center to rotate around
     *  @param {number} angle - The angle in degree
     *  @param {Vector3} axis - The vector axis
     */
    static rotateVertex(vec: Vector3, center: Vector3, angle: number, axis: Vector3, isDegree?: boolean): void;
    /** Rotate the four vertices of a sprite around a specified center.
     *   @static
     *   @param {Vector3} vecA - The A vertex to rotate
     *   @param {Vector3} vecB - The B vertex to rotate
     *   @param {Vector3} vecC - The C vertex to rotate
     *   @param {Vector3} vecD - The D vertex to rotate
     *   @param {Vector3} center - The center to rotate around
     *   @param {number} angle - The angle in degree
     *   @param {Vector3} axis - The vector axis
     */
    static rotateSprite(vecA: Vector3, vecB: Vector3, vecC: Vector3, vecD: Vector3, center: Vector3, angle: number, axis: Vector3): void;
    /**
     *  Add a static sprite to the geometry.
     *  @static
     *  @param {THREE.Geometry} geometry - The geometry
     *  @param {Vector3} vecA - The A vertex
     *  @param {Vector3} vecB - The B vertex
     *  @param {Vector3} vecC - The C vertex
     *  @param {Vector3} vecD - The D vertex
     *  @param {Vector2} texA- The texture face A
     *  @param {Vector2} texB - The texture face B
     *  @param {number} count - The faces count
     *  @returns {number}
     */
    static addStaticSpriteToGeometry(geometry: CustomGeometry, vecA: Core.Vector3, vecB: Vector3, vecC: Vector3, vecD: Vector3, texA: Vector2, texB: Vector2, texC: Vector2, texD: Vector2, count: number): number;
    /**
     *  Update the geometry associated to this.
     *  @param {Core.CustomGeometry} geometry - The geometry
     *  @param {number} width - The total texture width
     *  @param {number} height - The total texture height
     *  @param {number[]} position - The position
     *  @param {number} count - The faces count
     *  @param {boolean} tileset - Indicate if the texture is tileset
     *  @param {Vector3} localPosition - The local position
     *  @returns {any[]}
     */
    updateGeometry(geometry: CustomGeometry | CustomGeometryFace, width: number, height: number, position: Position, count: number, tileset: boolean, localPosition: Vector3): [number, StructMapElementCollision[]];
    /**
     *  Create the geometry associated to this sprite
     *  @param {number} width - The texture total width
     *  @param {number} height - The texture total height
     *  @param {boolean} tileset - Indicate if the texture is tileset
     *  @param {Position} position - The position
     *  @returns {any[]}
     */
    createGeometry(width: number, height: number, tileset: boolean, position: Position): [CustomGeometry, [number, StructMapElementCollision[]]];
    /**
     *  Read the JSON associated to the sprite.
     *  @param {Record<string, any>} - json Json object describing the sprite
     */
    read(json: Record<string, any>): void;
}
export { Sprite };
