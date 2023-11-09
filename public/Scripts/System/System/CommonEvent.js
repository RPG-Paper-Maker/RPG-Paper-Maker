/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Parameter } from './Parameter.js';
/** @class
 *   An event that can be called.
 *   @param {Record<string, any>} - [json] json object describing the event
 */
class CommonEvent extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the event.
     *  @param {Record<string, any>} - json Json object describing the event
     */
    read(json) {
        this.parameters = Parameter.readParameters(json);
    }
}
export { CommonEvent };
