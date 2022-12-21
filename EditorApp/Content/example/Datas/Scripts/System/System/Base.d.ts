/**
 *  The superclass that define all the System classes structure.
 *  @abstract
 *  @param {Record<string, any>} - [json=undefined]
 *  @param {any} args
 */
declare abstract class Base {
    protected constructor(json?: any, ...args: any);
    /**
     *  Assign the members
     *  @note was used due to Super calling method overwriting data with
     *  inheritance call;
     *  @fix adjusted the args parameters to be flexible and accepts arguments
     */
    setup(...args: any): void;
    /**
     *  Read the json data
     *  @param {Record<string, any>} - json
     */
    abstract read(json: Record<string, any>): void;
}
export { Base };
