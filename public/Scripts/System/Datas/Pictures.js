/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { System, Datas } from '../index.js';
import { Paths, Platform, Enum } from '../Common/index.js';
var PictureKind = Enum.PictureKind;
import { Picture2D } from '../Core/index.js';
/** @class
 *   All the pictures datas.
 *   @static
 */
class Pictures {
    constructor() {
        throw new Error('This is a static class!');
    }
    /**
     *  Read the JSON file associated to pictures.
     *  @static
     *  @async
     */
    static async read() {
        let json = (await Platform.parseFileJSON(Paths.FILE_PICTURES)).list;
        let l = json.length;
        this.list = new Array(l);
        let k, j, m, n, id, jsonHash, jsonList, jsonPicture, list, picture;
        for (let i = 0; i < l; i++) {
            jsonHash = json[i];
            k = jsonHash.k;
            jsonList = jsonHash.v;
            // Get the max ID
            m = jsonList.length;
            n = 0;
            for (j = 0; j < m; j++) {
                jsonPicture = jsonList[j];
                id = jsonPicture.id;
                if (id > n) {
                    n = id;
                }
            }
            // Fill the pictures list
            list = new Array(n + 1);
            for (j = 0; j < n + 1 + (k === PictureKind.Characters ? 1 : 0); j++) {
                jsonPicture = jsonList[j];
                if (jsonPicture) {
                    id = jsonPicture.id;
                    picture = new System.Picture(jsonPicture, k);
                    if (k === PictureKind.Icons ||
                        k === PictureKind.Pictures ||
                        k === PictureKind.Facesets ||
                        k === PictureKind.Animations ||
                        k === PictureKind.Battlers ||
                        k === PictureKind.Bars) {
                        await picture.load();
                        if (k === PictureKind.Bars) {
                            picture.checkBarBorder();
                        }
                    }
                    if (id !== 0) {
                        if (id === -1) {
                            id = 0;
                        }
                        list[id] = picture;
                    }
                }
            }
            this.list[k] = list;
        }
    }
    /**
     *  Get the corresponding picture.
     *  @param {PictureKind} kind - The picture kind
     *  @param {number} id - The picture id
     *  @returns {Picture}
     */
    static get(kind, id) {
        return kind === PictureKind.None || id === -1
            ? new System.Picture()
            : Datas.Base.get(id, this.list[kind], 'picture ' + System.Picture.pictureKindToString(kind));
    }
    /**
     *  Get the corresponding picture list by kind.
     *  @param {PictureKind} kind - The picture kind
     *  @returns {Picture}
     */
    static getListByKind(kind) {
        return this.list[kind];
    }
    /** Get a copy of the picture 2D.
     *   @param {PictureKind} kind - The picture kind
     *   @param {number} id - The picture id
     *   @returns {Picture2D}
     */
    static getPictureCopy(kind, id) {
        let picture = this.get(kind, id);
        return picture && picture.picture ? picture.picture.createCopy() : new Picture2D();
    }
}
export { Pictures };
