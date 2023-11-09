/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from './Base.js';
import { System, Datas, EventCommand, Scene, Manager } from '../index.js';
import { Enum, Utils, Mathf, Platform } from '../Common/index.js';
var CommandMoveKind = Enum.CommandMoveKind;
var Orientation = Enum.Orientation;
import { MapObject, Game, Vector3 } from '../Core/index.js';
/** @class
 *  An event command for moving object.
 *  @extends EventCommand.Base
 *  @param {any[]} command - Direct JSON command to parse
 */
class MoveObject extends Base {
    constructor(command) {
        super();
        let iterator = {
            i: 0
        };
        let l = command.length;
        // Object ID
        this.objectID = System.DynamicValue.createValueCommand(command, iterator);
        // Options
        this.isIgnore = Utils.numToBool(command[iterator.i++]);
        this.isWaitEnd = Utils.numToBool(command[iterator.i++]);
        this.isCameraOrientation = Utils.numToBool(command[iterator.i++]);
        // List of move commands
        this.moves = [];
        this.parameters = [];
        let permanent;
        while (iterator.i < l) {
            this.kind = command[iterator.i++];
            if (this.kind >= CommandMoveKind.MoveNorth && this.kind <=
                CommandMoveKind.MoveBack) {
                this.parameters.push({
                    square: !Utils.numToBool(command[iterator.i++])
                });
                switch (this.kind) {
                    case CommandMoveKind.MoveNorth:
                        this.moves.push(this.moveNorth);
                        break;
                    case CommandMoveKind.MoveSouth:
                        this.moves.push(this.moveSouth);
                        break;
                    case CommandMoveKind.MoveWest:
                        this.moves.push(this.moveWest);
                        break;
                    case CommandMoveKind.MoveEast:
                        this.moves.push(this.moveEast);
                        break;
                    case CommandMoveKind.MoveNorthWest:
                        this.moves.push(this.moveNorthWest);
                        break;
                    case CommandMoveKind.MoveNorthEast:
                        this.moves.push(this.moveNorthEast);
                        break;
                    case CommandMoveKind.MoveSouthWest:
                        this.moves.push(this.moveSouthWest);
                        break;
                    case CommandMoveKind.MoveSouthEast:
                        this.moves.push(this.moveSouthEast);
                        break;
                    case CommandMoveKind.MoveRandom:
                        this.moves.push(this.moveRandom);
                        break;
                    case CommandMoveKind.MoveHero:
                        this.moves.push(this.moveHero);
                        break;
                    case CommandMoveKind.MoveOppositeHero:
                        this.moves.push(this.moveOppositeHero);
                        break;
                    case CommandMoveKind.MoveFront:
                        this.moves.push(this.moveFront);
                        break;
                    case CommandMoveKind.MoveBack:
                        this.moves.push(this.moveBack);
                        break;
                    case CommandMoveKind.Jump:
                        this.moves.push(this.jump);
                        break;
                }
            }
            else if (this.kind === CommandMoveKind.Jump) {
                let square = !Utils.numToBool(command[iterator.i++]);
                let x = System.DynamicValue.createValueCommand(command, iterator);
                let y = System.DynamicValue.createValueCommand(command, iterator);
                let yPlus = System.DynamicValue.createValueCommand(command, iterator);
                let z = System.DynamicValue.createValueCommand(command, iterator);
                let peakY = System.DynamicValue.createValueCommand(command, iterator);
                let peakYPlus = System.DynamicValue.createValueCommand(command, iterator);
                let time = System.DynamicValue.createValueCommand(command, iterator);
                this.parameters.push({
                    square: square,
                    x: x,
                    y: y,
                    yPlus: yPlus,
                    z: z,
                    peakY: peakY,
                    peakYPlus: peakYPlus,
                    time: time
                });
                this.moves.push(this.jump);
            }
            else if (this.kind === CommandMoveKind.ChangeGraphics) {
                permanent = Utils.numToBool(command[iterator.i++]);
                let dontChangeOrientation = Utils.numToBool(command[iterator.i++]);
                let indexKind = command[iterator.i++];
                let kind = Enum.ElementMapKind.None;
                switch (indexKind) {
                    case 0:
                        kind = Enum.ElementMapKind.None;
                        break;
                    case 1:
                        kind = Enum.ElementMapKind.SpritesFix;
                        break;
                    case 2:
                        kind = Enum.ElementMapKind.SpritesFace;
                        break;
                    case 3:
                        kind = Enum.ElementMapKind.Object3D;
                        break;
                }
                let pictureID = System.DynamicValue.createValueCommand(command, iterator);
                iterator.i++;
                let indexX = command[iterator.i++];
                let indexY = command[iterator.i++];
                let width = command[iterator.i++];
                let height = command[iterator.i++];
                this.parameters.push({
                    permanent: permanent,
                    dontChangeOrientation: dontChangeOrientation,
                    kind: kind,
                    pictureID: pictureID,
                    indexX: indexX,
                    indexY: indexY,
                    width: width,
                    height: height
                });
                this.moves.push(this.changeGraphics);
            }
            else if (this.kind >= CommandMoveKind.TurnNorth && this.kind <=
                CommandMoveKind.LookAtHeroOpposite) {
                this.parameters.push({});
                switch (this.kind) {
                    case CommandMoveKind.TurnNorth:
                        this.moves.push(this.turnNorth);
                        break;
                    case CommandMoveKind.TurnSouth:
                        this.moves.push(this.turnSouth);
                        break;
                    case CommandMoveKind.TurnWest:
                        this.moves.push(this.turnWest);
                        break;
                    case CommandMoveKind.TurnEast:
                        this.moves.push(this.turnEast);
                        break;
                    case CommandMoveKind.Turn90Right:
                        this.moves.push(this.turn90Right);
                        break;
                    case CommandMoveKind.Turn90Left:
                        this.moves.push(this.turn90Left);
                        break;
                    case CommandMoveKind.LookAtHero:
                        this.moves.push(this.lookAtHero);
                        break;
                    case CommandMoveKind.LookAtHeroOpposite:
                        this.moves.push(this.lookAtHeroOpposite);
                        break;
                }
            }
            else if (this.kind === CommandMoveKind.ChangeSpeed || this.kind
                === CommandMoveKind.ChangeFrequency) {
                let permanent = Utils.numToBool(command[iterator.i++]);
                let value = System.DynamicValue.createValueCommand(command, iterator);
                this.parameters.push({
                    permanent: permanent,
                    value: value
                });
                if (this.kind === CommandMoveKind.ChangeSpeed) {
                    this.moves.push(this.changeSpeed);
                }
                else {
                    this.moves.push(this.changeFrequency);
                }
            }
            else if (this.kind >= CommandMoveKind.MoveAnimation && this.kind
                <= CommandMoveKind.KeepPosition) {
                let onOff = Utils.numToBool(command[iterator.i++]);
                let permanent = Utils.numToBool(command[iterator.i++]);
                this.parameters.push({
                    onOff: onOff,
                    permanent: permanent
                });
                switch (this.kind) {
                    case CommandMoveKind.MoveAnimation:
                        this.moves.push(this.moveAnimation);
                        break;
                    case CommandMoveKind.StopAnimation:
                        this.moves.push(this.stopAnimation);
                        break;
                    case CommandMoveKind.ClimbAnimation:
                        this.moves.push(this.climbAnimation);
                        break;
                    case CommandMoveKind.FixDirection:
                        this.moves.push(this.directionFix);
                        break;
                    case CommandMoveKind.Through:
                        this.moves.push(this.through);
                        break;
                    case CommandMoveKind.SetWithCamera:
                        this.moves.push(this.setWithCamera);
                        break;
                    case CommandMoveKind.PixelOffset:
                        this.moves.push(this.pixelOffset);
                        break;
                    case CommandMoveKind.KeepPosition:
                        this.moves.push(this.keepPosition);
                        break;
                }
            }
            else if (this.kind >= CommandMoveKind.Wait && this.kind <=
                CommandMoveKind.Script) {
                let kind, l;
                switch (this.kind) {
                    case CommandMoveKind.Wait:
                        kind = Enum.EventCommandKind.Wait;
                        l = 2;
                        break;
                    case CommandMoveKind.PlaySound:
                        kind = Enum.EventCommandKind.PlaySound;
                        l = 12;
                        break;
                    case CommandMoveKind.Script:
                        kind = Enum.EventCommandKind.Script;
                        l = Utils.numToBool(command[iterator.i]) ? 3 : 2;
                        break;
                }
                let commandList = command.slice(iterator.i, iterator.i + l);
                iterator.i += l;
                let eventCommand = Manager.Events.getEventCommand({
                    kind: kind,
                    command: commandList
                });
                this.parameters.push({
                    command: eventCommand
                });
                this.moves.push(this.useCommand);
            }
        }
        this.parallel = !this.isWaitEnd;
    }
    /**
     *  Get the opposite orientation.
     *  @static
     *  @param {Orientation} orientation - The orientation
     *  @returns {Orientation} The current state
     */
    static oppositeOrientation(orientation) {
        switch (orientation) {
            case Orientation.South:
                return Orientation.North;
            case Orientation.West:
                return Orientation.East;
            case Orientation.North:
                return Orientation.South;
            case Orientation.East:
                return Orientation.West;
            case Orientation.SouthWest:
                return Orientation.NorthEast;
            case Orientation.SouthEast:
                return Orientation.NorthWest;
            case Orientation.NorthWest:
                return Orientation.SouthEast;
            case Orientation.NorthEast:
                return Orientation.SouthWest;
        }
    }
    /**
     *  Initialize the current state.
     *  @returns {Record<string, any>} The current state
     */
    initialize() {
        return {
            parallel: this.isWaitEnd,
            index: 0,
            distance: 0,
            normalDistance: 0,
            position: null,
            waitingPosition: false,
            moved: false,
            object: null,
            random: Mathf.random(0, 3),
            moveHeroOrientation: null,
            pause: false,
            currentTime: -1,
            commandState: null
        };
    }
    /**
     *  Function to move north.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {bool} square - Indicate if it is a square move
     *  @param {Orientation} orientation - The orientation where to move
     *  @returns {boolean}
     */
    move(currentState, object, square, orientation) {
        if (object.moveFrequencyTick > 0) {
            return false;
        }
        let angle = this.isCameraOrientation ? Scene.Map.current.camera
            .horizontalAngle : -90.0;
        if (currentState.position === null && square) {
            currentState.position = object.getFuturPosition(orientation, Datas
                .Systems.SQUARE_SIZE, angle)[0];
        }
        if (object.previousMoveCommand === null && object.previousOrientation
            === null) {
            object.previousMoveCommand = this;
            object.previousOrientation = orientation;
        }
        else if (object.previousMoveCommand === this) {
            if (object.otherMoveCommand) {
                this.moveFrequency(object);
                return true;
            }
        }
        else if (object.previousMoveCommand && object.otherMoveCommand &&
            object.otherMoveCommand !== this) {
            this.moveFrequency(object);
            return true;
        }
        else if (object.previousMoveCommand !== this) {
            object.otherMoveCommand = this;
        }
        let distances = object.move(orientation, Datas.Systems.SQUARE_SIZE -
            currentState.distance, angle, this.isCameraOrientation);
        currentState.distance += distances[0];
        currentState.normalDistance += distances[1];
        if (!square || (square && currentState.normalDistance >= Datas.Systems
            .SQUARE_SIZE) || (square && currentState.distance >= Datas.Systems
            .SQUARE_SIZE || (distances[0] === 0))) {
            if (distances[0] === 0 && square && !this.isIgnore) {
                currentState.position = null;
                object.moving = true;
                return false;
            }
            if (square && currentState.distance === currentState.normalDistance) {
                object.position = currentState.position;
            }
            object.previousOrientation = null;
            object.previousMoveCommand = null;
            object.otherMoveCommand = null;
            this.moveFrequency(object);
            return true;
        }
        return false;
    }
    /**
     *  Change the frequency tick of the object.
     *  @param {MapObject} object - The object to move
     */
    moveFrequency(object) {
        object.moveFrequencyTick = object.frequency.getValue() * 1000;
    }
    /**
     *  Function to move north.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    moveNorth(currentState, object, parameters) {
        return object ? this.move(currentState, object, parameters.square, Orientation.North) : Orientation.North;
    }
    /**
     *  Function to move south.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    moveSouth(currentState, object, parameters) {
        if (object) {
            return this.move(currentState, object, parameters.square, Orientation.South);
        }
        return Orientation.South;
    }
    /**
     *  Function to move west.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
    */
    moveWest(currentState, object, parameters) {
        if (object) {
            return this.move(currentState, object, parameters.square, Orientation.West);
        }
        return Orientation.West;
    }
    /**
     *  Function to move east.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    moveEast(currentState, object, parameters) {
        if (object) {
            return this.move(currentState, object, parameters.square, Orientation.East);
        }
        return Orientation.East;
    }
    /**
     *  Function to move north west.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    moveNorthWest(currentState, object, parameters) {
        if (object) {
            object.previousOrientation = Orientation.North;
        }
        let orientation = this.moveWest(currentState, object, parameters);
        return object ? orientation : Orientation.North;
    }
    /**
     *  Function to move north west.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    moveNorthEast(currentState, object, parameters) {
        if (object) {
            object.previousOrientation = Orientation.North;
        }
        let orientation = this.moveEast(currentState, object, parameters);
        return object ? orientation : Orientation.North;
    }
    /**
     *  Function to move north west.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    moveSouthWest(currentState, object, parameters) {
        if (object) {
            object.previousOrientation = Orientation.South;
        }
        let orientation = this.moveWest(currentState, object, parameters);
        return object ? orientation : Orientation.South;
    }
    /**
     *  Function to move north west.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
    */
    moveSouthEast(currentState, object, parameters) {
        if (object) {
            object.previousOrientation = Orientation.South;
        }
        let orientation = this.moveEast(currentState, object, parameters);
        return object ? orientation : Orientation.South;
    }
    /**
     *  Function to move random.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    moveRandom(currentState, object, parameters) {
        switch (currentState.random) {
            case CommandMoveKind.MoveNorth:
                return this.moveNorth(currentState, object, parameters);
            case CommandMoveKind.MoveSouth:
                return this.moveSouth(currentState, object, parameters);
            case CommandMoveKind.MoveWest:
                return this.moveWest(currentState, object, parameters);
            case CommandMoveKind.MoveEast:
                return this.moveEast(currentState, object, parameters);
        }
    }
    /**
     *  Function to move hero.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
    */
    moveHero(currentState, object, parameters) {
        return this.moveHeroAndOpposite(currentState, object, parameters, false);
    }
    /**
     *  Function to move opposite to hero.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
    */
    moveOppositeHero(currentState, object, parameters) {
        return this.moveHeroAndOpposite(currentState, object, parameters, true);
    }
    /**
     *  Function to move hero and opposite hero.
     *  @param {Object} currentState - The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Object} parameters - The parameters
     *  @param {boolean} opposite - Indicate if opposite
     *  @returns {Orientation}
    */
    moveHeroAndOpposite(currentState, object, parameters, opposite) {
        if (object) {
            let orientation = currentState.moveHeroOrientation === null ? this
                .getHeroOrientation(object) : currentState.moveHeroOrientation;
            currentState.moveHeroOrientation = orientation;
            if (opposite) {
                orientation = EventCommand.MoveObject.oppositeOrientation(orientation);
            }
            switch (orientation) {
                case Orientation.SouthWest:
                    return this.moveSouthWest(currentState, object, parameters);
                case Orientation.SouthEast:
                    return this.moveSouthEast(currentState, object, parameters);
                case Orientation.NorthWest:
                    return this.moveNorthWest(currentState, object, parameters);
                case Orientation.NorthEast:
                    return this.moveNorthEast(currentState, object, parameters);
                default:
                    return this.move(currentState, object, parameters.square, orientation);
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to move front.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
    */
    moveFront(currentState, object, parameters) {
        if (object) {
            let orientation = currentState.moveHeroOrientation === null ? object
                .orientationEye : currentState.moveHeroOrientation;
            currentState.moveHeroOrientation = orientation;
            return this.move(currentState, object, parameters.square, currentState.moveHeroOrientation);
        }
        return Orientation.None;
    }
    /**
     *  Function to move back.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
    */
    moveBack(currentState, object, parameters) {
        if (object) {
            let orientation = currentState.moveHeroOrientation === null ?
                EventCommand.MoveObject.oppositeOrientation(object.orientationEye) : currentState.moveHeroOrientation;
            currentState.moveHeroOrientation = orientation;
            return this.move(currentState, object, parameters.square, currentState.moveHeroOrientation);
        }
        return Orientation.None;
    }
    /**
     *  Function to jump.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
    */
    jump(currentState, object, parameters) {
        if (object) {
            if (currentState.currentTime === -1) {
                currentState.currentTime = 0;
                currentState.startJump = new Vector3(object.position.x, object
                    .position.y, object.position.z);
                let square = parameters.square ? Datas.Systems.SQUARE_SIZE : 1;
                currentState.endJump = new Vector3(parameters.x.getValue() *
                    square + currentState.startJump.x, parameters.y.getValue() *
                    square + parameters.yPlus.getValue() + currentState.startJump
                    .y, parameters.z.getValue() * square + currentState.startJump.z);
                currentState.peak = parameters.peakY.getValue() * Datas.Systems
                    .SQUARE_SIZE + parameters.peakYPlus.getValue();
                if (currentState.peak < currentState.endJump.y) {
                    Platform.showErrorMessage("Move object command: jump peak cannot be lower than final y position offset. Final position=" +
                        currentState.endJump.y + "px, Peak position=" + currentState.peak + "px");
                }
                currentState.time = parameters.time.getValue() * 1000;
            }
            currentState.currentTime = object.jump(currentState.startJump, currentState.endJump, currentState.peak, currentState
                .currentTime, currentState.time);
            if (currentState.currentTime === currentState.time) {
                currentState.currentTime = -1;
                return true;
            }
            else {
                return false;
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to look at north.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    turnNorth(currentState, object, parameters) {
        if (object) {
            object.lookAt(Orientation.North);
            return true;
        }
        return Orientation.North;
    }
    /**
     *  Function to look at south.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    turnSouth(currentState, object, parameters) {
        if (object) {
            object.lookAt(Orientation.South);
            return true;
        }
        return Orientation.South;
    }
    /**
     *  Function to look at west.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    turnWest(currentState, object, parameters) {
        if (object) {
            object.lookAt(Orientation.West);
            return true;
        }
        return Orientation.West;
    }
    /**
     *  Function to look at east.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    turnEast(currentState, object, parameters) {
        if (object) {
            object.lookAt(Orientation.East);
            return true;
        }
        return Orientation.East;
    }
    /**
     *  Function to look at 90° right.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    turn90Right(currentState, object, parameters) {
        if (object) {
            object.lookAt((object.orientationEye + 1) % 4);
            return true;
        }
        return Orientation.None;
    }
    /**
     *  Function to look at 90° left.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    turn90Left(currentState, object, parameters) {
        if (object) {
            object.lookAt((object.orientationEye - 1) % 4);
            return true;
        }
        return Orientation.None;
    }
    /**
     *  Function to look at hero.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    lookAtHero(currentState, object, parameters) {
        if (object) {
            object.lookAt(object.getOrientationBetween(Game.current.hero));
            return true;
        }
        return Orientation.None;
    }
    /**
     *  Function to look at hero opposite.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    lookAtHeroOpposite(currentState, object, parameters) {
        if (object) {
            object.lookAt((object.getOrientationBetween(Game.current.hero) + 2) % 4);
            return true;
        }
        return Orientation.None;
    }
    /**
     *  Function to change graphics.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
    */
    changeGraphics(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.previousGraphicKind = object
                .currentStateInstance.graphicKind;
            object.currentStateInstance.graphicKind = parameters.kind;
            object.currentStateInstance.graphicID = parameters.pictureID
                .getValue();
            if (object.currentStateInstance.graphicID === 0) {
                object.currentStateInstance.rectTileset = [
                    parameters.indexX,
                    parameters.indexY,
                    parameters.width,
                    parameters.height
                ];
            }
            else {
                object.currentStateInstance.indexX = parameters.indexX;
                object.currentStateInstance.indexY = parameters.dontChangeOrientation ?
                    object.orientationEye : parameters.indexY;
            }
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.gid = object.currentStateInstance.graphicID;
                options.gk = object.currentStateInstance.graphicKind;
                options.gt = object.currentStateInstance.rectTileset;
                options.gix = object.currentStateInstance.indexX;
                options.giy = object.currentStateInstance.indexY;
            }
            // Graphic update
            object.changeState();
        }
        return Orientation.None;
    }
    /**
     *  Function to change speed.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    changeSpeed(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.speedID = parameters.value.getValue();
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.sid = object.currentStateInstance.speedID;
            }
            object.currentStateInstance.indexX = object.frame.value;
            object.currentStateInstance.indexY = object.orientation;
            object.changeState();
        }
        return Orientation.None;
    }
    /**
     *  Function to change frequency.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    changeFrequency(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.frequencyID = parameters.value.getValue();
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.fid = object.currentStateInstance.frequencyID;
            }
            object.currentStateInstance.indexX = object.frame.value;
            object.currentStateInstance.indexY = object.orientation;
            object.changeState();
        }
        return Orientation.None;
    }
    /**
     *  Function to move animation.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    moveAnimation(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.moveAnimation = parameters.onOff;
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.ma = object.currentStateInstance.moveAnimation;
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to stop animation.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    stopAnimation(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.stopAnimation = parameters.onOff;
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.sa = object.currentStateInstance.stopAnimation;
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to climb animation.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    climbAnimation(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.climbAnimation = parameters.onOff;
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.ca = object.currentStateInstance.climbAnimation;
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to direction fix.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    directionFix(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.directionFix = parameters.onOff;
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.df = object.currentStateInstance.directionFix;
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to through.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    through(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.through = parameters.onOff;
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.t = object.currentStateInstance.through;
            }
            // Update bounding box
            object.updateBB(object.position);
        }
        return Orientation.None;
    }
    /**
     *  Function to set with camera.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    setWithCamera(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.setWithCamera = parameters.onOff;
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.swc = object.currentStateInstance.setWithCamera;
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to pixel offset.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    pixelOffset(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.pixelOffset = parameters.onOff;
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.po = object.currentStateInstance.pixelOffset;
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to keep position.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    keepPosition(currentState, object, parameters) {
        if (object) {
            // Change object current state value
            object.currentStateInstance.keepPosition = parameters.onOff;
            // Permanent change
            if (parameters.permanent) {
                let options = this.getPermanentOptions(object);
                if (options === null) {
                    return;
                }
                options.kp = object.currentStateInstance.keepPosition;
            }
        }
        return Orientation.None;
    }
    /**
     *  Function to wait, play a sound, and script.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The object to move
     *  @param {Record<string, any>} - parameters The parameters
     *  @returns {Orientation}
     */
    useCommand(currentState, object, parameters) {
        if (object) {
            if (currentState.commandState === null) {
                currentState.commandState = parameters.command.initialize();
            }
            if (parameters.command.update(currentState.commandState, object) != 0) {
                currentState.commandState = null;
                return true;
            }
            return false;
        }
        return Orientation.None;
    }
    /**
     *  Get the hero orientation.
     *  @param {MapObject} object - The object to move
     *  @returns {Orientation}
    */
    getHeroOrientation(object) {
        let xDif = object.position.x - Game.current.hero.position.x;
        let zDif = object.position.z - Game.current.hero.position.z;
        let orientationX = Orientation.None;
        let orientationZ = Orientation.None;
        if (xDif > 1) {
            orientationX = Orientation.West;
        }
        else if (xDif < -1) {
            orientationX = Orientation.East;
        }
        if (zDif > 1) {
            orientationZ = Orientation.North;
        }
        else if (zDif < -1) {
            orientationZ = Orientation.South;
        }
        switch (orientationX) {
            case Orientation.None: {
                return orientationZ;
            }
            case Orientation.West: {
                switch (orientationZ) {
                    case Orientation.None:
                        return Orientation.West;
                    case Orientation.North:
                        return Orientation.NorthWest;
                    case Orientation.South:
                        return Orientation.SouthWest;
                }
            }
            case Orientation.East: {
                switch (orientationZ) {
                    case Orientation.None:
                        return Orientation.East;
                    case Orientation.North:
                        return Orientation.NorthEast;
                    case Orientation.South:
                        return Orientation.SouthEast;
                }
            }
        }
    }
    /**
     *  Get the current orientation.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @returns {Orientation}
     */
    getCurrentOrientation(currentState) {
        if (this.moves.length === 0) {
            return Orientation.None;
        }
        return this.moves[currentState.index].call(this, currentState);
    }
    /**
     *  Get the permanent options. Returns null if startup object.
     *  @param {Core.MapObject} - currentState The current state of the event
     *  @returns {Record<string, any>}
     */
    getPermanentOptions(object) {
        let statesOptions;
        if (object.isHero) {
            statesOptions = Game.current.heroStatesOptions;
        }
        else if (object.isStartup) {
            return null;
        }
        else {
            let portion = Scene.Map.current.allObjects[object.system.id]
                .getGlobalPortion();
            let portionDatas = Game.current.getPortionDatas(Scene.Map
                .current.id, portion);
            let indexProp = portionDatas.soi.indexOf(object.system.id);
            if (indexProp === -1) {
                statesOptions = [];
                portionDatas.soi.push(object.system.id);
                portionDatas.so.push(statesOptions);
            }
            else {
                statesOptions = portionDatas.so[indexProp];
            }
        }
        let options = statesOptions[object.currentState.id - 1];
        if (!options) {
            options = {};
            statesOptions[object.currentState.id - 1] = options;
        }
        return options;
    }
    /**
     *  Update and check if the event is finished.
     *  @param {Record<string, any>} - currentState The current state of the event
     *  @param {MapObject} object - The current object reacting
     *  @param {number} state - The state ID
     *  @returns {number} The number of node to pass
    */
    update(currentState, object, state) {
        if (currentState.pause) {
            return 0;
        }
        if (currentState.parallel && this.moves.length > 0) {
            if (!currentState.waitingObject) {
                let objectID = this.objectID.getValue();
                MapObject.search(objectID, (result) => {
                    currentState.object = result.object;
                }, object);
                currentState.waitingObject = true;
            }
            if (currentState.object !== null) {
                let finished = this.moves[currentState.index].call(this, currentState, currentState.object, this.parameters[currentState.index]);
                if (finished) {
                    currentState.distance = 0;
                    currentState.normalDistance = 0;
                    currentState.index = currentState.index + 1;
                    currentState.random = Mathf.random(0, 3);
                    currentState.position = null;
                    currentState.moveHeroOrientation = null;
                    // Check random battle steps
                    if (object && object.isHero) {
                        Scene.Map.current.mapProperties.checkRandomBattle();
                    }
                }
                return (this.moves[currentState.index] == null) ? 1 : 0;
            }
            return 0;
        }
        return 1;
    }
}
export { MoveObject };
