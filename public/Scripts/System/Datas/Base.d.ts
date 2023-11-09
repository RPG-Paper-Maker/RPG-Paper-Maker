/** @class
 *  The abstract class who model the Structure of RPM datas.
 *  @static
 */
declare abstract class Base {
    static readonly STRING_ERROR_GET_1 = "Impossible to get the system ";
    static readonly STRING_ERROR_GET_2 = ". Please check if this ID exists in the software.";
    constructor();
    /**
     *  Get an element in a list by ID safely.
     *  @static
     *  @param {number} id - The ID to select
     *  @param {T[]} list - The list to browse
     *  @param {string} name - The name of the element to describe in the error
     *  message
     *  @param {boolean} isId - Indicate if searching for ID
     *  @param {string} errorMessage - The message error to force to display if not found
     *  @returns {T}
     */
    static get<T>(id: number, list: T[], name: string, isID?: boolean, errorMessage?: string): T;
}
export { Base };
