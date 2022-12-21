import { Bitmap, Picture2D, Tree, Node } from "../Core/index.js";
import { Graphic } from "../index.js";
import { Enum } from "../Common/index.js";
import TagKind = Enum.TagKind;
import Align = Enum.Align;
/** @class
 *  A class for message show text command.
 *  @extends Graphic.Base
 *  @param {string} message - The complete text to parse
 *  @param {number} facesetID - The faceset picture ID
 */
declare class Message extends Graphic.Base {
    static readonly TAG_BOLD = "b";
    static readonly TAG_ITALIC = "i";
    static readonly TAG_LEFT = "l";
    static readonly TAG_CENTER = "c";
    static readonly TAG_RIGHT = "r";
    static readonly TAG_SIZE = "size";
    static readonly TAG_FONT = "font";
    static readonly TAG_TEXT_COLOR = "textcolor";
    static readonly TAG_BACK_COLOR = "backcolor";
    static readonly TAG_STROKE_COLOR = "strokecolor";
    static readonly TAG_VARIABLE = "var";
    static readonly TAG_PARAMETER = "par";
    static readonly TAG_PROPERTY = "pro";
    static readonly TAG_HERO_NAME = "hname";
    static readonly TAG_ICON = "ico";
    message: string;
    faceset: Picture2D;
    facesetIndexX: number;
    facesetIndexY: number;
    graphics: Bitmap[];
    positions: number[];
    tree: Tree;
    heights: number[];
    aligns: Align[];
    totalWidths: number[];
    constructor(message: string, facesetID: number, facesetIndexX: number, facesetIndexY: number);
    /**
     *  Set message (parse).
     *  @param {string} message - The message to parse
     */
    setMessage(message: string): void;
    /**
     *  Update tag.
     *  @param {Node} currentNode - The current node
     *  @param {TagKind} tag - The tag kind
     *  @param {string} value - The tag value
     *  @param {boolean} open - Indicate if open tag
     *  @param {Node[]} notClosed - List of unclosed nodes
     *  @returns {Node}
     */
    updateTag(currentNode: Node, tag: TagKind, value: string, open: boolean, notClosed: Node[]): Node;
    /**
     *  Update all.
     */
    update(): void;
    /**
     *  Update the nodes.
     *  @param {Node} node - The current node
     *  @param {Record<string, any>} - result The result object
     */
    updateNodes(node: Node, result: Record<string, any>): void;
    /**
     *  Drawing the faceset behind.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawBehind(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the faceset.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawFaceset(x: number, y: number, w: number, h: number): void;
    /**
     *  Drawing the message box.
     *  @param {number} x - The x position to draw graphic
     *  @param {number} y - The y position to draw graphic
     *  @param {number} w - The width dimention to draw graphic
     *  @param {number} h - The height dimention to draw graphic
     */
    drawChoice(x?: number, y?: number, w?: number, h?: number): void;
    /**
     *  Drawing the message.
     *  @param {number} [x=this.oX] - The x position to draw graphic
     *  @param {number} [y=this.oY] - The y position to draw graphic
     *  @param {number} [w=this.oW] - The width dimention to draw graphic
     *  @param {number} [h=this.oH] - The height dimention to draw graphic
     *  @param {boolean} [positionResize=true] - If checked, resize postion
     *  according to screen resolution
     */
    draw(x?: number, y?: number, w?: number, h?: number): void;
}
export { Message };
