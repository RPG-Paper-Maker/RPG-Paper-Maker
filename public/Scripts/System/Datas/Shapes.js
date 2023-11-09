/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Platform, Paths, Enum } from '../Common/index.js';
import { System, Datas } from '../index.js';
var CustomShapeKind = Enum.CustomShapeKind;
/** @class
 *  All the shapes datas.
 *  @static
 */
class Shapes {
    constructor() {
        throw new Error('This is a static class!');
    }
    /**
     *  Read the JSON file associated to shapes.
     */
    static async read() {
        let json = (await Platform.parseFileJSON(Paths.FILE_SHAPES)).list;
        let l = json.length;
        this.list = new Array(l);
        let j, m, n, jsonHash, k, jsonList, jsonShape, id, list, shape;
        for (let i = 0; i < l; i++) {
            jsonHash = json[i];
            k = jsonHash.k;
            jsonList = jsonHash.v;
            // Get the max ID
            m = jsonList.length;
            n = 0;
            for (j = 0; j < m; j++) {
                jsonShape = jsonList[j];
                id = jsonShape.id;
                if (id > n) {
                    n = id;
                }
            }
            // Fill the shapes list
            list = new Array(n + 1);
            for (j = 0; j < n + 1; j++) {
                jsonShape = jsonList[j];
                if (jsonShape) {
                    id = jsonShape.id;
                    shape = new System.Shape(jsonShape, k);
                    if (k === CustomShapeKind.OBJ || k === CustomShapeKind.Collisions) {
                        await shape.load();
                    }
                    if (id !== 0) {
                        if (id === -1) {
                            id = 0;
                        }
                        list[id] = shape;
                    }
                }
            }
            this.list[k] = list;
        }
    }
    /**
     *  Get the corresponding shape
     *  @param {CustomShapeKind} kind - The shape kind
     *  @param {number} id - The shape id
     *  @returns {System.Shape}
     */
    static get(kind, id) {
        return kind === CustomShapeKind.None || id === -1
            ? new System.Shape()
            : Datas.Base.get(id, this.list[kind], 'shape ' + System.Shape.customShapeKindToString(kind));
    }
}
export { Shapes };
