/**
 * The data class who manage Sprite anchor in 2D
 */
declare class Anchor2D {
    static readonly MIDDLE_TOP: {
        x: number;
        y: number;
    };
    static readonly MIDDLE: {
        x: number;
        y: number;
    };
    static readonly MIDDLE_BOTTOM: {
        x: number;
        y: number;
    };
    static readonly LEFT_TOP: {
        x: number;
        y: number;
    };
    static readonly LEFT_MIDDLE: {
        x: number;
        y: number;
    };
    static readonly LEFT_BOTTOM: {
        x: number;
        y: number;
    };
    static readonly RIGHT_TOP: {
        x: number;
        y: number;
    };
    static readonly RIGHT_MIDDLE: {
        x: number;
        y: number;
    };
    static readonly RIGHT_BOTTOM: {
        x: number;
        y: number;
    };
    x: number;
    y: number;
    /**
     * The data class who manage sprite anchor in 2D
     * @param x
     * @param y
     */
    constructor(x?: number, y?: number);
    /**
     * Set the anchors using object format (can also use premade).
     *
     * @param {AnchorStruct} anchors
     * @memberof Anchor2D
     */
    set(anchors: AnchorStruct): void;
}
interface AnchorStruct {
    x: number;
    y: number;
}
export { Anchor2D };
