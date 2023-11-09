import { Portion } from './Portion.js';
import { MapObject } from './MapObject.js';
import { Position } from './Position.js';
import { StructMapElementCollision } from './MapElement.js';
import { Enum } from '../Common/index.js';
import { Autotiles } from './Autotiles.js';
import ElementMapKind = Enum.ElementMapKind;
import { Mountains } from './Mountains.js';
/** @class
 *  A portion of the map.
 *  @param {Portion} portion
 */
declare class MapPortion {
    portion: Portion;
    staticFloorsMesh: THREE.Mesh;
    staticSpritesMesh: THREE.Mesh;
    faceSpritesMesh: THREE.Mesh;
    squareNonEmpty: number[][][];
    boundingBoxesLands: StructMapElementCollision[][];
    boundingBoxesSprites: StructMapElementCollision[][];
    boundingBoxesMountains: StructMapElementCollision[][];
    boundingBoxesObjects3D: StructMapElementCollision[][];
    staticAutotilesList: Autotiles[][];
    staticMountainsList: Map<number, Mountains>;
    objectsList: MapObject[];
    staticWallsList: THREE.Mesh[];
    staticObjects3DList: THREE.Mesh[];
    overflowMountains: Position[];
    heroID: number;
    constructor(portion: Portion);
    /**
     *  Read the JSON associated to the map portion.
     *  @param {Record<string, any>} json - object describing the map portion
     *  @param {boolean} isMapHero - Indicates if this map is where the hero is
     *  at the beginning of the game.
     */
    read(json: Record<string, any>, isMapHero: boolean): Promise<void>;
    /**
     *  Read the JSON associated to the map portion, but only the static part.
     *  @param {Record<string, any>} json - object describing the map portion
     */
    readStatic(json: Record<string, any>): Promise<void>;
    /**
     *  Read the JSON associated to the lands in the portion.
     *  @param {Record<string, any>} json - object describing the lands
     */
    readLands(json: any[]): Promise<void>;
    /**
     *  Read the JSON associated to the sprites in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites
     */
    readSprites(json: Record<string, any>): Promise<void>;
    /** Read the JSON associated to the sprites globals in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites globals
     */
    readSpritesGlobals(json: Record<string, any>): void;
    /**
     *  Read the JSON associated to the sprites walls in the portion.
     *  @param {Record<string, any>} json - Json object describing the sprites
     *  walls
     */
    readSpritesWalls(json: any[]): Promise<void>;
    /**
     *  Read the JSON associated to the mountains in the portion.
     *  @param {Record<string, any>} json - Json object describing the mountains
     */
    readMountains(json: any[]): Promise<void>;
    /**
     *  Read the JSON associated to the objects 3D in the portion.
     *  @param {Record<string, any>} json - Json object describing the objects 3D
     */
    readObjects3D(json: any[]): Promise<void>;
    /**
     *  Read the JSON associated to the objects in the portion.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @param {boolean} isMapHero - Indicates if this map is where the hero is
     *  at the beginning of the game
     */
    readObjects(json: Record<string, any>, isMapHero: boolean): Promise<void>;
    /**
     *  Remove all the static stuff from the scene.
     */
    cleanStatic(): void;
    /**
     *  Remove all the objects from the scene.
     */
    cleanAll(): void;
    /**
     *  Search for the object with the ID.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @param {number} id - The ID of the object
     *  @returns {MapObject}
     */
    getObjFromID(json: Record<string, any>, id: number): MapObject;
    /**
     *  Get hero model.
     *  @param {Record<string, any>} json - Json object describing the objects
     *  @returns {MapObject}
     */
    getHeroModel(json: Record<string, any>): MapObject;
    /**
     *  Update the face sprites orientation.
     *  @param {number} angle - The angle on the Y axis
     */
    updateFaceSprites(angle: number): void;
    /**
     *  Update the collision sprite.
     *  @param {StructMapElementCollision[]} collisions - The collisions objects
     *  @param {Position} position - The json position of the sprite
     */
    updateCollisionSprite(collisions: StructMapElementCollision[], position: Position): void;
    /** Update the collision sprite
     *  @param {Record<string, any>[]} boundingBoxes - The bounding boxes list to update
     *  @param {StructMapElementCollision[]} collisions - The collisions objects
     *  @param {Position} position - The json position of the sprite
     *  @param {boolean} side - Indicate if collision side
     */
    updateCollision(boundingBoxes: Record<string, any>[], collisions: StructMapElementCollision[], position: Position, side: boolean): void;
    /**
     *  Get the object collision according to position.
     *  @param {Position} positionSource - The source json position
     *  @param {Position} positionTarget - The target json position
     *  @param {ElementMapKind} kind - The element map kind
     *  @returns {StructMapElementCollision[]}
     */
    getObjectCollisionAt(positionSource: Position, positionTarget: Position, kind: ElementMapKind): StructMapElementCollision[];
    /**
     *  Add a position to non empty.
     *  @param {Position} position - The position to add
     */
    addToNonEmpty(position: Position): void;
    /**
     *  Check if position if in this map portion.
     *  @param {Position} position - The position to check
     *  @returns {boolean}
     */
    isPositionIn(position: Position): boolean;
}
export { MapPortion };
