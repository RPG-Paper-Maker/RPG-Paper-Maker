import { CustomGeometry } from "./CustomGeometry.js";
/**
 *  The geometry used to apply vertices + indices + uvs.
 *
 *  @class CustomGeometry
 *  @extends THREE.BufferGeometry
 */
export declare class CustomGeometryFace extends CustomGeometry {
    b_size: number[];
    b_center: number[];
    constructor();
    /**
     *  Push vertices for quad geometries.
     *  @param {THREE.Vector3} vecA
     *  @param {THREE.Vector3} vecB
     *  @param {THREE.Vector3} vecC
     *  @param {THREE.Vector3} vecD
     *  @param {THREE.Vector3} size
     *  @param {THREE.Vector3} center
     */
    pushQuadVerticesFace(vecA: THREE.Vector3, vecB: THREE.Vector3, vecC: THREE.Vector3, vecD: THREE.Vector3, size: THREE.Vector3, center: THREE.Vector3): void;
    /**
     *  Update vertices, indices, and uvs buffer geometry attributes.
     */
    updateAttributes(): void;
}
