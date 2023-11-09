/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
/** @class
 *  An event command for a comment (ignored).
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class Comment extends Base {
    constructor(command) {
        super();
    }
}
export { Comment };
