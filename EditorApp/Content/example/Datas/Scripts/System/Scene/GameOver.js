/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Datas, Manager, Scene } from "../index.js";
import { Constants, Enum, ScreenResolution } from "../Common/index.js";
import { Game, Picture2D, WindowBox, WindowChoices } from "../Core/index.js";
import { Base } from "./Base.js";
/**
 *  The scene displaying the game over screen.
 *  @class GameOver
 *  @extends {Scene.Base}
 */
class GameOver extends Base {
    constructor() {
        super();
    }
    /**
     *  @inheritdoc
     */
    create() {
        super.create();
    }
    /**
     *  @inheritdoc
     */
    async load() {
        // Reload current game
        if (Game.current.slot !== -1) {
            Game.current = new Game(Game.current.slot);
            await Game.current.load();
        }
        // Stop all songs and videos
        Manager.Videos.stop();
        Manager.Songs.stopAll();
        // Creating background
        if (Datas.TitlescreenGameover.isGameOverBackgroundImage) {
            this.pictureBackground = await Picture2D.createWithID(Datas
                .TitlescreenGameover.gameOverBackgroundImageID, Enum.PictureKind
                .GameOver, { cover: true });
        }
        else {
            await Manager.Videos.play(Datas.Videos.get(Datas
                .TitlescreenGameover.gameOverBackgroundVideoID).getPath());
        }
        // Windows
        let commandsNb = Datas.TitlescreenGameover.gameOverCommands.length;
        this.windowChoicesCommands = new WindowChoices(ScreenResolution.SCREEN_X
            / 2 - (WindowBox.MEDIUM_SLOT_WIDTH / 2), ScreenResolution.SCREEN_Y -
            Constants.HUGE_SPACE - (commandsNb * WindowBox.MEDIUM_SLOT_HEIGHT), WindowBox.MEDIUM_SLOT_WIDTH, WindowBox.MEDIUM_SLOT_HEIGHT, Datas
            .TitlescreenGameover.getGameOverCommandsNames(), {
            nbItemsMax: commandsNb,
            listCallbacks: Datas.TitlescreenGameover.getGameOverCommandsActions()
        });
        // Play game over song
        Datas.TitlescreenGameover.gameOverMusic.playMusic();
        this.loading = false;
    }
    /**
     *  Continue the game.
     */
    async continue() {
        this.loading = true;
        // Load positions
        await Game.current.loadPositions();
        // Initialize properties for hero
        Game.current.hero.initializeProperties();
        // Stop video if existing
        if (!Datas.TitlescreenGameover.isGameOverBackgroundImage) {
            Manager.Videos.stop();
        }
        // Load map
        Manager.Stack.replace(new Scene.Map(Game.current.currentMapID));
        this.loading = false;
    }
    /**
     *  @inheritdoc
     */
    update() {
        this.windowChoicesCommands.update();
    }
    /**
     *  @inheritdoc
     *  @param {number} key - the key ID
     */
    onKeyPressed(key) {
        this.windowChoicesCommands.onKeyPressed(key, this.windowChoicesCommands
            .getCurrentContent().datas);
    }
    /**
     *  @inheritdoc
     *  @param {number} key - the key ID
     *  @return {*}  {boolean}
     */
    onKeyPressedAndRepeat(key) {
        return this.windowChoicesCommands.onKeyPressedAndRepeat(key);
    }
    /**
     *  @inheritdoc
     */
    onMouseMove(x, y) {
        this.windowChoicesCommands.onMouseMove(x, y);
    }
    /**
     *  @inheritdoc
     */
    onMouseUp(x, y) {
        this.windowChoicesCommands.onMouseUp(x, y, this.windowChoicesCommands
            .getCurrentContent().datas);
    }
    /**
     *  @inheritdoc
     */
    drawHUD() {
        if (Datas.TitlescreenGameover.isGameOverBackgroundImage) {
            this.pictureBackground.draw();
        }
        this.windowChoicesCommands.draw();
    }
}
export { GameOver };
