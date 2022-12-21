/** @class
 *  All the variables datas.
 *  @static
 */
declare class Variables {
    static VARIABLES_PER_PAGE: number;
    static variablesNumbers: number;
    static variablesNames: string[];
    constructor();
    /**
     *  Read the JSON file associated to variables.
     *  @static
     *  @async
     */
    static read(): Promise<void>;
    /**
     *  Get the variable name by ID.
     *  @param {number} id
     *  @returns {string}
     */
    static get(id: number): string;
}
export { Variables };
