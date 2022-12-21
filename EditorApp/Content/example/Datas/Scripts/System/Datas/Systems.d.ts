import { EventCommand, System } from "../index.js";
import { MapObject } from "../Core/index.js";
/** @class
*   All the System datas.
*   @static
*/
declare class Systems {
    static SQUARE_SIZE: number;
    static PORTIONS_RAY_NEAR: number;
    static FRAMES: number;
    static PATH_BR: string;
    static PATH_DLCS: string;
    static ID_MAP_START_HERO: number;
    static ID_OBJECT_START_HERO: number;
    static projectName: System.Translatable;
    static antialias: boolean;
    static isMouseControls: boolean;
    static mountainCollisionHeight: System.DynamicValue;
    static mountainCollisionAngle: System.DynamicValue;
    static mapFrameDuration: System.DynamicValue;
    static battlersFrames: number;
    static battlersColumns: number;
    static autotilesFrames: number;
    static autotilesFrameDuration: number;
    static priceSoldItem: System.DynamicValue;
    static enterNameTable: string[][];
    static showBB: boolean;
    static showFPS: boolean;
    private static itemsTypes;
    static inventoryFilters: System.InventoryFilter[];
    static mainMenuCommands: System.MainMenuCommand[];
    static heroesStatistics: System.DynamicValue[];
    private static colors;
    private static currencies;
    private static windowSkins;
    private static cameraProperties;
    private static detections;
    private static skyboxes;
    private static fontSizes;
    private static fontNames;
    private static speeds;
    private static frequencies;
    static initialPartyMembers: System.InitialPartyMember[];
    static soundCursor: System.PlaySong;
    static soundConfirmation: System.PlaySong;
    static soundCancel: System.PlaySong;
    static soundImpossible: System.PlaySong;
    static dbOptions: EventCommand.SetDialogBoxOptions;
    static facesetsSize: number;
    static facesetScalingWidth: number;
    static facesetScalingHeight: number;
    static iconsSize: number;
    static saveSlots: number;
    static modelHero: MapObject;
    static ignoreAssetsLoadingErrors: boolean;
    constructor();
    /**
     *  Read the JSON file associated to System.
     *  @static
     */
    static read(): Promise<void>;
    /**
     *  Get the item type by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getItemType(id: number): System.Translatable;
    /**
     *  Get the color by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {System.Color}
     */
    static getColor(id: number): System.Color;
    /**
     *  Get the currency by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getCurrency(id: number): System.Currency;
    /**
     *  Get the window skin by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getWindowSkin(id: number): System.WindowSkin;
    /**
     *  Get the camera properties by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getCameraProperties(id: number): System.CameraProperties;
    /**
     *  Get the detection by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getDetection(id: number): System.Detection;
    /**
     *  Get the skybox by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getSkybox(id: number): System.Skybox;
    /**
     *  Get the font size by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFontSize(id: number): System.DynamicValue;
    /**
     *  Get the font name by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFontName(id: number): System.FontName;
    /**
     *  Get the speed by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getSpeed(id: number): System.DynamicValue;
    /**
     *  Get the frequency by ID safely.
     *  @static
     *  @param {number} id
     *  @returns {string}
     */
    static getFrequency(id: number): System.DynamicValue;
    /**
     *  Get the system object of hero.
     *  @static
     *  @async
     */
    static getModelHero(): Promise<void>;
    /**
     *  Load the window skins pictures
     *  @static
     */
    static loadWindowSkins(): Promise<void>;
    /**
     *  Get the default array currencies for a default game.
     *  @static
     *  @returns {number[]}
     */
    static getDefaultCurrencies(): number[];
    /**
     *  Get the current System window skin.
     *  @static
     *  @returns {SystemWindowSkin}
     */
    static getCurrentWindowSkin(): System.WindowSkin;
}
export { Systems };
