/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { Tree } from '../Core/index.js';
import { Manager, EventCommand } from '../index.js';
/** @class
 *  A reaction to an event.
 *  @extends System.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  object reaction
 */
class Reaction extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Read the JSON associated to the object reaction.
     *  @param {Record<string, any>} - json Json object describing the object
     *  reaction
     */
    read(json) {
        this.labels = [];
        this.idEvent = json.id;
        // Options
        this.blockingHero = json.bh;
        // Read commands
        let jsonCommands = json.c;
        let commands = new Tree("root");
        this.readChildrenJSON(jsonCommands, commands.root);
        this.commands = commands;
    }
    /**
     *  Read the JSON children associated to the object reaction.
     *  @param {Record<string, any>} - jsonCommands Json object describing the
     *  object
     *  @param {Node} commands - All the commands (final result)
     */
    readChildrenJSON(jsonCommands, commands) {
        let showText = null;
        let command, node;
        for (let i = 0, l = jsonCommands.length; i < l; i++) {
            command = Manager.Events.getEventCommand(jsonCommands[i]);
            // Comment
            if (command instanceof EventCommand.Comment) {
                continue;
            }
            // Add node
            node = commands.add(command);
            // If text before choice, make a link
            if (command instanceof EventCommand.ShowText) {
                showText = command;
            }
            else if (command instanceof EventCommand.DisplayChoice || command
                instanceof EventCommand.InputNumber) {
                command.setShowText(showText);
                showText = null;
            }
            else if (command instanceof EventCommand.Label) {
                this.labels.push([command.name, node]);
                showText = null;
            }
            else {
                showText = null;
            }
            if (jsonCommands[i].children) {
                this.readChildrenJSON(jsonCommands[i].children, node);
            }
        }
    }
    /**
     *  Get the first node command of the reaction.
     *  @returns {Node}
     */
    getFirstCommand() {
        return this.commands.root.firstChild;
    }
}
export { Reaction };
