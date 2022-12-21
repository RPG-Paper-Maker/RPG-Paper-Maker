import { EventCommand } from "../index.js";
import { Base } from "./Base.js";
/**
 *  Scene used for
 */
declare class ShowTextPreview extends Base {
    eventCommand: EventCommand.ShowText;
    currentState: Record<string, any>;
    isLoading: boolean;
    needRedraw: boolean;
    constructor();
    updateCommand(): Promise<void>;
    update(): void;
    drawHUD(): void;
}
export { ShowTextPreview };
