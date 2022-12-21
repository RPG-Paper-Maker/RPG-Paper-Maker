/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano
    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.
    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { IO, Paths, Constants, Utils } from "../Common/index.js";
import { System } from "../index.js";
/** @class
 *  The class who handles plugins of RPG Paper Maker.
 *  @static
 *  @author Nio Kasgami, Wano
 */
class Plugins {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Load all the game plugins.
     *  @static
     *  @async
     */
    static async load() {
        let plugins = Utils.defaultValue((await IO.parseFileJSON(Paths
            .FILE_SCRIPTS)).plugins, []);
        for (let i = 0, l = plugins.length; i < l; i++) {
            await this.loadPlugin(plugins[i]);
        }
    }
    /**
     *  Load a particular plugin.
     *  @static
     *  @async
     *  @param {Record<string, any>}  pluginJSON - the plugin details to load
     *  @returns {Promise<boolean>}
     */
    static async loadPlugin(pluginJSON) {
        let json = await IO.parseFileJSON(Paths.PLUGINS + pluginJSON.name +
            Constants.STRING_SLASH + Paths.FILE_PLUGIN_DETAILS);
        let plugin = new System.Plugin(pluginJSON.id, json);
        // FIX 01 : plugin wasn't unloaded if not enabled.
        if (plugin.isOn) {
            this.register(plugin);
            return (await new Promise((resolve, reject) => {
                let url = Paths.PLUGINS + pluginJSON.name + Constants.STRING_SLASH +
                    Paths.FILE_PLUGIN_CODE;
                let script = document.createElement("script");
                script.type = "module";
                script.src = url;
                document.body.appendChild(script);
                script.onload = () => { resolve(true); };
            }));
        }
    }
    /**
     *  Register plugin parameters.
     *  @static
     *  @param {System.Plugin} plugin
     */
    static register(plugin) {
        if (this.plugins.hasOwnProperty(plugin.name)) {
            throw new Error("Duplicate error: " + plugin + " is an duplicate of "
                + plugin.name);
        }
        else {
            this.plugins[plugin.name] = plugin;
            this.pluginsNames[plugin.id] = plugin.name;
        }
    }
    /**
     *  Register a plugin command.
     *  @static
     *  @param {string} pluginName
     *  @param {string} commandName
     *  @param {Function} command
     */
    static registerCommand(pluginName, commandName, command) {
        this.fetch(pluginName).commands[commandName] = command;
    }
    /**
     *  Execute a plugin command.
     *  @static
     *  @param {number} pluginID
     *  @param {number} commandID
     *  @param {any[]} args
     */
    static executeCommand(pluginID, commandID, args) {
        let plugin = this.fetch(this.pluginsNames[pluginID]);
        plugin.commands[plugin.commandsNames[commandID]].apply(this, args);
    }
    /**
     *  Return the plugin object.
     *  @static
     *  @param {string} pluginName
     *  @returns {System.Plugin}
     */
    static fetch(pluginName) {
        if (!this.plugins.hasOwnProperty(pluginName)) {
            throw new Error("Unindenfied plugin error: " + pluginName + " doesn't exist in the current workspace!");
        }
        else {
            return this.plugins[pluginName];
        }
    }
    /**
     *  Check whether the plugin exist or not. It's used for compatbilities
     *  purpose.
     *  @static
     *  @param {string} pluginName
     *  @returns {boolean}
     */
    static exists(pluginName) {
        for (const pluginNameExisting in this.plugins) {
            if (pluginNameExisting === pluginName) {
                return true;
            }
        }
        return false;
    }
    /**
     *  Get plugin parameters.
     *  @static
     *  @param {string} pluginName -
     *  @returns {Record<string, DynamicValue>}
     */
    static getParameters(pluginName) {
        return this.plugins[pluginName].parameters;
    }
    /**
     *  Get a plugin parameter.
     *  @static
     *  @param {string} pluginName
     *  @param {string} parameter
     *  @returns {any}
     */
    static getParameter(pluginName, parameter) {
        return this.getParameters(pluginName)[parameter].getValue();
    }
    /**
     *  Check whether or not the plugin is enabled or not.
     *  @static
     *  @param {string} pluginName
     *  @returns {boolean}
     */
    static isEnabled(pluginName) {
        return this.plugins[pluginName].isOn;
    }
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
    static merge(parent, child) {
        /*
        const par = this.plugins[parent].parameter;
        const chi = this.plugins[child].parameter;
        this.plugins[parent].parameters = { ...par, ...chi };
        */
    }
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
    static inject(classObject, prototypeName, prototype, staticType = false, overwrite = false, loadBefore = true) {
        let TheAnyPrototype = prototype; //force any type, system will not accept otherwise!
        if (!staticType) {
            let classPrototype = classObject.prototype[prototypeName];
            if (classPrototype instanceof Function) {
                if (overwrite) {
                    classObject.prototype[prototypeName] = function (...args) {
                        this.super = (...arggs) => { classPrototype.call(this, ...arggs); };
                        return TheAnyPrototype.call(this, ...args);
                    };
                }
                else if (loadBefore) {
                    classObject.prototype[prototypeName] = function (...args) {
                        let result = classPrototype.call(this, ...args);
                        this.super = (...arggs) => { classPrototype.call(this, ...arggs); };
                        this.callResult = result;
                        return TheAnyPrototype.call(this, ...args);
                    };
                }
                else {
                    classObject.prototype[prototypeName] = function (...args) {
                        this.super = (...arggs) => { classPrototype.call(this, ...arggs); };
                        TheAnyPrototype.call(this, ...args);
                        return classPrototype.call(this, ...args);
                    };
                }
            }
            else {
                classObject.prototype[prototypeName] = prototype;
            }
        }
        else {
            let classAnyObject = classObject; //force any type, system will not accept otherwise!
            let classMethod = classAnyObject[prototypeName];
            if (classMethod instanceof Function) {
                if (overwrite) {
                    classAnyObject[prototypeName] = function (...args) {
                        this.super = (...arggs) => { classMethod.call(this, ...arggs); };
                        return TheAnyPrototype.call(this, ...args);
                    };
                }
                else if (loadBefore) {
                    classAnyObject[prototypeName] = function (...args) {
                        let result = classMethod.call(this, ...args);
                        this.super = (...arggs) => { classMethod.call(this, ...arggs); };
                        this.callResult = result;
                        return TheAnyPrototype.call(this, ...args);
                    };
                }
                else {
                    classAnyObject[prototypeName] = function (...args) {
                        this.super = (...arggs) => { classMethod.call(this, ...arggs); };
                        TheAnyPrototype.call(this, ...args);
                        return classMethod.call(this, ...args);
                    };
                }
            }
            else {
                classAnyObject[prototypeName] = prototype;
            }
        }
    }
}
Plugins.plugins = {};
Plugins.pluginsNames = [];
export { Plugins };
