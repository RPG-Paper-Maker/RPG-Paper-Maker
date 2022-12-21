import { Camera, ReactionInterpreter, MapObject } from "../Core/index.js";
import { System, Graphic } from "../index.js";
/**
 *  The superclass who shape the structure of a scene.
 *  @abstract
 */
declare abstract class Base {
    /**
     *  An array of reaction interpreters.
     *  @type {ReactionInterpreter[]}
     *  @memberof Base
     */
    reactionInterpreters: ReactionInterpreter[];
    /**
     *  An array of reaction interpreters caused by effects.
     *  @type {ReactionInterpreter[]}
     *  @memberof Base
     */
    reactionInterpretersEffects: ReactionInterpreter[];
    /**
     *  The array holding parallel commands.
     *  @type {ReactionInterpreter[]}
     *  @memberof Base
     */
    parallelCommands: ReactionInterpreter[];
    /**
     *  The async loading flag.
     *  @type {boolean}
     *  @memberof Base
     */
    loading: boolean;
    /**
     *  The scene camera.
     *  @type {Camera}
     *  @memberof Base
     */
    camera: Camera;
    graphicFPS: Graphic.Text;
    /**
     *  @param {boolean} [loading = true] - Tells whether or not the scene is
     *  loading asynchronosively.
     */
    constructor(loading?: boolean, ...args: any);
    initialize(...args: any): void;
    /**
     *  Assign and create all the contents of the scene synchronously.
     *
     *  @example
     *  create(){
     *    super.create();
     *    this.createAllWindows();
     *  }
     */
    create(): void;
    /**
     *  Load the scene asynchronous contents.
     *  @example
     *  // Load an the titlescreen background into the scene.
     *  const picture = await Picture2D.createWithID(null,null,null);
     *  @async
     */
    load(): Promise<void>;
    /**
     *  Translate the scene if possible.
     */
    translate(): void;
    /**
     *  Update all the reaction interpreters from the scenes.
     */
    updateInterpreters(): void;
    /**
     *  Update all the parallel commands from the scenes.
     */
    updateParallelCommands(): void;
    /**
     * Add a reaction in the interpreter list.
     *
     * @param {MapObject} sender - The reaction sender
     * @param {System.Reaction} reaction - The reaction to add
     * @param {MapObject} object - The object reacting
     * @param {number} state - the state ID
     * @param {System.DynamicValue[]} parameters - All the parameters coming with this reaction
     * @param {[System.Event, number]} - event the time events values
     * @param {boolean} [moving=false] - indicate if the command is of type moving.
     * @return {ReactionInterpreter}
     */
    addReaction(sender: MapObject, reaction: System.Reaction, object: MapObject, state: number, parameters: System.DynamicValue[], event: [
        System.Event,
        number
    ], moving?: boolean): ReactionInterpreter;
    /**
     * Update the scene.
     */
    update(): void;
    /**
     *  Handle the scene reactions when a key is pressed.
     *  @param {number} key - the key ID
     */
    onKeyPressed(key: number): void;
    /**
     *  Handle the scene reactions when a key is released.
     *  @param {number} key - the key ID
     */
    onKeyReleased(key: number): void;
    /**
     *  Handle the scene reactions when a key is repeated.
     *  @param {number} key - The key ID
     *  @return {boolean}
     */
    onKeyPressedRepeat(key: number): boolean;
    /**
     *  Handle scene reactions when a key is pressed and repeated.
     *  @param {number} key
     *  @return {boolean}
     */
    onKeyPressedAndRepeat(key: number): boolean;
    /**
     *  Mouse down handle for the scene.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseDown(x: number, y: number): void;
    /**
     *  Mouse move handle for the scene.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseMove(x: number, y: number): void;
    /**
     *  Mouse up handle for the scene.
     *  @param {number} x - The x mouse position on screen
     *  @param {number} y - The y mouse position on screen
     */
    onMouseUp(x: number, y: number): void;
    /**
     *  Draw the contents in the 3D scene.
     */
    draw3D(): void;
    /**
     *  Draw the HUD contents on the scene.
     */
    drawHUD(): void;
    /**
     *  Close the scene.
     */
    close(): void;
}
export { Base };
