import { Base } from "./Base.js";
import { DynamicValue } from "./DynamicValue.js";
import { Camera } from "../Core/index.js";
/** @class
 *  A camera properties of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  camera properties
 */
export declare class CameraProperties extends Base {
    distance: DynamicValue;
    horizontalAngle: DynamicValue;
    verticalAngle: DynamicValue;
    targetOffsetX: DynamicValue;
    targetOffsetY: DynamicValue;
    targetOffsetZ: DynamicValue;
    isSquareTargetOffsetX: boolean;
    isSquareTargetOffsetY: boolean;
    isSquareTargetOffsetZ: boolean;
    fov: DynamicValue;
    near: DynamicValue;
    far: DynamicValue;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the camera properties.
     *  @param {Record<string, any>} - json Json object describing the camera
     *  properties
     */
    read(json: Record<string, any>): void;
    /**
     *  Initialize a camera according this System properties
     *  @param {Camera} camera - The camera
     */
    initializeCamera(camera: Camera): void;
}
