import { Bitmap } from "./Bitmap.js";
import { Graphic } from "../index.js";
/**
 * the window box options
 *
 * @interface WindowBoxOptions
 */
interface WindowBoxOptions {
    /**
     *  The contents displayed inside the window.
     *
     *  @type {Graphic.Base}
     *  @default null
     *  @memberof WindowBoxOption
     */
    content?: Graphic.Base;
    /**
     *  The window padding
     *
     *  @type {number[]}
     *  @default [0,0,0,0]
     *  @memberof WindowBoxOption
     */
    padding?: number[];
    /**
     *  If enabled the contents will be cut according to the padding size.
     *
     *  @type {boolean}
     *  @default true
     *  @memberof WindowBoxOption
     */
    limitContent?: boolean;
    /**
     *  Indicate if selected.
     *
     *  @type {boolean}
     *  @default false
     *  @memberof WindowBoxOption
     */
    selected?: boolean;
}
/**
 * The class for window boxes.
 *
 * @class WindowBox
 * @extends {Bitmap}
 */
declare class WindowBox extends Bitmap {
    static readonly NONE_PADDING: number[];
    static readonly VERY_SMALL_PADDING_BOX: number[];
    static readonly SMALL_PADDING_BOX: number[];
    static readonly MEDIUM_PADDING_BOX: number[];
    static readonly HUGE_PADDING_BOX: number[];
    static readonly DIALOG_PADDING_BOX: number[];
    static readonly SMALL_SLOT_PADDING: number[];
    static readonly SMALL_SLOT_HEIGHT = 30;
    static readonly LARGE_SLOT_WIDTH = 250;
    static readonly MEDIUM_SLOT_WIDTH = 200;
    static readonly SMALL_SLOT_WIDTH = 100;
    static readonly MEDIUM_SLOT_HEIGHT = 40;
    static readonly LARGE_SLOT_HEIGHT = 60;
    content: Graphic.Base;
    padding: number[];
    limitContent: boolean;
    bordersOpacity: number;
    backgroundOpacity: number;
    selected: boolean;
    bordersVisible: boolean;
    contentDimension: number[];
    windowDimension: number[];
    /**
     *
     * @param {number} x - The x coordinates
     * @param {number} y - The y coordinates
     * @param {number} w - The width coordinates
     * @param {number} h - The height coordinates
     * @param {WindowBoxOption} [options={}] - the window options
     * @memberof WindowBox
     */
    constructor(x: number, y: number, w: number, h: number, options?: WindowBoxOptions);
    /**
     *  Set the x value.
     *  @param {number} x - The x value
     */
    setX(x: number): void;
    /**
     *  Set the y value.
     *  @param {number} y - The y value
     */
    setY(y: number): void;
    /**
     *  Set the w value.
     *  @param {number} w - The w value
     */
    setW(w: number): void;
    /**
     *  Set the h value.
     *  @param {number} h - The h value
     */
    setH(h: number): void;
    /**
     *  Update the content and window dimensions.
     */
    updateDimensions(): void;
    /**
     *  Update the content.
     */
    update(): void;
    /**
     *  Draw the window.
     *  @param {boolean} [isChoice=false] - Indicate if this window box is used
     *  for a window choices
     *  @param {number[]} [windowDimension - = this.windowDimension] Dimensions
     *  of the window
     *  @param {number[]} [contentDimension - = this.contentDimension] Dimension
     *  of content
     */
    draw(isChoice?: boolean, windowDimension?: number[], contentDimension?: number[]): void;
}
export { WindowBox, WindowBoxOptions };
