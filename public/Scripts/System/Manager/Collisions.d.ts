import { Enum } from '../Common/index.js';
import { MapObject, Position, MapPortion, StructMapElementCollision, Vector3, CustomGeometry } from '../Core/index.js';
/** @class
 *  The collisions manager.
 *  @static
 */
declare class Collisions {
    static BB_MATERIAL: import("three").MeshBasicMaterial;
    static BB_MATERIAL_DETECTION: import("three").MeshBasicMaterial;
    static BB_EMPTY_MATERIAL: import("three").MeshBasicMaterial;
    static BB_BOX: import("three").Mesh<CustomGeometry, import("three").Material | import("three").Material[]>;
    static BB_ORIENTED_BOX: import("three").Mesh<CustomGeometry, import("three").Material | import("three").Material[]>;
    private static BB_BOX_DETECTION;
    static BB_BOX_DEFAULT_DETECTION: import("three").Mesh<CustomGeometry, import("three").Material | import("three").Material[]>;
    static currentCustomObject3D: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>;
    constructor();
    /**
     *  Initialize necessary collisions.
     *  @static
     */
    static initialize(): void;
    /**
     *  Create a box for bounding box.
     *  @static
     *  @returns {THREE.Mesh}
     */
    static createBox(detection?: boolean): THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>;
    /**
     *  Create an oriented box for bounding box.
     *  @static
     *  @returns {THREE.Mesh}
     */
    static createOrientedBox(): THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>;
    /**
     *  Apply transform for lands bounding box.
     *  @static
     *  @param {THREE.Mesh} box - The mesh bounding box
     *  @param {number[]} boundingBox - The bounding box list parameters
     */
    static applyBoxLandTransforms(box: THREE.Mesh, boundingBox: number[]): void;
    /**
     *  Apply transform for sprite bounding box.
     *  @static
     *  @param {THREE.Mesh} box - The mesh bounding box
     *  @param {number[]} boundingBox - The bounding box list parameters
     */
    static applyBoxSpriteTransforms(box: THREE.Mesh, boundingBox: number[], isFixSprite?: boolean, center?: number): void;
    /**
     *  Apply transform for oriented bounding box.
     *  @static
     *  @param {THREE.Mesh} box - The mesh bounding box
     *  @param {number[]} boundingBox - The bounding box list parameters
     */
    static applyOrientedBoxTransforms(box: THREE.Mesh, boundingBox: number[]): void;
    /**
     *  Get a bounding box mesh for detection. Keep the same existing one or
     *  force creating a new one for cases you need several.
     *  @static
     *  @param {number} [force=false]
     *  @returns {THREE.Mesh}
     */
    static getBBBoxDetection(force?: boolean): THREE.Mesh;
    /**
     *  Indicate if min and max are overlapping.
     *  @static
     *  @param {number} minA
     *  @param {number} maxA
     *  @param {number} minB
     *  @param {number} maxB
     *  @returns {boolean}
     */
    static isOverlapping(minA: number, maxA: number, minB: number, maxB: number): boolean;
    /**
     *  Check collision between two OBB.
     *  @static
     *  @param {Core.CustomGeometry} shapeA - First shape
     *  @param {Core.CustomGeometry} shapeB - Second shape
     *  @param {boolean} deepCheck - if false, only check bounding box
     *  @returns {boolean}
     */
    static obbVSobb(shapeA: CustomGeometry, shapeB: CustomGeometry, deepCheck?: boolean): boolean;
    /**
     *  Check the fnormals for OBB collision.
     *  @static
     *  @param {ArrayLike<number>} normals - The normals to check
     *  @param {Vector3[]} verticesA - First vertices to check
     *  @param {Vector3[]} verticesB - Second vertices to check
     *  @param {number} lA - The first vertices length
     *  @param {number} lB - The second vertices length
     *  @returns {boolean}
     */
    static checkNormals(normals: ArrayLike<number>, verticesA: ArrayLike<number>, verticesB: ArrayLike<number>, lA: number, lB: number): boolean;
    /**
     *  Check if vertices overlap on one of the faces normal.
     *  @static
     *  @param {ArrayLike<number>} verticesA - First vertices to check
     *  @param {ArrayLike<number>} verticesB - Second vertices to check
     *  @param {number} lA - The first vertices length
     *  @param {number} lB - The second vertices length
     *  @param {Core.Vector3} normal - The face normal
     *  @returns {boolean}
     */
    static overlapOnThisNormal(verticesA: ArrayLike<number>, verticesB: ArrayLike<number>, lA: number, lB: number, normal: THREE.Vector3): boolean;
    /**
     *  Check collision ray.
     *  @static
     *  @param {Vector3} positionBefore - The position before collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {MapObject} object - The map object to test collision
     *  @returns {boolean}
     */
    static checkRay(positionBefore: Vector3, positionAfter: Vector3, object: MapObject, bbSettings: number[], reverseTestObjects?: boolean): [boolean, number, Enum.Orientation];
    static checkObjectsRay(positionAfter: Vector3, object: MapObject): [
        boolean,
        number,
        Enum.Orientation
    ];
    /**
     *  Check if there is a collision at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {MapObject} object - The map object collision test
     *  @param {Vector3} direction - The direction collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @returns {boolean}
     */
    static check(mapPortion: MapPortion, jpositionBefore: Position, jpositionAfter: Position, positionAfter: Vector3, object: MapObject, direction: Vector3, testedCollisions: StructMapElementCollision[]): [boolean, number, Enum.Orientation];
    /**
     *  Check if there is a collision with lands at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {MapObject} object - The map object collision test
     *  @param {Vector3} direction - The direction collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @returns {boolean}
     */
    static checkLands(mapPortion: MapPortion, jpositionBefore: Position, jpositionAfter: Position, object: MapObject, direction: THREE.Vector3, testedCollisions: StructMapElementCollision[]): boolean;
    /**
     *  Check if there is a collision with lands with directions.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} direction - The direction collision
     *  @returns {boolean}
    */
    static checkLandsInside(mapPortion: MapPortion, jpositionBefore: Position, jpositionAfter: Position, direction: Vector3): boolean;
    /**
     *  Check intersection between ray and an object.
     *  @static
     *  @param {StructMapElementCollision} collision - The collision object
     *  @param {number[]} boundingBox - The bounding box values
     *  @param {MapObject} object - The map object to check
     *  @returns {boolean}
    */
    static checkIntersectionLand(collision: StructMapElementCollision, boundingBox: number[], object: MapObject): boolean;
    /**
     *  Check directions
     *  @static
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {StructMapElementCollision} collision - The collision object
     *  @param {number[]} boundingBox - The bounding box values
     *  @param {Vector3} direction - The direction collision
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkDirections(jpositionBefore: Position, jpositionAfter: Position, collision: StructMapElementCollision, boundingBox: number[], direction: Vector3, object: MapObject): boolean;
    /**
     *  Check directions inside.
     *  @static
     *  @param {Position} jpositionBefore - The json position before collision
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {StructMapElementCollision} collision - The collision object
     *  @param {Vector3} direction - The direction collision
     *  @returns {boolean}
    */
    static checkDirectionsInside(jpositionBefore: Position, jpositionAfter: Position, collision: StructMapElementCollision, direction: THREE.Vector3): boolean;
    /**
     *  Check if there is a collision with sprites at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkSprites(mapPortion: MapPortion, jpositionAfter: Position, testedCollisions: StructMapElementCollision[], object: MapObject): [boolean, number, Enum.Orientation];
    /**
     *  Check intersection between ray and an object.
     *  @static
     *  @param {number[]} boundingBox - The bounding box values
     *  @param {boolean} fix - Indicate if the sprite is fix or not
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkIntersectionSprite(boundingBox: number[], fix: boolean, object: MapObject): boolean;
    /**
     *  Check if there is a collision with sprites at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {THREE.Vector3} positionAfter - The position after collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkObjects3D(mapPortion: MapPortion, jpositionAfter: Position, positionAfter: THREE.Vector3, testedCollisions: StructMapElementCollision[], object: MapObject): boolean;
    /**
     *  Check if there is a collision with custom object 3D collision.
     *  @static
     *  @param {StructMapElementCollision} objCollision - The object colision
     *  info to test
     *  @param {MapObject} object - The map object collision test
     *  @param {THREE.Vector3} positionAfter - The position after collision
     *  @returns {boolean}
    */
    static checkCustomObject3D(objCollision: StructMapElementCollision, object: MapObject, positionAfter: THREE.Vector3): boolean;
    /**
     *  Check intersection between two complex meshes.
     *  @static
     *  @param {THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>} meshA - The first mesh
     *  @param {THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>} meshB - The second mesh
     *  @param {THREE.Vector3} direction - The meshA direction to mesh B
     *  @returns {boolean}
    */
    static checkIntersectionMeshes(meshA: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>, meshB: THREE.Mesh<CustomGeometry, THREE.Material | THREE.Material[]>, direction: THREE.Vector3): boolean;
    /**
     *  Check if there is a collision with mountains at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object collisions that were
     *  already tested
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkMountains(mapPortion: MapPortion, jpositionAfter: Position, positionAfter: Vector3, testedCollisions: StructMapElementCollision[], object: MapObject): [boolean, number];
    /**
     *  Check if there is a collision with mountains at this position.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {StructMapElementCollision[]} testedCollisions - The object
     *  collisions that were already tested
     *  @param {MapObject} object - The map object collision test
     *  @param {StructMapElementCollision} objCollision - The object collision
     *  @param {number} yMountain - The y mountain collision
     *  @param {boolean} block - The block mountain collision
     *  @returns {[boolean, boolean, number]}
    */
    static checkMountain(mapPortion: MapPortion, jpositionAfter: Position, positionAfter: Vector3, testedCollisions: StructMapElementCollision[], object: MapObject, objCollision: StructMapElementCollision, yMountain: number, block: boolean): [
        boolean,
        boolean,
        number
    ];
    /**
     *  Check intersection with a mountain.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {Position} jpositionAfter - The json position after collision
     *  @param {Vector3} positionAfter - The position after collision
     *  @param {StructMapElementCollision} objCollision - The object collision
     *  @param {MapObject} object - The map object collision test
     *  @returns {[boolean, number]}
    */
    static checkIntersectionMountain(mapPortion: MapPortion, jpositionAfter: Position, positionAfter: Vector3, objCollision: StructMapElementCollision, object: MapObject): [boolean, number];
    /**
     *  Check collision with objects.
     *  @static
     *  @param {MapPortion} mapPortion - The map portion to check
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
     */
    static checkObjects(mapPortion: MapPortion, object: MapObject): boolean;
    /**
     *  Check collision with objects.
     *  @static
     *  @param {MapObject[]} list - The map objects list to test
     *  @param {MapObject} object - The map object collision test
     *  @returns {boolean}
    */
    static checkObjectsList(list: MapObject[], object: MapObject): boolean;
}
export { Collisions };
