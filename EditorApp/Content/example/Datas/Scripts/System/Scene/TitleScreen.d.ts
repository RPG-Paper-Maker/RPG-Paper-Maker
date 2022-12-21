import { Base } from "./Base.js";
import { Picture2D, WindowChoices } from "../Core/index.js";
/**
 *  The Scene displaying the game title screen.
 *  @class TitleScreen
 *  @extends {Scene.Base}
 */
declare class TitleScreen extends Base {
    /**
     *  The title screen background image.
     *  @type {Picture2D}
     */
    pictureBackground: Picture2D;
    /**
     *  The title screen command window.
     *  @type {WindowChoices}
     */
    windowChoicesCommands: WindowChoices;
    constructor();
    /**
     *  @inheritdoc
     */
    create(): void;
    /**
     *  @inheritdoc
     */
    load(): Promise<void>;
    /**
     *  @inheritdoc
     */
    translate(): void;
    /**
     *  @inheritdoc
     */
    update(): void;
    /**
     *  @inheritdoc
     *  @param {number} key - the key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  @inheritdoc
     *  @param {number} key - the key ID
     *  @return {*}  {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  @inheritdoc
     */
    onMouseMove(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  @inheritdoc
     */
    drawHUD(): void;
}
export { TitleScreen };
