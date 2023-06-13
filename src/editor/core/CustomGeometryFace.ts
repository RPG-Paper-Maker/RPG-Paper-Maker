/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { CustomGeometry } from "./CustomGeometry";

class CustomGeometryFace extends CustomGeometry {

    public b_size: number[] = [];
    public b_center: number[] = [];

    constructor() {
        super();
    }

    pushQuadVerticesFace(vecA: THREE.Vector3, vecB: THREE.Vector3, vecC: THREE.Vector3, 
        vecD: THREE.Vector3, size: THREE.Vector3, center: THREE.Vector3) {
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

export { CustomGeometryFace }