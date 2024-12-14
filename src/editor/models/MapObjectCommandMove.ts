/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { COMMAND_MOVE_KIND, EVENT_COMMAND_KIND, ITERATOR, Utils } from '../common';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';
import { MapObjectCommand, MapObjectCommandType } from './MapObjectCommand';

const { t } = i18next;
class MapObjectCommandMove extends Base {
	public command!: MapObjectCommandType[];

	static createMove(kind: COMMAND_MOVE_KIND) {
		const mapObjectCommand = new MapObjectCommandMove();
		mapObjectCommand.id = -1;
		mapObjectCommand.name = '';
		mapObjectCommand.command = [kind];
		return mapObjectCommand;
	}

	getKind(): COMMAND_MOVE_KIND {
		return Number(this.command[0]);
	}

	initialize(list: MapObjectCommandType[], iterator: ITERATOR) {
		this.id = -1;
		this.name = '';
		const kind = list[iterator.i++] as COMMAND_MOVE_KIND;
		this.command = [kind];
		let j = 1;
		switch (kind) {
			case COMMAND_MOVE_KIND.MOVE_NORTH:
			case COMMAND_MOVE_KIND.MOVE_SOUTH:
			case COMMAND_MOVE_KIND.MOVE_WEST:
			case COMMAND_MOVE_KIND.MOVE_EAST:
			case COMMAND_MOVE_KIND.MOVE_NORTH_WEST:
			case COMMAND_MOVE_KIND.MOVE_NORTH_EAST:
			case COMMAND_MOVE_KIND.MOVE_SOUTH_WEST:
			case COMMAND_MOVE_KIND.MOVE_SOUTH_EAST:
			case COMMAND_MOVE_KIND.MOVE_RANDOM:
			case COMMAND_MOVE_KIND.MOVE_HERO:
			case COMMAND_MOVE_KIND.MOVE_OPPOSITE_HERO:
			case COMMAND_MOVE_KIND.MOVE_FRONT:
			case COMMAND_MOVE_KIND.MOVE_BACK:
				break;
			case COMMAND_MOVE_KIND.CHANGE_GRAPHICS:
				j = 10;
				break;
			case COMMAND_MOVE_KIND.JUMP:
				j = 15;
				break;
			case COMMAND_MOVE_KIND.TURN_NORTH:
			case COMMAND_MOVE_KIND.TURN_SOUTH:
			case COMMAND_MOVE_KIND.TURN_WEST:
			case COMMAND_MOVE_KIND.TURN_EAST:
			case COMMAND_MOVE_KIND.TURN_90_RIGHT:
			case COMMAND_MOVE_KIND.TURN_90_LEFT:
			case COMMAND_MOVE_KIND.LOOK_AT_HERO:
			case COMMAND_MOVE_KIND.LOOK_AT_HERO_OPPOSITE:
				j = 0;
				break;
			case COMMAND_MOVE_KIND.CHANGE_SPEED:
			case COMMAND_MOVE_KIND.CHANGE_FREQUENCY:
				j = 3;
				break;
			case COMMAND_MOVE_KIND.MOVE_ANIMATION:
			case COMMAND_MOVE_KIND.STOP_ANIMATION:
			case COMMAND_MOVE_KIND.CLIMB_ANIMATION:
			case COMMAND_MOVE_KIND.FIX_DIRECTION:
			case COMMAND_MOVE_KIND.THROUGH:
			case COMMAND_MOVE_KIND.SET_WITH_CAMERA:
			case COMMAND_MOVE_KIND.PIXEL_OFFSET:
			case COMMAND_MOVE_KIND.KEEP_POSITION:
			case COMMAND_MOVE_KIND.WAIT:
				j = 2;
				break;
			case COMMAND_MOVE_KIND.PLAY_SOUND:
				j = 12;
				break;
			case COMMAND_MOVE_KIND.SCRIPT:
				j = Utils.numToBool(Number(list[1])) ? 3 : 2;
				break;
		}
		for (let k = 0; k < j; k++) {
			this.command.push(list[iterator.i++]);
		}
	}

