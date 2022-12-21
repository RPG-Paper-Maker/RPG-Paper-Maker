/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Platform, ScreenResolution, Utils, Constants, Enum } from "../Common/index.js";
import { Manager, Datas, Scene, System } from "../index.js";
import { Position, MapPortion } from "../Core/index.js";
/** @class
*   All the System datas.
*   @static
*/
class Systems {
    constructor() {
        throw new Error("This is a static class!");
    }
    /**
     *  Read the JSON file associated to System.
     *  @static
     */
    static async read() {
        let json = await IO.parseFileJSON(Paths.FILE_SYSTEM);
        // Project name
        this.projectName = new System.Translatable(json.pn);
        Platform.setWindowTitle(this.projectName.name());
        // Screen resolution + antialiasing
        let w = json.sw;
        let h = json.sh;
        let isScreenWindow = json.isw;
        if (!Platform.isModeTestNormal()) {
            w = 640;
            h = 480;
            isScreenWindow = true;
        }
        if (!isScreenWindow) {
            w = Platform.screenWidth;
            h = Platform.screenHeight;
        }
        Platform.setWindowSize(w, h, !isScreenWindow);
        Platform.canvasHUD.width = w;
        Platform.canvasHUD.height = h;
        Platform.canvas3D.style.width = w;
        Platform.canvas3D.style.height = h;
        Platform.canvasVideos.height = h;
        ScreenResolution.CANVAS_WIDTH = w;
        ScreenResolution.CANVAS_HEIGHT = h;
        ScreenResolution.WINDOW_X = ScreenResolution.CANVAS_WIDTH /
            ScreenResolution.SCREEN_X;
        ScreenResolution.WINDOW_Y = ScreenResolution.CANVAS_HEIGHT /
            ScreenResolution.SCREEN_Y;
        this.antialias = Utils.defaultValue(json.aa, false);
        this.isMouseControls = Utils.defaultValue(json.isMouseControls, true);
        // Other numbers
        this.SQUARE_SIZE = json.ss;
        this.PORTIONS_RAY_NEAR = Utils.defaultValue(json.portionRayIngame, 3);
        this.FRAMES = json.frames;
        this.mountainCollisionHeight = System.DynamicValue.readOrDefaultNumber(json.mch, 4);
        this.mountainCollisionAngle = System.DynamicValue
            .readOrDefaultNumberDouble(json.mca, 45);
        this.mapFrameDuration = System.DynamicValue.readOrDefaultNumber(json.mfd, 150);
        this.battlersFrames = Utils.defaultValue(json.battlersFrames, 4);
        this.battlersColumns = Utils.defaultValue(json.battlersColumns, 9);
        this.autotilesFrames = Utils.defaultValue(json.battlersColumns, 4);
        this.autotilesFrameDuration = Utils.defaultValue(json.battlersColumns, 150);
        this.saveSlots = Utils.defaultValue(json.saveSlots, 4);
        this.priceSoldItem = System.DynamicValue.readOrDefaultNumberDouble(json
            .priceSoldItem, 50);
        // Path BR
        this.PATH_BR = Paths.FILES + json.pathBR;
        // Path DLC
        this.PATH_DLCS = Paths.FILES + (await IO.parseFileJSON(Paths.FILE_DLCS))
            .p;
        // Hero beginning
        this.ID_MAP_START_HERO = json.idMapHero;
        this.ID_OBJECT_START_HERO = json.idObjHero;
        // Debug bounding box
        this.showBB = Utils.defaultValue(json.bb, false);
        if (this.showBB) {
            Manager.Collisions.BB_MATERIAL.color.setHex(0xff0000);
            Manager.Collisions.BB_MATERIAL.wireframe = true;
            Manager.Collisions.BB_MATERIAL_DETECTION.color.setHex(0x00f2ff);
            Manager.Collisions.BB_MATERIAL_DETECTION.wireframe = true;
        }
        Manager.Collisions.BB_MATERIAL.visible = this.showBB;
        Manager.Collisions.BB_MATERIAL_DETECTION.visible = this.showBB;
        this.showFPS = Utils.defaultValue(json.fps, false);
        this.ignoreAssetsLoadingErrors = false; //TODO
        // Lists
        this.itemsTypes = [];
        this.inventoryFilters = [];
        this.mainMenuCommands = [];
        this.heroesStatistics = [];
        this.colors = [];
        this.currencies = [];
        this.windowSkins = [];
        this.cameraProperties = [];
        this.detections = [];
        this.skyboxes = [];
        this.fontSizes = [];
        this.fontNames = [];
        this.speeds = [];
        this.frequencies = [];
        this.initialPartyMembers = [];
        Utils.readJSONSystemList({ list: json.itemsTypes, listIDs: this
                .itemsTypes, cons: System.Translatable });
        Utils.readJSONSystemList({ list: json.inventoryFilters, listIndexes: this
                .inventoryFilters, cons: System.InventoryFilter });
        Utils.readJSONSystemList({ list: json.mainMenuCommands, listIndexes: this
                .mainMenuCommands, cons: System.MainMenuCommand });
        Utils.readJSONSystemList({ list: json.heroesStatistics, listIndexes: this
                .heroesStatistics, func: (element) => {
                return System.DynamicValue.readOrDefaultDatabase(element.statisticID);
            } });
        Utils.readJSONSystemList({ list: json.colors, listIDs: this.colors, cons: System.Color });
        Utils.readJSONSystemList({ list: json.currencies, listIDs: this
                .currencies, cons: System.Currency });
        Utils.readJSONSystemList({ list: json.wskins, listIDs: this.windowSkins,
            cons: System.WindowSkin });
        Utils.readJSONSystemList({ list: json.cp, listIDs: this.cameraProperties,
            cons: System.CameraProperties });
        Utils.readJSONSystemList({ list: json.d, listIDs: this.detections, cons: System.Detection });
        Utils.readJSONSystemList({ list: json.sb, listIDs: this.skyboxes, cons: System.Skybox });
        Utils.readJSONSystemList({ list: json.fs, listIDs: this.fontSizes, func: (element) => {
                return System.DynamicValue.readOrDefaultNumber(element.s, 0);
            } });
        Utils.readJSONSystemList({ list: json.fn, listIDs: this.fontNames, cons: System.FontName });
        Utils.readJSONSystemList({ list: json.sf, listIDs: this.speeds, func: (element) => {
                return System.DynamicValue.readOrDefaultNumberDouble(element.v, 1);
            } });
        Utils.readJSONSystemList({ list: json.f, listIDs: this.frequencies, func: (element) => {
                return System.DynamicValue.readOrDefaultNumberDouble(element.v, 1);
            } });
        Utils.readJSONSystemList({ list: Utils.defaultValue(json
                .initialPartyMembers, []), listIndexes: this.initialPartyMembers,
            cons: System.InitialPartyMember });
        // Sounds
        this.soundCursor = new System.PlaySong(Enum.SongKind.Sound, json.scu);
        this.soundConfirmation = new System.PlaySong(Enum.SongKind.Sound, json.sco);
        this.soundCancel = new System.PlaySong(Enum.SongKind.Sound, json.sca);
        this.soundImpossible = new System.PlaySong(Enum.SongKind.Sound, json.si);
        // Window skin options
        this.dbOptions = Manager.Events
            .getEventCommand(json.dbo);
        this.dbOptions.update();
        // Faceset options
        this.facesetsSize = Utils.defaultValue(json.facesetsSize, 128);
        this.facesetScalingWidth = Utils.defaultValue(json.facesetScalingWidth, 120);
        this.facesetScalingHeight = Utils.defaultValue(json.facesetScalingHeight, 120);
        // Icons size
        this.iconsSize = Utils.defaultValue(json.iconsSize, 16);
        // Enter name menu options
        this.enterNameTable = json.enterNameTable;
        // Initialize loading scene now that basics are loaded
        Manager.Stack.sceneLoading = new Scene.Loading();
        Manager.Stack.requestPaintHUD = true;
    }
    /**
     *  Get the item type by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getItemType(id) {
        return Datas.Base.get(id, this.itemsTypes, "item type");
    }
    /**
     *  Get the color by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {System.Color}
     */
    static getColor(id) {
        return Datas.Base.get(id, this.colors, "color");
    }
    /**
     *  Get the currency by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getCurrency(id) {
        return Datas.Base.get(id, this.currencies, "currency");
    }
    /**
     *  Get the window skin by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getWindowSkin(id) {
        return Datas.Base.get(id, this.windowSkins, "window skin");
    }
    /**
     *  Get the camera properties by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getCameraProperties(id) {
        return Datas.Base.get(id, this.cameraProperties, "camera properties");
    }
    /**
     *  Get the detection by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getDetection(id) {
        return Datas.Base.get(id, this.detections, "detections");
    }
    /**
     *  Get the skybox by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getSkybox(id) {
        return Datas.Base.get(id, this.skyboxes, "skybox");
    }
    /**
     *  Get the font size by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFontSize(id) {
        return Datas.Base.get(id, this.fontSizes, "font size");
    }
    /**
     *  Get the font name by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFontName(id) {
        return Datas.Base.get(id, this.fontNames, "font name");
    }
    /**
     *  Get the speed by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getSpeed(id) {
        return Datas.Base.get(id, this.speeds, "speed");
    }
    /**
     *  Get the frequency by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFrequency(id) {
        return Datas.Base.get(id, this.frequencies, "frequency");
    }
    /**
     *  Get the system object of hero.
     *  @static
     *  @async
     */
    static async getModelHero() {
        let mapName = Scene.Map.generateMapName(this.ID_MAP_START_HERO);
        let json = (await IO.parseFileJSON(Paths.FILE_MAPS + mapName + Paths
            .FILE_MAP_OBJECTS)).objs;
        let jsonObject, position;
        for (let i = 0, l = json.length; i < l; i++) {
            jsonObject = json[i];
            if (jsonObject.id === this.ID_OBJECT_START_HERO) {
                position = Position.createFromArray(jsonObject.p);
                break;
            }
        }
        if (Utils.isUndefined(position)) {
            Platform.showErrorMessage("Object linking issue. Please go to map " +
                Scene.Map.current.mapName + " and use Options > Debug Options in map > Synchronize map objects. Please report it to dev.");
        }
        let globalPortion = position.getGlobalPortion();
        let fileName = globalPortion.getFileName();
        json = await IO.parseFileJSON(Paths.FILE_MAPS + mapName + Constants
            .STRING_SLASH + fileName);
        this.modelHero = (new MapPortion(globalPortion)).getHeroModel(json);
    }
    /**
     *  Load the window skins pictures
     *  @static
     */
    static async loadWindowSkins() {
        for (let i = 1, l = this.windowSkins.length; i < l; i++) {
            await this.windowSkins[i].updatePicture();
        }
    }
    /**
     *  Get the default array currencies for a default game.
     *  @static
     *  @returns {number[]}
     */
    static getDefaultCurrencies() {
        let list = [];
        for (let id in this.currencies) {
            list[id] = 0;
        }
        return list;
    }
    /**
     *  Get the current System window skin.
     *  @static
     *  @returns {SystemWindowSkin}
     */
    static getCurrentWindowSkin() {
        return this.dbOptions.v_windowSkin;
    }
}
export { Systems };
