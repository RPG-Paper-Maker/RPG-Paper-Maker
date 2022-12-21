import { System } from "../index.js";
/** @class
 *  The class who handles plugins of RPG Paper Maker.
 *  @static
 *  @author Nio Kasgami, Wano
 */
declare class Plugins {
    static plugins: Record<string, System.Plugin>;
    static pluginsNames: string[];
    constructor();
    /**
     *  Load all the game plugins.
     *  @static
     *  @async
     */
    static load(): Promise<void>;
    /**
     *  Load a particular plugin.
     *  @static
     *  @async
     *  @param {Record<string, any>}  pluginJSON - the plugin details to load
     *  @returns {Promise<boolean>}
     */
    static loadPlugin(pluginJSON: Record<string, any>): Promise<boolean>;
    /**
     *  Register plugin parameters.
     *  @static
     *  @param {System.Plugin} plugin
     */
    static register(plugin: System.Plugin): void;
    /**
     *  Register a plugin command.
     *  @static
     *  @param {string} pluginName
     *  @param {string} commandName
     *  @param {Function} command
     */
    static registerCommand(pluginName: string, commandName: string, command: Function): void;
    /**
     *  Execute a plugin command.
     *  @static
     *  @param {number} pluginID
     *  @param {number} commandID
     *  @param {any[]} args
     */
    static executeCommand(pluginID: number, commandID: number, args: any[]): void;
    /**
     *  Return the plugin object.
     *  @static
     *  @param {string} pluginName
     *  @returns {System.Plugin}
     */
    static fetch(pluginName: string): System.Plugin;
    /**
     *  Check whether the plugin exist or not. It's used for compatbilities
     *  purpose.
     *  @static
     *  @param {string} pluginName
     *  @returns {boolean}
     */
    static exists(pluginName: string): boolean;
    /**
     *  Get plugin parameters.
     *  @static
     *  @param {string} pluginName -
     *  @returns {Record<string, DynamicValue>}
     */
    static getParameters(pluginName: string): any;
    /**
     *  Get a plugin parameter.
     *  @static
     *  @param {string} pluginName
     *  @param {string} parameter
     *  @returns {any}
     */
    static getParameter(pluginName: string, parameter: string): any;
    /**
     *  Check whether or not the plugin is enabled or not.
     *  @static
     *  @param {string} pluginName
     *  @returns {boolean}
     */
    static isEnabled(pluginName: string): boolean;
    /**
     *  Merge the two plugins to extends their plugins data.
     *  @static
     *  @usage This function is used to extends the parameters of other plugins.
     *  See Patch System.
     *  @experimental This is a experimental features that is yet to be support
     *  in RPM.
     *  @param {string} parent
     *  @param {string} child
     */
    static merge(parent: string, child: string): void;
    /**
     *  @static
     *  @usage This function is used to inject/overwrite original class methods and variables.
     *  @experimental This function is experimental and has yet to be thoroughly tested.
     *  @param classObject The class or newable function that you want to inject/overwrite a variable/method into.
     *  @param prototypeName The variable/method name you want to overwrite/inject code into.
     *  @param prototype The new variable/method you want to inject/overwrite.
     *  @param staticType Sets rather this is a static method/variable or a non static method/variable (NOTE: Both a static and non static variable/method can exist at the same time with the same name.) (DEFAULT: false)
     *  @param overwrite (METHODS ONLY) Should call original method's code or overwrite original method. (DEFAULT: false)
     *  @param loadBefore (METHODS ONLY) Should original method's code be executed before or after your code (NOTE: This is obviously disabled if param overwrite is set to true.) (DEFAULT: true)
     */
    static inject<T extends NewableFunction, M extends keyof T, LT extends keyof T["prototype"], TR = string, LM = NewableFunction>(classObject: T, prototypeName: LT | TR | M, prototype: T["prototype"][LT] | T[M] | LM, staticType?: boolean, overwrite?: boolean, loadBefore?: boolean): void;
}
export { Plugins };