	toString(): string {
		let str = '> ';
		const kind = this.getKind();
		const iterator = Utils.generateIterator();
		iterator.i++;
		switch (kind) {
			case COMMAND_MOVE_KIND.MOVE_NORTH:
			case COMMAND_MOVE_KIND.MOVE_SOUTH:
			case COMMAND_MOVE_KIND.MOVE_WEST:
			case COMMAND_MOVE_KIND.MOVE_EAST:
			case COMMAND_MOVE_KIND.MOVE_NORTH_WEST:
			case COMMAND_MOVE_KIND.MOVE_NORTH_EAST:
			case COMMAND_MOVE_KIND.MOVE_SOUTH_WEST:
			case COMMAND_MOVE_KIND.MOVE_SOUTH_EAST:
			case COMMAND_MOVE_KIND.MOVE_RANDOM:
			case COMMAND_MOVE_KIND.MOVE_HERO:
			case COMMAND_MOVE_KIND.MOVE_OPPOSITE_HERO:
			case COMMAND_MOVE_KIND.MOVE_FRONT:
			case COMMAND_MOVE_KIND.MOVE_BACK: {
				const squareStep = t(this.command[iterator.i++] === 0 ? 'square' : 'step');
				let direction = '';
				switch (kind) {
					case COMMAND_MOVE_KIND.MOVE_NORTH:
						direction = t('north');
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH:
						direction = t('south');
						break;
					case COMMAND_MOVE_KIND.MOVE_WEST:
						direction = t('west');
						break;
					case COMMAND_MOVE_KIND.MOVE_EAST:
						direction = t('east');
						break;
					case COMMAND_MOVE_KIND.MOVE_NORTH_WEST:
						direction = t('north.west');
						break;
					case COMMAND_MOVE_KIND.MOVE_NORTH_EAST:
						direction = t('north.east');
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH_WEST:
						direction = t('south.west');
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH_EAST:
						direction = t('south.east');
						break;
					case COMMAND_MOVE_KIND.MOVE_RANDOM:
						direction = t('random').toLowerCase();
						break;
					case COMMAND_MOVE_KIND.MOVE_HERO:
						direction = t('hero').toLowerCase();
						break;
					case COMMAND_MOVE_KIND.MOVE_OPPOSITE_HERO:
						direction = t('opposite.hero').toLowerCase();
						break;
					case COMMAND_MOVE_KIND.MOVE_FRONT:
						direction = t('front').toLowerCase();
						break;
					case COMMAND_MOVE_KIND.MOVE_BACK:
						direction = t('back').toLowerCase();
						break;
				}
				str += `${t('move.1')} ${squareStep} ${t('to')} ${direction}`;
				break;
			}
			case COMMAND_MOVE_KIND.JUMP: {
				const squareStep = t(this.command[iterator.i++] === 0 ? 'square' : 'step');
				const x = new DynamicValue();
				x.updateCommand(this.command, iterator);
				const y = new DynamicValue();
				y.updateCommand(this.command, iterator);
				const yp = new DynamicValue();
				yp.updateCommand(this.command, iterator);
				const z = new DynamicValue();
				z.updateCommand(this.command, iterator);
				const peakY = new DynamicValue();
				peakY.updateCommand(this.command, iterator);
				const peakYp = new DynamicValue();
				peakYp.updateCommand(this.command, iterator);
				const time = new DynamicValue();
				time.updateCommand(this.command, iterator);
				str += `${t(
					'jump'
				)} ${squareStep.toLowerCase()} X:${x.toString()}, Y:${y.toString()}, Y+:${yp.toString()}, Z:${z.toString()}, ${t(
					'peak'
				)} Y:${peakY.toString()}, Y+:${peakYp.toString()} ${t('time')}:${time.toString()}${i18next
					.t('seconds')
					.toLowerCase()}`;
				break;
			}
			case COMMAND_MOVE_KIND.TURN_NORTH:
				str += t('turn.north');
				break;
			case COMMAND_MOVE_KIND.TURN_SOUTH:
				str += t('turn.south');
				break;
			case COMMAND_MOVE_KIND.TURN_WEST:
				str += t('turn.west');
				break;
			case COMMAND_MOVE_KIND.TURN_EAST:
				str += t('turn.east');
				break;
			case COMMAND_MOVE_KIND.TURN_90_LEFT:
				str += t('turn.90.left');
				break;
			case COMMAND_MOVE_KIND.TURN_90_RIGHT:
				str += t('turn.90.right');
				break;
			case COMMAND_MOVE_KIND.LOOK_AT_HERO:
				str += t('look.at.hero');
				break;
			case COMMAND_MOVE_KIND.LOOK_AT_HERO_OPPOSITE:
				str += t('look.at.hero.opposite');
				break;
			case COMMAND_MOVE_KIND.CHANGE_SPEED:
			case COMMAND_MOVE_KIND.CHANGE_FREQUENCY: {
				let permanent = '';
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					permanent = `[${t('permanent')}]`;
				}
				const value = new DynamicValue();
				value.updateCommand(this.command, iterator);
				switch (kind) {
					case COMMAND_MOVE_KIND.CHANGE_SPEED:
						str += t('change.speed');
						break;
					case COMMAND_MOVE_KIND.CHANGE_FREQUENCY:
						str += t('change.frequency');
						break;
				}
				str += `: ${value.toString()} ${permanent}`;
				break;
			}
			case COMMAND_MOVE_KIND.MOVE_ANIMATION:
			case COMMAND_MOVE_KIND.STOP_ANIMATION:
			case COMMAND_MOVE_KIND.CLIMB_ANIMATION:
			case COMMAND_MOVE_KIND.FIX_DIRECTION:
			case COMMAND_MOVE_KIND.THROUGH:
			case COMMAND_MOVE_KIND.SET_WITH_CAMERA:
			case COMMAND_MOVE_KIND.PIXEL_OFFSET:
			case COMMAND_MOVE_KIND.KEEP_POSITION: {
				const options: string[] = [Utils.initializeBoolCommand(this.command, iterator) ? 'ON' : 'OFF'];
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					options.push(t('permanent').toLowerCase());
				}
				let name = '';
				switch (kind) {
					case COMMAND_MOVE_KIND.MOVE_ANIMATION:
						name = 'move.animation';
						break;
					case COMMAND_MOVE_KIND.STOP_ANIMATION:
						name = 'stop.animation';
						break;
					case COMMAND_MOVE_KIND.CLIMB_ANIMATION:
						name = 'climb.animation';
						break;
					case COMMAND_MOVE_KIND.FIX_DIRECTION:
						name = 'direction.fix';
						break;
					case COMMAND_MOVE_KIND.THROUGH:
						name = 'through';
						break;
					case COMMAND_MOVE_KIND.SET_WITH_CAMERA:
						name = 'set.with.camera';
						break;
					case COMMAND_MOVE_KIND.PIXEL_OFFSET:
						name = 'pixel.offset';
						break;
					case COMMAND_MOVE_KIND.KEEP_POSITION:
						name = 'keep.position';
						break;
				}
				str += `${t(name)} [${options.join(',')}]`;
				break;
			}
			case COMMAND_MOVE_KIND.CHANGE_GRAPHICS: {
				let permanent = '';
				if (Utils.initializeBoolCommand(this.command, iterator)) {
					permanent = `[${t('permanent')}]`;
				}
				iterator.i += 2;
				const value = new DynamicValue();
				value.updateCommand(this.command, iterator, true);
				str += `${t('change.graphics')} ${t('id')}:${value.toString()} ${permanent}`;
				break;
			}
			case COMMAND_MOVE_KIND.WAIT: {
				const list = this.command.slice(1);
				const command = MapObjectCommand.createCommand(EVENT_COMMAND_KIND.WAIT, list);
				const commandName = MapObjectCommand.getCommandName(command.kind, command.command);
				const iterator = Utils.generateIterator();
				const parameters = Project.current!.currentMapObjectParameters;
				const properties = Project.current!.currentMapObjectProperties.map((node) => node.content);
				str += `${commandName}: ${command.toStringWait(iterator, parameters, properties)[0]}`;
				break;
			}
			case COMMAND_MOVE_KIND.PLAY_SOUND: {
				const list = this.command.slice(1);
				const command = MapObjectCommand.createCommand(EVENT_COMMAND_KIND.PLAY_SOUND, list);
				str += command.toString();
				break;
			}
			case COMMAND_MOVE_KIND.SCRIPT: {
				const list = this.command.slice(1);
				const command = MapObjectCommand.createCommand(EVENT_COMMAND_KIND.SCRIPT, list);
				str += command.toString();
				break;
			}
		}
		return str;
	}

	copy(command: MapObjectCommandMove): void {
		this.command = [...command.command];
	}
}

export { MapObjectCommandMove };
