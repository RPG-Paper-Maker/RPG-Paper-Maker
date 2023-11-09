import { Enum } from '../Common/index.js';
import { System } from '../index.js';
import { MapObject } from './MapObject.js';
import { Vector3 } from './index.js';
/** @class
 *  The camera of the current map.
 *  @param {System.CameraProperties} cameraProperties - The System camera
 *  properties
 *  @param {MapObject} target - The camera target
 */
declare class Camera {
    static readonly HIDDING_MOVE_TIME = 250;
    system: System.CameraProperties;
    perspectiveCamera: THREE.PerspectiveCamera;
    orthographicCamera: THREE.OrthographicCamera;
    isPerspective: boolean;
    target: MapObject;
    targetPosition: Vector3;
    targetOffset: Vector3;
    distance: number;
    horizontalAngle: number;
    verticalAngle: number;
    hidingDistance: number;
    previousHidingDistance: number;
    hidingTime: number;
    hidingStart: number;
    hidingEnd: number;
    hidingCurrent: number;
    forceNoHide: boolean;
    constructor(cameraProperties: System.CameraProperties, target: MapObject);
    /**
     *  Initialize the camera according to system camera properties.
     */
    initialize(): void;
    /**
     *  Configure camera when resizing window.
     */
    resizeGL(): void;
    /**
     *  Check if camera is currently hiding with walls / mountains.
     *  @returns {boolean}
     */
    isHiding(): boolean;
    /**
     *  Get the map orientation according to the camera.
     *  @returns {Orientation}
     */
    getMapOrientation(): Enum.Orientation;
    /**
     *  Get the time percentage progress.
     *  @returns {number}
     */
    getHidingTimeProgress(): number;
    /**
     *  Get the distance according to hiding distance.
     *  @returns {number}
     */
    getHidingDistance(): number;
    /**
     *  Get the distance according to vertical angle.
     *  @returns {number}
     */
    getDistance(): number;
    /**
     *  Get the height according to vertical angle.
     *  @returns {number}
     */
    getHeight(): number;
    /**
     *  Get the horizontal angle between two positions.
     *  @param {Vector3} p1 - The first position
     *  @param {Vector3} p2 - The second position
     *  @returns {number}
     */
    getHorizontalAngle(p1: Vector3, p2: Vector3): number;
    /**
     *  Get the vertical angle between two positions.
     *  @param {Vector3} p1 - The first position
     *  @param {Vector3} p2 - The second position
     *  @returns {number}
     */
    getVerticalAngle(p1: Vector3, p2: Vector3): number;
    /**
     *  Add an angle to the horizontal angle.
     *  @param {number} a - The angle to add
     */
    addHorizontalAngle(a: number): void;
    /**
     *  Add an angle to the vertical angle.
     *  @param {number} a - The angle to add
     */
    addVerticalAngle(a: number): void;
    /**
     *  Update the target position according to target and target offset.
     */
    updateTargetPosition(): void;
    /**
     *  Get the perspective or orthographic camera.
     *  @returns {THREE.Camera}
     */
    getThreeCamera(): THREE.Camera;
    /**
     *  Update the three.js camera position.
     */
    updateCameraPosition(): void;
    /**
     *  Update target offset position.
     */
    updateTargetOffset(): void;
    /**
     *  Update horizontal and vertical angles.
     */
    updateAngles(): void;
    /**
     *  Update the distance.
     */
    updateDistance(): void;
    /**
     * Update the three.js camera view.
     */
    updateView(): void;
    /**
     * Update timer for hidding camera smooth move.
     */
    updateTimer(): void;
    /**
     * Update all the parameters.
     */
    update(): void;
}
export { Camera };
