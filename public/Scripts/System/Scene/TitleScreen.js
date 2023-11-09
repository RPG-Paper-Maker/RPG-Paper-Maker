/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Manager, Datas } from '../index.js';
import { Picture2D, WindowChoices, WindowBox, Game } from '../Core/index.js';
import { Enum, ScreenResolution, Constants } from '../Common/index.js';
var PictureKind = Enum.PictureKind;
/**
 *  The Scene displaying the game title screen.
 *  @class TitleScreen
 *  @extends {Scene.Base}
 */
class TitleScreen extends Base {
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
        Game.current = null;
        // Stop all songs and videos
        Manager.Videos.stop();
        Manager.Songs.stopAll();
        // Reset screen tone
        Manager.GL.screenTone.set(0, 0, 0, 1);
        // Destroy pictures
        Manager.Stack.displayedPictures = [];
        // Creating background
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground = await Picture2D.createWithID(Datas
                .TitlescreenGameover.titleBackgroundImageID, PictureKind
                .TitleScreen, { cover: true });
        }
        else {
            await Manager.Videos.play(Datas.Videos.get(Datas
                .TitlescreenGameover.titleBackgroundVideoID).getPath());
        }
        // Windows
        let commandsNb = Datas.TitlescreenGameover.titleCommands.length;
        this.windowChoicesCommands = new WindowChoices(ScreenResolution.SCREEN_X
            / 2 - (WindowBox.MEDIUM_SLOT_WIDTH / 2), ScreenResolution.SCREEN_Y -
            Constants.HUGE_SPACE - (commandsNb * WindowBox.MEDIUM_SLOT_HEIGHT), WindowBox.MEDIUM_SLOT_WIDTH, WindowBox.MEDIUM_SLOT_HEIGHT, Datas
            .TitlescreenGameover.getTitleCommandsNames(), {
            nbItemsMax: commandsNb,
            listCallbacks: Datas.TitlescreenGameover.getTitleCommandsActions(),
            padding: [0, 0, 0, 0]
        });
        // Play title screen song
        Datas.TitlescreenGameover.titleMusic.playMusic();
        this.loading = false;
    }
    /**
     *  @inheritdoc
     */
    translate() {
        for (let i = 0, l = this.windowChoicesCommands.listContents.length; i < l; i++) {
            this.windowChoicesCommands.listContents[i].setText(Datas.TitlescreenGameover.titleCommands[i].name());
        }
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
        if (Datas.TitlescreenGameover.isTitleBackgroundImage) {
            this.pictureBackground.draw();
        }
        this.windowChoicesCommands.draw();
    }
}
export { TitleScreen };
