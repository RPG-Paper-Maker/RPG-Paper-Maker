import { Enum } from "../Common/index.js";
import { Translatable } from "./Translatable.js";
/** @class
 *  A main menu command in scene main menu.
 *  @extends Translatable
 *  @param {Record<string, any>} [json=undefined] - Json object describing the item
 */
declare class MainMenuCommand extends Translatable {
    kind: Enum.MainMenuCommandKind;
    script: string;
    constructor(json?: Record<string, any>);
    /**
     *  Read the JSON associated to the main menu command.
     *  @param {Record<string, any>} - json Json object describing the main
     *  menu command.
     */
    read(json: Record<string, any>): void;
    /**
     *  Get the callbacks functions when clicking on command.
     *  @returns {(item: Core.Item) => boolean}
     */
    getCallback(): () => boolean;
}
export { MainMenuCommand };
