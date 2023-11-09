/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Enum, Constants, Paths, Utils, Platform } from '../Common/index.js';
var CustomShapeKind = Enum.CustomShapeKind;
import { Base } from './Base.js';
import { Datas, Manager } from '../index.js';
import { THREE } from '../Globals.js';
import { Vector3, Vector2, CustomGeometry } from '../Core/index.js';
/** @class
 *  A shape of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  shape
 *  @param {CustomShapeKind} [kind=CustomShapeKin] - The kind of custom shape
 */
class Shape extends Base {
    constructor(json, kind = CustomShapeKind.OBJ) {
        super(json, kind);
    }
    /**
     *  Assign the default members.
     *  @param {any[]} args
     */
    setup(args) {
        this.kind = args[0];
    }
    /**
     *  Get string of custom shape kind.
     *  @param {CustomShapeKind} kind - The custom shape kind
     *  @returns {string}
     */
    static customShapeKindToString(kind) {
        switch (kind) {
            case CustomShapeKind.OBJ:
                return ".obj";
            case CustomShapeKind.MTL:
                return ".mtl";
            case CustomShapeKind.Collisions:
                return ".obj collisions";
        }
        return "";
    }
    /**
     *  Parse the .obj text.
     *  @param {string } - text
     *  @returns {Record<string, any>}
     */
    static parse(text) {
        let object = {};
        let vertices = [];
        let normals = [];
        let uvs = [];
        let v = [];
        let t = [];
        let minVertex = new Vector3();
        let maxVertex = new Vector3();
        let firstVertex = true;
        let vertex_pattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
        let normal_pattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
        let uv_pattern = /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;
        let face_pattern = /^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;
        let lines = text.split('\n');
        let arg1, arg2, arg3, temp3D, j, n, lineList, line, result;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            line = line.trim();
            if (line.length === 0 || line.charAt(0) === '#') {
                continue;
            }
            else if ((result = vertex_pattern.exec(line)) !== null) {
                // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                temp3D = new Vector3(parseFloat(result[1]) * Datas.Systems
                    .SQUARE_SIZE, parseFloat(result[2]) * Datas.Systems
                    .SQUARE_SIZE, parseFloat(result[3]) * Datas.Systems
                    .SQUARE_SIZE);
                v.push(temp3D);
                if (firstVertex) {
                    minVertex = temp3D.clone();
                    maxVertex = temp3D.clone();
                    firstVertex = false;
                }
                else {
                    if (temp3D.x < minVertex.x) {
                        minVertex.setX(temp3D.x);
                    }
                    if (temp3D.y < minVertex.y) {
                        minVertex.setY(temp3D.y);
                    }
                    if (temp3D.z < minVertex.z) {
                        minVertex.setZ(temp3D.z);
                    }
                    if (temp3D.x > maxVertex.x) {
                        maxVertex.setX(temp3D.x);
                    }
                    if (temp3D.y > maxVertex.y) {
                        maxVertex.setY(temp3D.y);
                    }
                    if (temp3D.z > maxVertex.z) {
                        maxVertex.setZ(temp3D.z);
                    }
                }
            }
            else if ((result = normal_pattern.exec(line)) !== null) {
                // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
            }
            else if ((result = uv_pattern.exec(line)) !== null) {
                // ["vt 0.1 0.2", "0.1", "0.2"]
                t.push(new Vector2(parseFloat(result[1]), 1.0 - parseFloat(result[2])));
            }
            else if ((result = face_pattern.exec(line)) !== null) {
                // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]
                lineList = line.split(" ");
                n = lineList.length - 1;
                arg1 = lineList[1].split("/");
                for (j = 1; j < n - 1; j++) {
                    arg2 = lineList[1 + j].split("/");
                    arg3 = lineList[2 + j].split("/");
                    vertices.push(v[parseInt(arg1[0]) - 1]);
                    uvs.push(t[parseInt(arg1[1]) - 1]);
                    vertices.push(v[parseInt(arg2[0]) - 1]);
                    uvs.push(t[parseInt(arg2[1]) - 1]);
                    vertices.push(v[parseInt(arg3[0]) - 1]);
                    uvs.push(t[parseInt(arg3[1]) - 1]);
                }
            }
        }
        object.vertices = vertices;
        object.uvs = uvs;
        object.minVertex = minVertex;
        object.maxVertex = maxVertex;
        object.center = new Vector3(((maxVertex.x - minVertex.x) / 2) +
            minVertex.x, ((maxVertex.y - minVertex.y) / 2) + minVertex.y, ((maxVertex.z - minVertex.z) / 2) + minVertex.z);
        object.w = maxVertex.x - minVertex.x;
        object.h = maxVertex.y - minVertex.y;
        object.d = maxVertex.z - minVertex.z;
        return object;
    }
    /**
     *  Get the folder associated to a kind of custom shape.
     *  @static
     *  @param {CustomShapeKind} kind - The kind of custom shape
     *  @param {boolean} isBR - Indicate if the shape is a BR
     *  @param {string} dlc - The dlc name
     *  @returns {string}
     */
    static getFolder(kind, isBR, dlc) {
        return (isBR ? Datas.Systems.PATH_BR : (dlc ? Datas.Systems.PATH_DLCS +
            Constants.STRING_SLASH + dlc : Paths.ROOT_DIRECTORY_LOCAL)) + this
            .getLocalFolder(kind);
    }
    /**
     *  Get the local folder associated to a kind of custom shape.
     *  @param {CustomShapeKind} kind - The kind of custom shape
     *  @returns {string}
     */
    static getLocalFolder(kind) {
        switch (kind) {
            case CustomShapeKind.OBJ:
                return Paths.OBJ;
            case CustomShapeKind.MTL:
                return Paths.MTL;
            case CustomShapeKind.Collisions:
                return Paths.OBJ_COLLISIONS;
        }
        return "";
    }
    /**
     *  Read the JSON associated to the shape
     *  @param {Record<string, any>} - json Json object describing the shape
     */
    read(json) {
        this.id = json.id;
        this.name = json.name;
        this.isBR = json.br;
        this.dlc = Utils.defaultValue(json.d, "");
        this.base64 = json.base64;
    }
    /**
     *  Load the .obj.
     */
    async load() {
        if (this.id !== -1 && !this.geometry) {
            if (this.base64) {
                this.geometry = Shape.parse(atob(this.base64));
                this.base64 = "";
            }
            else {
                let url = this.getPath();
                this.geometry = await new Promise((resolve, reject) => {
                    Shape.loader.load(url, (text) => {
                        resolve(Shape.parse(text));
                    }, () => { }, () => {
                        let error = "Could not load " + url;
                        if (Datas.Systems.ignoreAssetsLoadingErrors) {
                            console.log(error);
                            resolve({});
                        }
                        else {
                            Platform.showErrorMessage(error);
                        }
                    });
                });
                let geometry = new CustomGeometry();
                let vertices = this.geometry.vertices;
                let uvs = this.geometry.uvs;
                let count = 0;
                let vecA, vecB, vecC;
                for (let i = 0, l = this.geometry.vertices.length; i < l; i += 3) {
                    vecA = vertices[i].clone();
                    vecB = vertices[i + 1].clone();
                    vecC = vertices[i + 2].clone();
                    geometry.pushTriangleVertices(vecA, vecB, vecC);
                    geometry.pushTriangleIndices(count);
                    geometry.pushTriangleUVs(uvs[i].clone(), uvs[i + 1].clone(), uvs[i + 2].clone());
                    count += 3;
                }
                geometry.updateAttributes();
                this.mesh = new THREE.Mesh(geometry, Manager.Collisions.BB_MATERIAL);
            }
        }
    }
    /**
     *  Get the absolute path associated to this picture.
     *  @returns {string}
     */
    getPath() {
        return this.id === -1 ? "" : Shape.getFolder(this.kind, this.isBR, this
            .dlc) + Constants.STRING_SLASH + this.name;
    }
}
Shape.loader = new THREE.FileLoader();
export { Shape };
