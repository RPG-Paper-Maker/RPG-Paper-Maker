import { MapElement, StructMapElementCollision } from "./MapElement.js";
import { Position } from "./Position.js";
import { CustomGeometry } from "./CustomGeometry.js";
/** @class
 *  A sprite in the map.
 *  @extends MapElement
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  wall
 */
declare class SpriteWall extends MapElement {
    id: number;
    kind: any;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the sprite wall.
     *  @param {Record<string, any>} - json Json object describing the wall
     */
    read(json: Record<string, any>): void;
    /**
     *  Update the geometry of a group of sprite walls with the same material.
     *  @param {THREE.Geometry} geometry - The geometry
     *  @param {Position} position - The position
     *  @param {number} width - The total width of the texture
     *  @param {number} height - The total height of the texture
     *  @param {number} count - The faces count
     *  @return {any[]}
     */
    updateGeometry(geometry: CustomGeometry, position: Position, width: number, height: number, count: number): [
        number,
        StructMapElementCollision[]
    ];
}
export { SpriteWall };
