import { System, EventCommand } from '../index.js';
import { Frame } from './Frame.js';
import { Enum } from '../Common/index.js';
import Orientation = Enum.Orientation;
import { Vector3 } from './Vector3.js';
import { CustomGeometry } from './CustomGeometry.js';
interface StructSearchResult {
    object: MapObject;
    id: number;
    datas: Record<string, any>;
    kind?: number;
    index?: number;
    list?: MapObject[];
}
/**
 * Object in local map that can move.
 *
 * @class MapObject
 */
declare class MapObject {
    static SPEED_NORMAL: number;
    id: number;
    system: System.MapObject;
    position: Vector3;
    isHero: boolean;
    movingState: Record<string, any>;
    previousPosition: Vector3;
    mesh: THREE.Mesh<CustomGeometry, THREE.MeshPhongMaterial>;
    meshBoundingBox: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>[];
    currentBoundingBox: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>;
    boundingBoxSettings: Record<string, any>;
    frame: Frame;
    orientationEye: Orientation;
    orientation: Orientation;
    width: number;
    height: number;
    moving: boolean;
    isClimbing: boolean;
    isClimbingUp: boolean;
    climbOrientationEye: Enum.Orientation;
    climbOrientation: Enum.Orientation;
    moveFrequencyTick: number;
    isStartup: boolean;
    isInScene: boolean;
    receivedOneEvent: boolean;
    previousOrientation: Orientation;
    otherMoveCommand: EventCommand.MoveObject;
    previousMoveCommand: EventCommand.MoveObject;
    yMountain: number;
    speed: System.DynamicValue;
    frequency: System.DynamicValue;
    properties: any[];
    states: number[];
    statesInstance: Record<string, any>[];
    timeEventsEllapsed: [System.Event, number][];
    currentState: System.State;
    currentStateInstance: Record<string, any>;
    removed: boolean;
    upPosition: Vector3;
    halfPosition: Vector3;
    currentOrientationStop: boolean;
    isOrientationStopWalk: boolean;
    currentOrientationClimbing: boolean;
    terrain: number;
    currentCenterOffset: THREE.Vector3;
    currentAngle: THREE.Vector3;
    currentScale: THREE.Vector3;
    constructor(system: System.MapObject, position?: Vector3, isHero?: boolean);
    /**
     *  Search an object in the map.
     *  @static
     *  @param {number} objectID - The object ID searched
     */
    static search(objectID: number, callback: Function, thisObject?: MapObject): void;
    /**
     *  Search an object that is already loaded. Return null if not found.
     *  @static
     *  @param {number} objectID - The object ID searched
     *  @param {MapObject} object - This object
     *  @returns {Promise<StructSearchResult>}
     */
    static searchInMap(objectID: number, thisObject?: MapObject): StructSearchResult;
    /**
     *  Search an object that is not loaded yet.
     *  @static
     *  @param {number} objectID - The object ID searched
     *  @returns {Promise<StructSearchResult>}
     */
    static searchOutMap(objectID: number): Promise<StructSearchResult>;
    /**
     *  Read the JSON associated to the object.
     *  @param {Record<string, any>} json - Json object describing the object
     */
    read(json: Record<string, any>): void;
    /**
     *  Initialize objet properties.
     */
    initializeProperties(): void;
    /**
     *  Initialize time events (reactions to event time).
     */
    initializeTimeEvents(): void;
    /**
     *  Update time events.
     */
    updateTimeEvents(): void;
    /**
     *  Update the current state (graphics to display), also update the mesh.
     */
    changeState(): Promise<void>;
    /**
     *  Simulate moving object position.
     *  @param {Orientation} orientation - The orientation to move
     *  @param {number} distance - The distance
     *  @param {number} angle - The angle
     *  @returns {Vector3}
     */
    getFuturPosition(orientation: Orientation, distance: number, angle: number): [Vector3, boolean, Enum.Orientation];
    /**
     *  Check collision with another object.
     *  @param {MapObject} object - The other map object
     *  @returns {boolean}
     */
    checkCollisionObject(object: MapObject): boolean;
    /**
     *  Check the collision detection.
     *  @returns {Vector3}
     */
    checkCollisionDetection(): boolean;
    /**
     *  Only updates the bounding box mesh position.
     *  @param {Vector3} position - Position to update
     */
    updateBB(position: Vector3): void;
    /**
     *  Only updates the bounding box mesh position.
     *  @param {Vector3} position - Position to update
     */
    updateBBPosition(position: Vector3): void;
    /**
     *  Only updates the current bounding box mesh position.
     *  @param {Vector3} position - Position to update
     */
    updateMeshBBPosition(mesh: THREE.Mesh, bbSettings: number[], position: Vector3): void;
    /**
     *  Move the object (one step).
     *  @param {Orientation} orientation - Orientation to move
     *  @param {number} limit - Max distance to go
     *  @param {number} angle - The angle
     *  @param {boolean} isCameraOrientation - Indicate if this should take
     *  account of camera orientation
     *  @returns {number[]}
     */
    move(orientation: Orientation, limit: number, angle: number, isCameraOrientation: boolean): number[];
    /**
     *  Teleport the object.
     *  @param {Vector3} position - Position to teleport
     */
    teleport(position: Vector3): void;
    /**
     *  Jump the object (one step).
     *  @param {Vector3} start - The start position of the jump
     *  @param {Vector3} end - The end position of the jump
     *  @param {number} peak - The y peak
     *  @param {number} currentTime - The current time for jump animation
     *  @param {number} finalTime - The total final time for complete jump animation
     *  @returns {number}
     */
    jump(start: Vector3, end: Vector3, peak: number, currentTime: number, finalTime: number): number;
    /**
     *  Look a direction.
     *  @param {Vector3} orientation - The direction to look at.
     */
    lookAt(oriention: Orientation): void;
    /**
     *  Remove datas move temp
     */
    removeMoveTemp(): void;
    /**
     *  Add to datas move temp
     */
    addMoveTemp(): void;
    /**
     *  Add object mesh to scene
     */
    addToScene(): void;
    /**
     *  Add bounding boxes mesh to scene
     */
    addBBToScene(): void;
    /**
     *  remove object mesh from scene
     */
    removeFromScene(): void;
    /**
     *  Remove bounding boxes mesh from scene
     */
    removeBBFromScene(): void;
    /**
     *  Receive an event.
     *  @param {MapObject} sender - The sender of this event
     *  @param {boolean} isSystem - Indicate if it is an event System
     *  @param {number} eventID - The event ID
     *  @param {Parameter[]} parameters - List of all the parameters
     *  @param {number[]} states - List of all the current states of the object
     *  @param {number[]} events - The time events list
     *  @returns {boolean}
     */
    receiveEvent(sender: MapObject, isSystem: boolean, eventID: number, parameters: System.DynamicValue[], states: number[], events?: [System.Event, number]): boolean;
    /**
     *  Update according to camera angle.
     *  @param {number} angle - The camera angle
     */
    update(angle?: number): void;
    /**
     *  Update moving state.
     */
    updateMovingState(): void;
    /**
     *  Update sprite faces angles.
     *  @param {number} angle - The camera angle
     */
    updateAngle(angle: number): void;
    /**
     *  Update the orientation according to the camera position
     */
    updateOrientation(): void;
    /**
     *  Update the UVs coordinates according to frame and orientation
     */
    updateUVs(): void;
    /**
     *  Update the material
     */
    updateMaterial(): void;
    /**
     *  Get the state index.
     *  @returns {number}
     */
    getStateIndex(): number;
    /**
     *  Check if graphics is none.
     *  @returns {boolean}
     */
    isNone(): boolean;
    /**
     *  Get the orientation between two objects.
     *  @param {Core.MapObject} object
     *  @returns {Enum.Orientation}
     */
    getOrientationBetween(object: MapObject): Enum.Orientation;
    /**
     *  Get the orientation between an object and a position.
     *  @param {Vector3} position
     *  @returns {Enum.Orientation}
     */
    getOrientationBetweenPosition(position: Vector3, force?: boolean, front?: boolean): Enum.Orientation;
    /**
     *  Update the terrain the object is currently on.
     */
    updateTerrain(): void;
    /**
     *  Get all the squares positions where you need to check collision.
     */
    getSquaresBB(direction?: Vector3): [number, number, number, number, number, number];
}
export { StructSearchResult, MapObject };
