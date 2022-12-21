import { Base } from "./Base.js";
/** @class
 *  An event command for a comment (ignored).
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
declare class Comment extends Base {
    constructor(command: any[]);
}
export { Comment };
