import { THREE } from "../Globals.js";
import { Vector2 } from "./Vector2.js";
import { Vector3 } from "./Vector3.js";
/**
 *  The geometry used to apply vertices + indices + uvs.
 *
 *  @class CustomGeometry
 *  @extends THREE.BufferGeometry
 */
export declare class CustomGeometry extends THREE.BufferGeometry {
    b_vertices: number[];
    b_indices: number[];
    b_uvs: number[];
    constructor();
    /**
     *  Create a BoxGeometry kind CustomGeometry.
     *  @static
     *  @param {number} width
     *  @param {number} height
     *  @param {number} depth
     */
    static createBox(width: number, height: number, depth: number): CustomGeometry;
    /**
     *  Set UVs tex for a classic quad according to x y w h values.
     *  @static
     *  @param {number} x
     *  @param {number} y
     *  @param {number} w
     *  @param {number} h
     */
    static uvsQuadToTex(texA: Vector2, texB: Vector2, texC: Vector2, texD: Vector2, x: number, y: number, w: number, h: number): void;
    /**
     *  Get the points vertices.
     *  @returns {ArrayLike<number>}
     */
    getVerticesVectors(): THREE.Vector3[];
    /**
     *  Get the vertices numbers array.
     *  @returns {ArrayLike<number>}
     */
    getVertices(): ArrayLike<number>;
    /**
     *  Get the indices numbers array.
     *  @returns {ArrayLike<number>}
     */
    getIndices(): ArrayLike<number>;
    /**
     *  Get the uvs numbers array.
     *  @returns {ArrayLike<number>}
     */
    getUVs(): ArrayLike<number>;
    /**
     *  Get the normals numbers array.
     *  @returns {ArrayLike<number>}
     */
    getNormals(): ArrayLike<number>;
    /**
     *  Push vertices for triangle geometries.
     *  @param {Core.Vector3} vecA
     *  @param {Core.Vector3} vecB
     *  @param {Core.Vector3} vecC
     */
    pushTriangleVertices(vecA: Vector3, vecB: Vector3, vecC: Vector3): void;
    /**
     *  Push indices for triangle geometries.
     *  @param {number} count
     */
    pushTriangleIndices(count: number): void;
    /**
     *  Push UVs for triangle geometries.
     *  @param {Core.Vector2} texA
     *  @param {Core.Vector2} texB
     *  @param {Core.Vector2} texC
     *  @param {Core.Vector2} texD
     */
    pushTriangleUVs(texA: Vector2, texB: Vector2, texC: Vector2): void;
    /**
     *  Push vertices for quad geometries.
     *  @param {Core.Vector3} vecA
     *  @param {Core.Vector3} vecB
     *  @param {Core.Vector3} vecC
     *  @param {Core.Vector3} vecD
     */
    pushQuadVertices(vecA: Vector3, vecB: Vector3, vecC: Vector3, vecD: Vector3): void;
    /**
     *  Push indices for quad geometries.
     *  @param {number} count
     */
    pushQuadIndices(count: number): void;
    /**
     *  Push UVs for quad geometries.
     *  @param {Core.Vector2} texA
     *  @param {Core.Vector2} texB
     *  @param {Core.Vector2} texC
     *  @param {Core.Vector2} texD
     */
    pushQuadUVs(texA: Vector2, texB: Vector2, texC: Vector2, texD: Vector2): void;
    /**
     *  Update uvs buffer geometry attribute.
     */
    updateUVs(): void;
    /**
     *  Update vertices, indices, and uvs buffer geometry attributes.
     */
    updateAttributes(): void;
}
