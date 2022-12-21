/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
import { THREE } from "../Globals.js";
import { Datas, System, Manager, Scene } from "../index.js";
import { PlaySong } from "./PlaySong.js";
import { DynamicValue } from "./DynamicValue.js";
import { MapObject } from "../Core/MapObject.js";
import { Enum, Constants, Utils, Mathf } from "../Common/index.js";
var SongKind = Enum.SongKind;
var PictureKind = Enum.PictureKind;
import { Game } from "../Core/index.js";
/** @class
 *  The properties of a map.
 *  @extends System.Base
 */
class MapProperties extends Base {
    constructor() {
        super();
        this.sceneBackground = null;
        this.skyboxGeometry = null;
        this.skyboxMesh = null;
    }
    /**
     *  Read the JSON associated to the map properties.
     *  @param {Record<string, any>} - json Json object describing the map
     *  properties
     */
    read(json) {
        this.skyboxGeometry = null;
        this.skyboxMesh = null;
        this.id = json.id;
        this.name = json.name;
        this.length = json.l;
        this.width = json.w;
        this.height = json.h;
        this.depth = json.d;
        // Tileset: if not existing, by default select the first one
        let datas = Game.current.mapsProperties[this.id];
        if (Utils.isUndefined(datas)) {
            datas = {};
        }
        this.tileset = Datas.Tilesets.get(Utils.defaultValue(datas.tileset, json
            .tileset));
        this.music = new PlaySong(SongKind.Music, Utils.defaultValue(datas.music, json.music));
        this.backgroundSound = new PlaySong(SongKind.BackgroundSound, Utils
            .defaultValue(datas.backgroundSound, json.bgs));
        this.cameraProperties = Datas.Systems.getCameraProperties(Utils.defaultValue(datas.camera, DynamicValue.readOrDefaultDatabase(json.cp, 1).getValue()));
        let kind = -1;
        if (!Utils.isUndefined(datas.color)) {
            kind = 0;
        }
        else if (!Utils.isUndefined(datas.skybox)) {
            kind = 1;
        }
        this.isBackgroundColor = kind === 0 ? true : json.isky;
        this.isBackgroundImage = kind !== -1 ? false : json.isi;
        if (this.isBackgroundColor) {
            this.backgroundColorID = Utils.isUndefined(datas.color) ? new DynamicValue(json.sky) : DynamicValue.createNumber(datas.color);
            ;
        }
        else if (this.isBackgroundImage) {
            this.backgroundImageID = json.ipid;
        }
        else {
            this.backgroundSkyboxID = Utils.isUndefined(datas.skybox) ?
                DynamicValue.readOrDefaultDatabase(json.sbid) : DynamicValue
                .createNumber(datas.skybox);
        }
        var startupReactions = new System.MapObject(json.so);
        this.startupObject = new MapObject(startupReactions);
        this.startupObject.changeState();
        // Random battles
        this.randomBattleMapID = System.DynamicValue.readOrDefaultDatabase(json
            .randomBattleMapID);
        this.randomBattles = [];
        Utils.readJSONSystemList({ list: Utils.defaultValue(json.randomBattles, []), listIndexes: this.randomBattles, cons: System.RandomBattle });
        this.randomBattleNumberStep = System.DynamicValue.readOrDefaultNumber(json.randomBattleNumberStep, 300);
        this.randomBattleVariance = System.DynamicValue.readOrDefaultNumber(json.randomBattleVariance, 20);
        this.updateMaxNumberSteps();
    }
    /**
     *  Update the background.
     */
    updateBackground() {
        if (this.isBackgroundImage) {
            this.updateBackgroundImage();
        }
        else if (!this.isBackgroundColor) {
            this.updateBackgroundSkybox();
        }
        this.updateBackgroundColor();
    }
    /**
     *  Update the background color.
     */
    updateBackgroundColor() {
        this.backgroundColor = Datas.Systems.getColor(this.isBackgroundColor ?
            this.backgroundColorID.getValue() : 1);
    }
    /**
     *  Update the background image.
     */
    updateBackgroundImage() {
        let bgMat = Manager.GL.createMaterial(Manager.GL.textureLoader.load(Datas.Pictures.get(PictureKind.Pictures, this.backgroundImageID)
            .getPath()), { flipY: true });
        bgMat.depthTest = false;
        bgMat.depthWrite = false;
        this.sceneBackground = new THREE.Scene();
        this.cameraBackground = new THREE.Camera();
        this.sceneBackground.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), bgMat));
    }
    /**
     *  Update the background skybox.
     */
    updateBackgroundSkybox() {
        let size = 10000 * Datas.Systems.SQUARE_SIZE / Constants
            .BASIC_SQUARE_SIZE;
        this.skyboxGeometry = new THREE.BoxGeometry(size, size, size);
        this.skyboxMesh = new THREE.Mesh(this.skyboxGeometry, Datas.Systems
            .getSkybox(this.backgroundSkyboxID.getValue()).createTextures());
        Scene.Map.current.scene.add(this.skyboxMesh);
    }
    /**
     *  Update the max steps numbers for starting a random battle.
     */
    updateMaxNumberSteps() {
        for (let battle of this.randomBattles) {
            battle.resetCurrentNumberSteps();
        }
        this.maxNumberSteps = Mathf.variance(this.randomBattleNumberStep
            .getValue(), this.randomBattleVariance.getValue());
    }
    /**
     *  Check if a random battle can be started.
     */
    checkRandomBattle() {
        let randomBattle;
        let test = false;
        for (randomBattle of this.randomBattles) {
            randomBattle.updateCurrentNumberSteps();
            if (randomBattle.currentNumberSteps >= this.maxNumberSteps) {
                test = true;
            }
        }
        if (test) {
            randomBattle = null;
            let rand = Mathf.random(0, 100);
            let priority = 0;
            // Remove 0 priority or not reached current steps
            let battles = [];
            let total = 0;
            for (randomBattle of this.randomBattles) {
                randomBattle.updateCurrentPriority();
                if (randomBattle.currentPriority > 0 && randomBattle
                    .currentNumberSteps >= this.maxNumberSteps) {
                    battles.push(randomBattle);
                    total += randomBattle.currentPriority;
                }
            }
            for (randomBattle of battles) {
                priority += randomBattle.priority.getValue() / total * 100;
                if (rand <= priority) {
                    break;
                }
                else {
                    randomBattle = null;
                }
            }
            if (randomBattle !== null) {
                this.updateMaxNumberSteps();
                let battleMap = Datas.BattleSystems.getBattleMap(this
                    .randomBattleMapID.getValue());
                Game.current.heroBattle = new MapObject(Game.current.hero.system, battleMap.position.toVector3(), true);
                Manager.Stack.push(new Scene.Battle(randomBattle.troopID
                    .getValue(), true, true, battleMap, Enum.MapTransitionKind
                    .Zoom, Enum.MapTransitionKind.Zoom, null, null));
            }
        }
    }
    close() {
        if (this.skyboxMesh !== null) {
            Scene.Map.current.scene.remove(this.skyboxMesh);
        }
    }
}
export { MapProperties };
