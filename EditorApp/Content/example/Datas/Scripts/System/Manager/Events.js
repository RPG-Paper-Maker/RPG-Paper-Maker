/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Portion, Game } from "../Core/index.js";
import { Enum } from "../Common/index.js";
var EventCommandKind = Enum.EventCommandKind;
import { EventCommand, Manager, Datas, Scene } from "../index.js";
/** @class
 *  A static class for some events functions.
 *  @static
 */
class Events {
    constructor() {
        throw new Error("This is a static class");
    }
    /**
     *  Get the event command and read json.
     *  @param {Record<string, any>} - json
     *  @returns {EventCommand.Base}
     */
    static getEventCommand(json) {
        let command = json.command;
        switch (json.kind) {
            case EventCommandKind.ShowText:
                return new EventCommand.ShowText(command);
            case EventCommandKind.ChangeVariables:
                return new EventCommand.ChangeVariables(command);
            case EventCommandKind.GameOver:
                return new EventCommand.GameOver(command);
            case EventCommandKind.While:
                return new EventCommand.While(command);
            case EventCommandKind.WhileBreak:
                return new EventCommand.WhileBreak(command);
            case EventCommandKind.InputNumber:
                return new EventCommand.InputNumber(command);
            case EventCommandKind.If:
                return new EventCommand.If(command);
            case EventCommandKind.Else:
                return new EventCommand.Else(command);
            case EventCommandKind.OpenMainMenu:
                return new EventCommand.OpenMainMenu(command);
            case EventCommandKind.OpenSavesMenu:
                return new EventCommand.OpenSavesMenu(command);
            case EventCommandKind.ModifyInventory:
                return new EventCommand.ModifyInventory(command);
            case EventCommandKind.ModifyTeam:
                return new EventCommand.ModifyTeam(command);
            case EventCommandKind.StartBattle:
                return new EventCommand.StartBattle(command);
            case EventCommandKind.IfWin:
                return new EventCommand.IfWin(command);
            case EventCommandKind.IfLose:
                return new EventCommand.IfLose(command);
            case EventCommandKind.ChangeState:
                return new EventCommand.ChangeState(command);
            case EventCommandKind.SendEvent:
                return new EventCommand.SendEvent(command);
            case EventCommandKind.TeleportObject:
                return new EventCommand.TeleportObject(command);
            case EventCommandKind.MoveObject:
                return new EventCommand.MoveObject(command);
            case EventCommandKind.Wait:
                return new EventCommand.Wait(command);
            case EventCommandKind.MoveCamera:
                return new EventCommand.MoveCamera(command);
            case EventCommandKind.PlayMusic:
                return new EventCommand.PlayMusic(command);
            case EventCommandKind.StopMusic:
                return new EventCommand.StopMusic(command);
            case EventCommandKind.PlayBackgroundSound:
                return new EventCommand.PlayBackgroundSound(command);
            case EventCommandKind.StopBackgroundSound:
                return new EventCommand.StopBackgroundSound(command);
            case EventCommandKind.PlaySound:
                return new EventCommand.PlaySound(command);
            case EventCommandKind.PlayMusicEffect:
                return new EventCommand.PlayMusicEffect(command);
            case EventCommandKind.ChangeProperty:
                return new EventCommand.ChangeProperty(command);
            case EventCommandKind.DisplayChoice:
                return new EventCommand.DisplayChoice(command);
            case EventCommandKind.Choice:
                return new EventCommand.Choice(command);
            case EventCommandKind.Script:
                return new EventCommand.Script(command);
            case EventCommandKind.DisplayAPicture:
                return new EventCommand.DisplayAPicture(command);
            case EventCommandKind.SetMoveTurnAPicture:
                return new EventCommand.SetMoveTurnAPicture(command);
            case EventCommandKind.RemoveAPicture:
                return new EventCommand.RemoveAPicture(command);
            case EventCommandKind.SetDialogBoxOptions:
                return new EventCommand.SetDialogBoxOptions(command);
            case EventCommandKind.TitleScreen:
                return new EventCommand.TitleScreen(command);
            case EventCommandKind.ChangeScreenTone:
                return new EventCommand.ChangeScreenTone(command);
            case EventCommandKind.RemoveObjectFromMap:
                return new EventCommand.RemoveObjectFromMap(command);
            case EventCommandKind.StopReaction:
                return new EventCommand.StopReaction(command);
            case EventCommandKind.AllowForbidSaves:
                return new EventCommand.AllowForbidSaves(command);
            case EventCommandKind.AllowForbidMainMenu:
                return new EventCommand.AllowForbidMainMenu(command);
            case EventCommandKind.CallACommonReaction:
                return new EventCommand.CallACommonReaction(command);
            case EventCommandKind.Label:
                return new EventCommand.Label(command);
            case EventCommandKind.JumpLabel:
                return new EventCommand.JumpToLabel(command);
            case EventCommandKind.Comment:
                return new EventCommand.Comment(command);
            case EventCommandKind.ChangeAStatistic:
                return new EventCommand.ChangeAStatistic(command);
            case EventCommandKind.ChangeASkill:
                return new EventCommand.ChangeASkill(command);
            case EventCommandKind.ChangeName:
                return new EventCommand.ChangeName(command);
            case EventCommandKind.ChangeEquipment:
                return new EventCommand.ChangeEquipment(command);
            case EventCommandKind.ModifyCurrency:
                return new EventCommand.ModifyCurrency(command);
            case EventCommandKind.DisplayAnAnimation:
                return new EventCommand.DisplayAnAnimation(command);
            case EventCommandKind.ShakeScreen:
                return new EventCommand.ShakeScreen(command);
            case EventCommandKind.FlashScreen:
                return new EventCommand.FlashScreen(command);
            case EventCommandKind.Plugin:
                return new EventCommand.Plugin(command);
            case EventCommandKind.StartShopMenu:
                return new EventCommand.StartShopMenu(command);
            case EventCommandKind.RestockShop:
                return new EventCommand.StartShopMenu(command, true);
            case EventCommandKind.EnterANameMenu:
                return new EventCommand.EnterANameMenu(command);
            case EventCommandKind.CreateObjectInMap:
                return new EventCommand.CreateObjectInMap(command);
            case EventCommandKind.ChangeStatus:
                return new EventCommand.ChangeStatus(command);
            case EventCommandKind.ResetCamera:
                return new EventCommand.ResetCamera(command);
            case EventCommandKind.ChangeBattleMusic:
                return new EventCommand.ChangeBattleMusic(command);
            case EventCommandKind.ChangeVictoryMusic:
                return new EventCommand.ChangeVictoryMusic(command);
            case EventCommandKind.EndBattle:
                return new EventCommand.EndBattle(command);
            case EventCommandKind.ForceAnAction:
                return new EventCommand.ForceAnAction(command);
            case EventCommandKind.ChangeMapProperties:
                return new EventCommand.ChangeMapProperties(command);
            case EventCommandKind.ChangeExperienceCurve:
                return new EventCommand.ChangeExperienceCurve(command);
            case EventCommandKind.ChangeClass:
                return new EventCommand.ChangeClass(command);
            case EventCommandKind.ChangeChronometer:
                return new EventCommand.ChangeChronometer(command);
            case EventCommandKind.ChangeWeather:
                return new EventCommand.ChangeWeather(command);
            case EventCommandKind.PlayAVideo:
                return new EventCommand.PlayAVideo(command);
            case EventCommandKind.SwitchTexture:
                return new EventCommand.SwitchTexture(command);
            default:
                return null;
        }
    }
    /**
     *  Send an event.
     *  @static
     *  @param {MapObject} sender - The sender of this event
     *  @param {number} targetKind - The kind of target
     *  @param {number} targetID - The target ID
     *  @param {boolean} isSystem - Boolean indicating if it is an event System
     *  @param {number} eventID - The event ID
     *  @param {Parameter[]} parameters - List of all the parameters
     *  @param {boolean} senderNoReceiver - Indicate if the sender should not
     *  receive event
     */
    static sendEvent(sender, targetKind, targetID, isSystem, eventID, parameters, senderNoReceiver, onlyTheClosest) {
        switch (targetKind) {
            case 0: // Send to all
                Manager.Events.sendEventDetection(sender, -1, isSystem, eventID, parameters);
                break;
            case 1: // Send to detection
                Manager.Events.sendEventDetection(sender, targetID, isSystem, eventID, parameters, senderNoReceiver, onlyTheClosest);
                break;
            case 2: // Send to a particular object
                if (targetID === -1) {
                    // Send to sender
                    sender.receiveEvent(sender, isSystem, eventID, parameters, sender.states);
                }
                else if (targetID === 0) {
                    // Send to the hero
                    Game.current.hero.receiveEvent(sender, isSystem, eventID, parameters, Game.current.heroStates);
                }
                else {
                    Scene.Map.current.updatePortions(this, function (x, y, z, i, j, k) {
                        let objects = Game.current.getPortionDatas(Scene.Map
                            .current.id, new Portion(x, y, z));
                        // Moved objects
                        let a, l, object;
                        for (a = 0, l = objects.min.length; a < l; a++) {
                            object = objects.min[a];
                            if (object.system.id === targetID) {
                                object.receiveEvent(sender, isSystem, eventID, parameters, object.states);
                                break;
                            }
                        }
                        for (a = 0, l = objects.mout.length; a < l; a++) {
                            object = objects.mout[a];
                            if (object.system.id === targetID) {
                                object.receiveEvent(sender, isSystem, eventID, parameters, object.states);
                                break;
                            }
                        }
                        // Static
                        let mapPortion = Scene.Map.current.getMapPortion(new Portion(i, j, k));
                        if (mapPortion) {
                            for (a = 0, l = mapPortion.objectsList.length; a < l; a++) {
                                object = mapPortion.objectsList[a];
                                if (object.system.id === targetID) {
                                    object.receiveEvent(sender, isSystem, eventID, parameters, object.states);
                                    break;
                                }
                            }
                            if (mapPortion.heroID === targetID) {
                                Game.current.hero.receiveEvent(sender, isSystem, eventID, parameters, Game.current.heroStates);
                            }
                        }
                    });
                }
                break;
            default:
                break;
        }
    }
    /**
     *  Send an event detection
     *  @static
     *  @param {MapObject} sender - The sender of this event
     *  @param {number} targetID - The target ID
     *  @param {boolean} isSystem - Boolean indicating if it is an event System
     *  @param {number} eventID - The event ID
     *  @param {Parameter[]} parameters - List of all the parameters
     *  @param {boolean} senderNoReceiver - Indicate if the sender should not
     *  receive event
     */
    static sendEventDetection(sender, targetID, isSystem, eventID, parameters, senderNoReceiver = false, onlyTheClosest = false) {
        let objects;
        let closests = [];
        Scene.Map.current.updatePortions(this, (x, y, z, i, j, k) => {
            objects = Game.current.getPortionDatas(Scene.Map.current.id, new Portion(x, y, z));
            // Moved objects
            Manager.Events.sendEventObjects(objects.min, sender, targetID, isSystem, eventID, parameters, senderNoReceiver, onlyTheClosest, closests);
            Manager.Events.sendEventObjects(objects.mout, sender, targetID, isSystem, eventID, parameters, senderNoReceiver, onlyTheClosest, closests);
            // Static
            let mapPortion = Scene.Map.current.getMapPortion(new Portion(i, j, k));
            if (mapPortion) {
                Manager.Events.sendEventObjects(mapPortion.objectsList, sender, targetID, isSystem, eventID, parameters, senderNoReceiver, onlyTheClosest, closests);
            }
        });
        // And the hero!
        if (!senderNoReceiver || sender !== Game.current.hero) {
            if (targetID !== -1) {
                // Check according to detection model
                if (!Datas.Systems.getDetection(targetID).checkCollision(sender, Game.current.hero)) {
                    return;
                }
            }
            if (onlyTheClosest) {
                closests.push([Game.current.hero, sender, isSystem, eventID,
                    parameters, Game.current.heroStates]);
            }
            else {
                Game.current.hero.receiveEvent(sender, isSystem, eventID, parameters, Game.current.heroStates);
            }
        }
        // If only sending to the closest to the sender...
        if (onlyTheClosest && closests.length > 0) {
            let closest = closests[0], d1, d2;
            for (let i = 1, l = closests.length; i < l; i++) {
                d1 = closest[0].position.distanceTo(sender.position);
                d2 = closests[i][0].position.distanceTo(sender.position);
                if (d1 >= d2) {
                    closest = closests[i];
                }
            }
            closest[0].receiveEvent(closest[1], closest[2], closest[3], closest[4], closest[5]);
        }
    }
    /**
     *  Send an event to objects.
     *  @static
     *  @param {MapObject[]} objects - The list of objects to send event
     *  @param {MapObject} sender - The sender of this event
     *  @param {number} targetID - The target ID
     *  @param {boolean} isSystem - Boolean indicating if it is an event System
     *  @param {number} eventID - The event ID
     *  @param {Parameter[]} parameters - List of all the parameters
     *  @param {boolean} senderNoReceiver - Indicate if the sender should not
     *  receive event
     *  @param {boolean} onlyTheClosest
     *  @param {any[][]} closests
     */
    static sendEventObjects(objects, sender, targetID, isSystem, eventID, parameters, senderNoReceiver, onlyTheClosest, closests) {
        let object;
        for (let i = 0, l = objects.length; i < l; i++) {
            object = objects[i];
            if (senderNoReceiver && sender === object) {
                continue;
            }
            if (targetID !== -1) {
                // Check according to detection model
                if (!Datas.Systems.getDetection(targetID).checkCollision(sender, object)) {
                    continue;
                }
            }
            // Make the object receive the event
            if (onlyTheClosest) {
                closests.push([object, sender, isSystem, eventID, parameters,
                    object.states]);
            }
            else {
                object.receiveEvent(sender, isSystem, eventID, parameters, object
                    .states);
            }
        }
    }
}
export { Events };
