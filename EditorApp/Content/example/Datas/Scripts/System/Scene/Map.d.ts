import { Base } from "./Base.js";
import { Enum } from "../Common/index.js";
import Orientation = Enum.Orientation;
import EffectSpecialActionKind = Enum.EffectSpecialActionKind;
import PictureKind = Enum.PictureKind;
import { System, Scene } from "../index.js";
import { Position, Portion, MapPortion, TextureBundle, Vector3, Battler, Frame, Vector2, Player } from "../Core/index.js";
/** @class
 *  A scene for a local map.
 *  @extends Scene.Base
 *  @param {number} id - The map ID
 *  @param {boolean} [isBattleMap=false] - Indicate if this map is a battle one
 *  @param {boolean} [minimal=false] - Indicate if the map should be partialy
 *  loaded (only for getting objects infos)
*/
declare class Map extends Base {
    static current: Scene.Map;
    static allowMainMenu: boolean;
    static allowSaves: boolean;
    id: number;
    mapName: string;
    orientation: Orientation;
    user: Battler;
    isBattleMap: boolean;
    tempTargets: Battler[];
    targets: Battler[];
    battleCommandKind: EffectSpecialActionKind;
    mapProperties: System.MapProperties;
    scene: THREE.Scene;
    allObjects: Position[];
    currentPortion: Portion;
    mapPortions: MapPortion[];
    textureTileset: THREE.ShaderMaterial;
    textureTilesetFace: THREE.ShaderMaterial;
    texturesCharacters: THREE.ShaderMaterial[];
    texturesAutotiles: TextureBundle[][];
    texturesWalls: THREE.ShaderMaterial[];
    texturesMountains: TextureBundle[];
    texturesObjects3D: THREE.ShaderMaterial[];
    collisions: number[][][][];
    previousCameraPosition: Vector3;
    portionsObjectsUpdated: boolean;
    maxObjectsID: number;
    autotileFrame: Frame;
    autotilesOffset: Vector2;
    heroOrientation: Enum.Orientation;
    previousWeatherPoints: THREE.Points;
    previousWeatherVelocities: number[];
    previousWeatherRotationsAngle: number[];
    previousWeatherRotationsPoint: Vector3[];
    weatherPoints: THREE.Points;
    weatherVelocities: number[];
    weatherRotationsAngle: number[];
    weatherRotationsPoint: Vector3[];
    constructor(id: number, isBattleMap?: boolean, minimal?: boolean, heroOrientation?: Enum.Orientation);
    /**
     *  Load async stuff.
     */
    load(): Promise<void>;
    /**
     *  Generate the map name according to the ID.
     *  @static
     *  @param {number} id - ID of the map
     *  @returns {string}
     */
    static generateMapName(id: number): string;
    /**
     *  Read the map properties file.
     */
    readMapProperties(minimal?: boolean): Promise<void>;
    /**
     *  Get all the possible targets of a skill.
     *  @param {Enum.TargetKind} targetKind
     *  @returns {Player[]}
     */
    getPossibleTargets(targetKind: Enum.TargetKind): Player[];
    /**
     *  Initialize the map objects.
     */
    initializeCamera(): void;
    /**
     *  Initialize the map objects.
     */
    initializeObjects(): Promise<void>;
    /**
     *  Initialize all the objects moved or / and with changed states.
     */
    initializePortionsObjects(): void;
    /**
     *  Load all the textures of the map.
     */
    loadTextures(): Promise<void>;
    /**
     *  Load the collisions settings.
     */
    loadCollisions(): void;
    /**
     *  Initialize the map portions.
     */
    initializePortions(): Promise<void>;
    /**
     *  Get the portion file name.
     *  @param {boolean} noNewPortion - Indicate if the map portions array needs
     *  to be initialized
     */
    loadPortions(noNewPortion?: boolean): Promise<void>;
    /**
     *  Load a portion.
     *  @param {number} realX - The global x portion
     *  @param {number} realY - The global y portion
     *  @param {number} realZ - The global z portion
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
     *  @param {boolean} move - Indicate if the portion was moved or completely
     *  loaded
     */
    loadPortion(realX: number, realY: number, realZ: number, x: number, y: number, z: number, move?: boolean): Promise<void>;
    /**
     *  Load a portion from a portion.
     *  @param {Portion} portion - The portion
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
     *  @param {boolean} move - Indicate if the portion was moved or completely
     *  loaded
    */
    loadPortionFromPortion(portion: Portion, x: number, y: number, z: number, move: boolean): Promise<void>;
    /**
     *  Remove a portion.
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
    */
    removePortion(x: number, y: number, z: number): void;
    /**
     *  Set a portion.
     *  @param {number} i - The previous x portion
     *  @param {number} j - The previous y portion
     *  @param {number} k - The previous z portion
     *  @param {number} m - The new x portion
     *  @param {number} n - The new y portion
     *  @param {number} o - The new z portion
    */
    setPortion(i: number, j: number, k: number, m: number, n: number, o: number): void;
    /**
     *  Set a portion.
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
     *  @param {MapPortion} mapPortion - The new map portion
     *  @param {boolean} move - Indicate if the portion was moved or completely
     *  loaded
    */
    setMapPortion(x: number, y: number, z: number, mapPortion: MapPortion, move: boolean): void;
    /**
     *  Get the objects at a specific portion.
     *  @param {Portion} portion
     *  @returns {Record<string, any>}
     */
    getObjectsAtPortion(portion: Portion): Record<string, any>;
    /**
     *  Get a map portion at local postions.
     *  @param {number} x - The local x portion
     *  @param {number} y - The local y portion
     *  @param {number} z - The local z portion
     *  @returns {MapPortion}
    */
    getMapPortion(portion: Portion): MapPortion;
    /**
     *  Get a map portion at json position.
     *  @param {Position} position - The position
     *  @returns {MapPortion}
     */
    getMapPortionByPosition(position: Position): MapPortion;
    /**
     *  Get map portion according to portion index.
     *  @param {number} index - The portion index
     *  @returns {MapPortion}
     */
    getBrutMapPortion(index: number): MapPortion;
    /**
     *  Get portion index according to local position.
     *  @param {Portion} portion - The local portion
     *  @returns {number}
    */
    getPortionIndex(portion: Portion): number;
    /**
     *  Set a local portion with a global portion.
     *  @param {Portion} portion - The global portion
     *  @returns {Portion}
     */
    getLocalPortion(portion: Portion): Portion;
    /**
     *  Get the map portion limit.
     *  @returns {number}
     */
    getMapPortionLimit(): number;
    /**
     *  Get the map portions size.
     *  @returns {number}
     */
    getMapPortionSize(): number;
    /**
     *  Get the map portion total size.
     *  @returns {number}
     */
    getMapPortionTotalSize(): number;
    /**
     *  Check if a local portion if in the limit
     *  @param {Portion} portion - The local portion
     *  @returns {boolean}
    */
    isInPortion(portion: Portion): boolean;
    /**
     *  Check if a position is in the map.
     *  @param {Position} position - The json position
     *  @returns {boolean}
     */
    isInMap(position: Position): boolean;
    /**
     *  Get the hero position according to battle map.
     *  @returns {Vector3}
     */
    getHeroPosition(): Vector3;
    /**
     *  Update the background color.
     */
    updateBackgroundColor(): void;
    /**
     *  Load collision for special elements.
     *  @param {number[]} list - The IDs list
     *  @param {PictureKind} kind - The picture kind
     *  @param {SpecialElement[]} specials - The specials list
    */
    loadSpecialsCollision(list: number[], kind: PictureKind, specials: System.SpecialElement[]): void;
    /**
     *  Update moving portions.
     */
    updateMovingPortions(): void;
    /**
     *  Update moving portions for east and west.
     */
    updateMovingPortionsEastWest(newPortion: Portion): void;
    /**
     *  Update moving portions for north and south.
     */
    updateMovingPortionsNorthSouth(newPortion: Portion): void;
    /**
     *  Update moving portions for up and down
     */
    updateMovingPortionsUpDown(newPortion: Portion): void;
    /**
     *  Update portions according to a callback.
     */
    updatePortions(base: Object, callback: Function): void;
    /**
     *  Get a random particle weather position according to options.
     *  @param {number} portionsRay
     *  @param {boolean} [offset=true]
     *  @returns {number}
     */
    getWeatherPosition(portionsRay: number, offset?: boolean): number;
    /**
     *  Create the weather mesh system.
     */
    createWeather(current?: boolean): void;
    /**
     *  Function to overwrite with interpreter to add rotation to particles.
     */
    addPreviousWeatherYRotation(): number;
    /**
     *  Function to overwrite with interpreter to add velocity to particles.
     */
    addPreviousWeatherVelocity(): number;
    /**
     *  Function to overwrite with interpreter to add rotation to particles.
     */
    addWeatherYRotation(): number;
    /**
     *  Function to overwrite with interpreter to add velocity to particles.
     */
    addWeatherVelocity(): number;
    switchPreviousWeather(): void;
    /**
     *  Update the weather particles moves.
     */
    updateWeather(current?: boolean): void;
    /**
     *  Update the scene.
     */
    update(): void;
    /**
     *  Handle scene key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle scene key released.
     *  @param {number} key - The key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  Handle scene pressed repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  Handle scene pressed and repeat key.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Mouse down handle for the scene.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseDown(x: number, y: number): void;
    /**
     *  Mouse move handle for the scene.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(x: number, y: number): void;
    /**
     *  Mouse up handle for the scene.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  Draw the 3D scene.
     */
    draw3D(): void;
    /**
     *  Close the map.
     */
    close(): void;
}
export { Map };
