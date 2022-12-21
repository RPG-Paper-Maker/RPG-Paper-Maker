import { MapElement } from "./index.js";
import { System, Core } from "../index.js";
import { Position } from "./Position.js";
import { TextureBundle } from "./TextureBundle.js";
import { Vector3 } from "./Vector3.js";
import { CustomGeometry } from "./CustomGeometry.js";
/**
 * A mountain in the map.
 *
 * @class Mountain
 * @extends {MapElement}
 */
declare class Mountain extends MapElement {
    static X_LEFT_OFFSET: number;
    static X_MID_OFFSET: number;
    static X_RIGHT_OFFSET: number;
    static X_MIX_OFFSET: number;
    static Y_TOP_OFFSET: number;
    static Y_MID_OFFSET: number;
    static Y_BOT_OFFSET: number;
    static Y_MIX_OFFSET: number;
    mountainID: number;
    widthSquares: number;
    widthPixels: number;
    heightSquares: number;
    heightPixels: number;
    top: boolean;
    bot: boolean;
    left: boolean;
    right: boolean;
    angle: number;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the mountain.
     *  @param {Record<string, any>}  json - Json object describing the mountain
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the total squares width.
     *  @returns {number}
     */
    getTotalSquaresWidth(): number;
    /** Get the total squares height.
     *  @param {number} yPlus
     *  @returns {number}
     */
    getTotalSquaresHeight(yPlus: number): number;
    /**
     *  Get the squares number width with pixels plus.
     *  @returns {number}
     */
    getWidthOnlyPixelsPlus(): number;
    /**
     *  Get the squares number height with pixels plus.
     *  @returns {number}
     */
    getHeightOnlyPixelsPlus(): number;
    /**
     *  Get the total width in pixels.
     *  @returns {number}
     */
    getWidthTotalPixels(): number;
    /**
     *  Get the total height in pixels.
     *  @returns {number}
     */
    getHeightTotalPixels(): number;
    /**
     *  Get the System special element mountain.
     *  @returns {System.SpecialElement}
     */
    getSystem(): System.SpecialElement;
    /**
     *  Draw the entire faces.
     *  @param {boolean} left - Indicate if left
     *  @param {boolean} right - Indicate if right
     *  @param {number} angle - The angle
     *  @param {Vector3} center - The position center
     *  @param {number} width - The width in squares
     *  @param {number} height - The height in squares
     *  @param {number} w - The w in coordinates
     *  @param {number} faceHeight - The face height
     *  @param {number} wp - The width pixels
     *  @param {number} xLeft - The x left position
     *  @param {number} xRight - The x right position
     *  @param {number} yTop - The y top position
     *  @param {number} yBot - The y bot position
     *  @param {number} zFront - The z front position
     *  @param {number} zBack - The z back position
     *  @param {number} yOffset - The y offset
     *  @param {Vector3} vecFrontA - The front vector position A
     *  @param {Vector3} vecBackA - The back vector position A
     *  @param {Vector3} vecFrontB - The front vector position B
     *  @param {Vector3} vecBackB - The back vector position B
     *  @param {Core.CustomGeometry} geometry - The geometry
     *  @param {number} count - The faces count
     *  @returns {number}
     */
    drawEntireFaces(left: boolean, right: boolean, angle: number, center: Core.Vector3, width: number, height: number, w: number, faceHeight: number, wp: number, xLeft: number, xRight: number, yTop: number, yBot: number, zFront: number, zBack: number, yOffset: number, vecFrontA: Vector3, vecBackA: Vector3, vecFrontB: Vector3, vecBackB: Vector3, geometry: CustomGeometry, count: number): number;
    /**
     *  Draw the side corner.
     *  @param {number} xKind - The xKind position
     *  @param {number} yKind - The yKind position
     *  @param {number} angle - The angle
     *  @param {Vector3} center - The position center
     *  @param {number} width - The width in squares
     *  @param {number} height - The height in squares
     *  @param {number} w - The w in coordinates
     *  @param {number} faceHeight - The face height
     *  @param {number} wp - The width pixels
     *  @param {number} xLeft - The x left position
     *  @param {number} xRight - The x right position
     *  @param {number} xLeftTop - The x left top position
     *  @param {number} xRightTop - The x right top position
     *  @param {number} xLeftBot - The x left bot position
     *  @param {number} xRightBot - The x right bot position
     *  @param {number} yTop - The y top position
     *  @param {number} yBot - The y bot position
     *  @param {number} zFront - The z front position
     *  @param {number} zBack - The z back position
     *  @param {number} zFrontLeft - The z front left position
     *  @param {number} zFrontRight - The z front right position
     *  @param {number} zBackLeft - The z back left position
     *  @param {number} zBackRight - The z back right position
     *  @param {number} yOffset - The y offset
     *  @param {Core.CustomGeometry} geometry - The geometry
     *  @param {number} count - The faces count
     *  @param {number} xCornerOffsetTop - The x corner offset top
     *  @param {number} xCornerOffsetBot - The x corner offset bot
     *  @returns {number}
     */
    drawSideCorner(xKind: number, yKind: number, angle: number, center: Vector3, width: number, height: number, w: number, faceHeight: number, wp: number, xLeft: number, xRight: number, xLeftTop: number, xRightTop: number, xLeftBot: number, xRightBot: number, yTop: number, yBot: number, zFront: number, zBack: number, zFrontLeft: number, zFrontRight: number, zBackLeft: number, zBackRight: number, yOffset: number, geometry: CustomGeometry, count: number, xCornerOffsetTop: number, xCornerOffsetBot: number): number;
    /**
     *  Draw a face.
     *  @param {number} xKind - The xKind position
     *  @param {number} yKind - The yKind position
     *  @param {number} angle - The angle
     *  @param {Vector3} center - The position center
     *  @param {number} width - The width in squares
     *  @param {number} height - The height in squares
     *  @param {number} w - The w in coordinates
     *  @param {number} faceHeight - The face height
     *  @param {number} xLeftTop - The x left top position
     *  @param {number} xRightTop - The x right top position
     *  @param {number} xLeftBot - The x left bot position
     *  @param {number} xRightBot - The x right bot position
     *  @param {number} yTop - The y top position
     *  @param {number} yBot - The y bot position
     *  @param {number} zFrontLeft - The z front left position
     *  @param {number} zFrontRight - The z front right position
     *  @param {number} zBackLeft - The z back left position
     *  @param {number} zBackRight - The z back right position
     *  @param {number} yOffset - The y offset
     *  @param {Core.CustomGeometry} geometry - The geometry
     *  @param {number} count - The faces count
     *  @param {number} xCornerOffsetTop - The x corner offset top
     *  @param {number} xCornerOffsetBot - The x corner offset bot
     *  @param {boolean} isCorner - Indicate if corner
     *  @returns {number}
     */
    drawFace(xKind: number, yKind: number, angle: number, center: THREE.Vector3, width: number, height: number, w: number, faceHeight: number, xLeftTop: number, xRightTop: number, xLeftBot: number, xRightBot: number, yTop: number, yBot: number, zFrontLeft: number, zFrontRight: number, zBackLeft: number, zBackRight: number, yOffset: number, geometry: CustomGeometry, count: number, xCornerOffsetTop: number, xCornerOffsetBot: number, isCorner: boolean): number;
    /**
     *  Update the geometry of a group of mountains with the same material.
     *  @param {Core.CustomGeometry} geometry - The geometry of mountains
     *  @param {TextureBundle} texture - The texture mountain
     *  @param {Position} position - The position
     *  @param {number} count - The faces count
     *  @return {any[]}
     */
    updateGeometry(geometry: CustomGeometry, texture: TextureBundle, position: Position, count: number): any[];
}
export { Mountain };
