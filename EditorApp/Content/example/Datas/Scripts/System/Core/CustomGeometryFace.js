/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { THREE } from "../Globals.js";
import { CustomGeometry } from "./CustomGeometry.js";
/**
 *  The geometry used to apply vertices + indices + uvs.
 *
 *  @class CustomGeometry
 *  @extends THREE.BufferGeometry
 */
export class CustomGeometryFace extends CustomGeometry {
    constructor() {
        super();
        this.b_size = [];
        this.b_center = [];
    }
    /**
     *  Push vertices for quad geometries.
     *  @param {THREE.Vector3} vecA
     *  @param {THREE.Vector3} vecB
     *  @param {THREE.Vector3} vecC
     *  @param {THREE.Vector3} vecD
     *  @param {THREE.Vector3} size
     *  @param {THREE.Vector3} center
     */
    pushQuadVerticesFace(vecA, vecB, vecC, vecD, size, center) {
        this.b_vertices.push(vecA.x, vecA.y, vecA.z);
        this.b_size.push(size.x, size.y, size.z);
        this.b_center.push(center.x, center.y, center.z);
        this.b_vertices.push(vecB.x, vecB.y, vecB.z);
        this.b_size.push(size.x, size.y, size.z);
        this.b_center.push(center.x, center.y, center.z);
        this.b_vertices.push(vecC.x, vecC.y, vecC.z);
        this.b_size.push(size.x, size.y, size.z);
        this.b_center.push(center.x, center.y, center.z);
        this.b_vertices.push(vecD.x, vecD.y, vecD.z);
        this.b_size.push(size.x, size.y, size.z);
        this.b_center.push(center.x, center.y, center.z);
    }
    /**
     *  Update vertices, indices, and uvs buffer geometry attributes.
     */
    updateAttributes() {
        this.setAttribute('position', new THREE.Float32BufferAttribute(this
            .b_vertices, 3));
        this.b_vertices = [];
        this.setIndex(this.b_indices);
        this.b_indices = [];
        this.setAttribute('centerPosition', new THREE.Float32BufferAttribute(this
            .b_center, 3));
        this.b_center = [];
        this.setAttribute('size', new THREE.Float32BufferAttribute(this
            .b_size, 3));
        this.b_size = [];
        this.updateUVs();
        this.computeVertexNormals();
    }
}
