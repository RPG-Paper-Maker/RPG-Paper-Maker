/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Scene, System } from "../index.js";
import { Utils } from "../Common/index.js";
import { Game } from "../Core/index.js";
import { Base } from "./Base.js";
/** @class
 *  An event command for switching texture.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class SwitchTexture extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.isTilesetID = Utils.numToBool(command[iterator.i++]);
        if (this.isTilesetID) {
            this.tilesetID = System.DynamicValue.createValueCommand(command, iterator);
            this.tilesetPictureID = System.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        this.isAutotileID = Utils.numToBool(command[iterator.i++]);
        if (this.isAutotileID) {
            this.autotileID = System.DynamicValue.createValueCommand(command, iterator);
            this.autotilePictureID = System.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        this.isWallID = Utils.numToBool(command[iterator.i++]);
        if (this.isWallID) {
            this.wallID = System.DynamicValue.createValueCommand(command, iterator);
            this.wallPictureID = System.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        this.isObject3DID = Utils.numToBool(command[iterator.i++]);
        if (this.isObject3DID) {
            this.object3DID = System.DynamicValue.createValueCommand(command, iterator);
            this.object3DPictureID = System.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
        this.isMountainID = Utils.numToBool(command[iterator.i++]);
        if (this.isMountainID) {
            this.mountainID = System.DynamicValue.createValueCommand(command, iterator);
            this.mountainPictureID = System.DynamicValue.createValueCommand(command, iterator);
            iterator.i++;
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            loading: false,
            loaded: false
        };
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        if (this.isTilesetID) {
            Game.current.textures.tilesets[this.tilesetID.getValue()] = this
                .tilesetPictureID.getValue();
        }
        if (this.isAutotileID) {
            Game.current.textures.autotiles[this.autotileID.getValue()] = this
                .autotilePictureID.getValue();
        }
        if (this.isWallID) {
            Game.current.textures.walls[this.wallID.getValue()] = this
                .wallPictureID.getValue();
        }
        if (this.isObject3DID) {
            Game.current.textures.objects3D[this.object3DID.getValue()] = this
                .object3DPictureID.getValue();
        }
        if (this.isMountainID) {
            Game.current.textures.mountains[this.mountainID.getValue()] = this
                .mountainPictureID.getValue();
        }
        Scene.Map.current.close();
        Scene.Map.current.loading = true;
        (async () => {
            await Scene.Map.current.load();
            currentState.loaded = true;
        })();
        return currentState.loaded ? 1 : 0;
    }
}
export { SwitchTexture };
