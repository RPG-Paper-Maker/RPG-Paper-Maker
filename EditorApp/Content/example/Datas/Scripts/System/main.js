/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Manager } from "./index.js";
import { Utils, Platform, Inputs } from "./Common/index.js";
/**
 * The main class who boot and loop everything's
 *
 * @export
 * @class Main
 */
export class Main {
    constructor() {
        throw new Error("This is a static class");
    }
    static async initialize() {
        await Datas.Settings.checkIsProtected();
        await Manager.Plugins.load();
        Manager.Stack.loadingDelay = 0;
        Manager.Songs.initialize();
        Manager.Stack.clearHUD();
        await Main.load();
    }
    /**
     * Load the game stack and datas
     *
     * @static
     * @memberof Main
     */
    static async load() {
        await Datas.Languages.read();
        await Datas.Settings.read();
        await Datas.Systems.read();
        await Datas.Variables.read();
        await Datas.Pictures.read();
        await Datas.Songs.read();
        await Datas.Videos.read();
        await Datas.Shapes.read();
        Manager.GL.load();
        Manager.GL.initialize();
        Manager.GL.resize();
        await Datas.SpecialElements.read();
        await Datas.Tilesets.read();
        await Datas.Status.read();
        await Datas.Items.read();
        await Datas.Skills.read();
        await Datas.Weapons.read();
        await Datas.Armors.read();
        await Datas.Classes.read();
        await Datas.Heroes.read();
        await Datas.Monsters.read();
        await Datas.Troops.read();
        await Datas.BattleSystems.read();
        await Datas.TitlescreenGameover.read();
        await Datas.Keyboards.read();
        await Datas.Animations.read();
        await Datas.CommonEvents.read();
        await Datas.Systems.getModelHero();
        await Datas.Systems.loadWindowSkins();
        await Main.onEndLoading();
    }
    /**
     * exporting function for let control to the user when the loading ended
     *
     * @export
     */
    static async onEndLoading() {
        switch (Platform.MODE_TEST) {
            case Platform.MODE_TEST_BATTLE_TROOP:
                await Manager.Stack.pushBattleTest();
                break;
            case Platform.MODE_TEST_SHOW_TEXT_PREVIEW:
                await Manager.Stack.pushShowTextPreview();
                break;
            default:
                Manager.Stack.pushTitleScreen();
                break;
        }
        Main.loaded = true;
        Manager.Stack.requestPaintHUD = true;
    }
    ;
    /**
     *  Main loop of the game.
     */
    static loop() {
        if (Main.firstTime === -1) {
            Main.firstTime = performance.now();
        }
        requestAnimationFrame(Main.loop);
        // Update if everything is loaded
        if (Main.loaded) {
            if (!Manager.Stack.isLoading()) {
                Manager.Stack.update();
            }
            if (!Manager.Stack.isLoading()) {
                Manager.Stack.draw3D();
            }
        }
        Manager.Stack.drawHUD();
        // Elapsed time
        Manager.Stack.elapsedTime = new Date().getTime() - Manager.Stack
            .lastUpdateTime;
        Manager.Stack.averageElapsedTime = (Manager.Stack.averageElapsedTime +
            Manager.Stack.elapsedTime) / 2;
        Manager.Stack.lastUpdateTime = new Date().getTime();
        let end = performance.now();
        Main.frames++;
        let t = end - Main.firstTime;
        if (t >= 1000) {
            Main.FPS = Main.frames;
            Main.frames = 0;
            Main.firstTime = -1;
        }
    }
}
Main.loaded = false;
Main.frames = 0;
Main.firstTime = -1;
Main.time = 0;
Main.FPS = 60;
// -------------------------------------------------------
//
// INITIALIZATION
//
// -------------------------------------------------------
Utils.tryCatch(Main.initialize);
// -------------------------------------------------------
//
// INPUTS CONFIG
//
// -------------------------------------------------------
Inputs.initialize();
// -------------------------------------------------------
//
// START LOOP
//
// -------------------------------------------------------
requestAnimationFrame(Main.loop);
