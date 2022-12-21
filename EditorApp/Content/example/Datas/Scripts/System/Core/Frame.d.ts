/** @class
 *  A frame for updating animations (characters, battlers, etc.).
 *  @param {number} duration - The frame duration
 *  @param {number} [tick=0] - The frame tick (= time spent since current frame)
 *  @param {number} [value=0] - The current frame value
 */
declare class Frame {
    duration: number;
    loop: boolean;
    tick: number;
    value: number;
    frames: number;
    constructor(duration: number, { loop, tick, value, frames }?: {
        loop?: boolean;
        tick?: number;
        value?: number;
        frames?: number;
    });
    /**
     *  Reset the frame.
     */
    reset(): void;
    /**
     *  Update frame according to tick and duration, return true if frame is
     *  different.
     *  @param {number} [duration=this.duration] - The frame duration
     *  @returns {boolean}
     */
    update(duration?: number): boolean;
}
export { Frame };
