/**
 * The Input and Output class who handles loading and saving.
 *
 * @class IO
 */
declare class IO {
    constructor();
    /**
     *  Check if a file exists.
     *  @static
     *  @param {string} url - The path of the file
     *  @returns {Promise<boolean>}
     */
    static fileExists: (url: string) => Promise<boolean>;
    /**
     *  Open an existing file.
     *  @static
     *  @param {string} url - The path of the file
     *  @returns {string}
     */
    static openFile: (url: string) => Promise<string>;
    /**
     *  Open and parse an existing file.
     *  @static
     *  @param {string} url - The path of the file
     *  @returns {Promise<Record<string, any>>}
     */
    static parseFileJSON: (url: string) => Promise<Record<string, any>>;
    /**
     *  Write a json file.
     *  @static
     *  @param {string} url - The path of the file
     *  @param {Object} obj - An object that can be stringified by JSON
     */
    static saveFile: (url: string, obj: Object) => Promise<any>;
}
export { IO };
