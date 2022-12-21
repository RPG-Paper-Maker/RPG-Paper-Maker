import { System } from "../index.js";
/** @class
 *  All the battle System datas.
 *  @static
 */
declare class CommonEvents {
    static PROPERTY_STOCKED: string;
    private static eventsSystem;
    private static eventsUser;
    private static commonReactions;
    private static commonObjects;
    constructor();
    /**
     *  Read the JSON file associated to common events.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Reorder the models in the right order for inheritance.
     *  @param {Record<string, any>} - jsonObject The json corresponding to the
     *  current object to analyze
     *  @pa Datasects
     *  @param {number} objectsLength - The number of objects to identify
     */
    static modelReOrder(jsonObject: Record<string, any>, reorderedList: Record<string, any>[], jsonObjects: Record<string, any>[], objectsLength: number): void;
    /**
     *  Get the event system by ID.
     *  @param {number} id
     *  @returns {System.Event}
     */
    static getEventSystem(id: number): System.Event;
    /**
     *  Get the event user by ID.
     *  @param {number} id
     *  @returns {System.Event}
     */
    static getEventUser(id: number): System.Event;
    /**
     *  Get the common reaction by ID.
     *  @param {number} id
     *  @returns {System.CommonReaction}
     */
    static getCommonReaction(id: number): System.CommonReaction;
    /**
     *  Get the common object by ID.
     *  @param {number} id
     *  @returns {System.MapObject}
     */
    static getCommonObject(id: number): System.MapObject;
}
export { CommonEvents };
