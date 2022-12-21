import { THREE } from "../Globals.js";
/**
 * The data class who hold 3D coordinates.
 * It's used as an API bridge between the user and Three.js
 * @author Nio Kasgami
 */
declare class Vector3 extends THREE.Vector3 {
    x: number;
    y: number;
    z: number;
    /**
     * The data class who hold 3D Coordinate.
     * @param {number} x - the x-axis coordinate in float
     * @param {number} y - the y-axis coordinate in float
     * @param {number} z - the z-axis coordinate in float
     * @param {boolean} freeze - whether or not to freeze the coordinates
     */
    constructor(x?: number, y?: number, z?: number, freeze?: boolean);
}
export { Vector3 };
