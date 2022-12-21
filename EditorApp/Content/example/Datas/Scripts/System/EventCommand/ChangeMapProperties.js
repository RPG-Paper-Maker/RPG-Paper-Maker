/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { System, Scene } from "../index.js";
import { Utils, Enum } from "../Common/index.js";
import { Game } from "../Core/index.js";
/** @class
 *  An event command for changing a map properties.
 *  @extends EventCommand.Base
 *  @param {Object} command - Direct JSON command to parse
 */
class ChangeMapProperties extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        this.mapID = System.DynamicValue.createValueCommand(command, iterator);
        this.isTilesetID = Utils.numToBool(command[iterator.i++]);
        if (this.isTilesetID) {
            this.tilesetID = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.isMusic = Utils.numToBool(command[iterator.i++]);
        if (this.isMusic) {
            this.music = System.PlaySong.createValueCommand(command, iterator, Enum.SongKind.Music);
        }
        this.isBackgroundSound = Utils.numToBool(command[iterator.i++]);
        if (this.isBackgroundSound) {
            this.backgroundSound = System.PlaySong.createValueCommand(command, iterator, Enum.SongKind.BackgroundSound);
        }
        this.isCameraPropertiesID = Utils.numToBool(command[iterator.i++]);
        if (this.isCameraPropertiesID) {
            this.cameraPropertiesID = System.DynamicValue.createValueCommand(command, iterator);
        }
        this.isSky = Utils.numToBool(command[iterator.i++]);
        if (this.isSky) {
            this.skyKind = command[iterator.i++];
            this.skyID = System.DynamicValue.createValueCommand(command, iterator);
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
        if (!currentState.loading) {
            let mapID = this.mapID.getValue();
            if (mapID === -1) {
                mapID = Scene.Map.current.id;
            }
            let datas = Game.current.mapsProperties[mapID];
            if (Utils.isUndefined(datas)) {
                datas = {};
                Game.current.mapsProperties[mapID] = datas;
            }
            if (this.isTilesetID) {
                datas.tileset = this.tilesetID.getValue();
            }
            if (this.isMusic) {
                datas.music = this.music.toJson();
            }
            if (this.isBackgroundSound) {
                datas.backgroundSound = this.backgroundSound.toJson();
            }
            if (this.isCameraPropertiesID) {
                datas.camera = this.cameraPropertiesID.getValue();
            }
            if (this.isSky) {
                switch (this.skyKind) {
                    case 0:
                        datas.color = this.skyID.getValue();
                        delete datas.skybox;
                        break;
                    case 1:
                        datas.skybox = this.skyID.getValue();
                        delete datas.color;
                        break;
                }
            }
            // Load map again if current map
            if (mapID === Scene.Map.current.id) {
                currentState.loading = true;
                if (this.isTilesetID) {
                    Scene.Map.current.close();
                }
                Scene.Map.current.loading = true;
                (async () => {
                    if (this.isTilesetID) {
                        await Scene.Map.current.load();
                    }
                    else {
                        Scene.Map.current.mapProperties.close();
                        await Scene.Map.current.readMapProperties();
                        if (this.isMusic) {
                            Scene.Map.current.mapProperties.music.playMusic();
                        }
                        if (this.isBackgroundSound) {
                            Scene.Map.current.mapProperties.backgroundSound.playMusic();
                        }
                        if (this.isCameraPropertiesID) {
                            Scene.Map.current.initializeCamera();
                        }
                        if (this.isSky) {
                            switch (this.skyKind) {
                                case 0:
                                    Scene.Map.current.updateBackgroundColor();
                                    break;
                            }
                        }
                        Scene.Map.current.loading = false;
                    }
                    currentState.loaded = true;
                })();
            }
        }
        return !currentState.loading || (currentState.loading && currentState
            .loaded) ? 1 : 0;
    }
}
export { ChangeMapProperties };
