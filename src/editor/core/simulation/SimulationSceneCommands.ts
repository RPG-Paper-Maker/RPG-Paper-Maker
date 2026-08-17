/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import {
	COMMAND_MOVE_KIND,
	Constants,
	DYNAMIC_VALUE_KIND,
	ELEMENT_MAP_KIND,
	EVENT_COMMAND_KIND,
	SONG_KIND,
	Utils,
} from '../../common';
import { Model } from '../../Editor';
import { MapObjectCommandType } from '../../models';
import { DynamicValue } from '../DynamicValue';
import { Position } from '../Position';
import { Project } from '../Project';
import { OPERATORS_NUMBERS } from './GameStateSimulation';
import { SimulationCollisions } from './SimulationCollisions';
import { CommandBase, CommandState, extraSimulationCommandFactories } from './SimulationCommands';
import type { SimulationContext } from './SimulationInterpreter';
import { SIM_ORIENTATION, SIM_ORIENTATION_VECTORS, SimulationObject } from './SimulationObject';
import { SimulationScreenFade } from './SimulationScreen';

const SPEED_NORMAL = 0.004666;

enum MODIFY_LIGHT_ACTION {
	ADD,
	DELETE,
	EDIT,
}

const LIGHT_PROPERTIES: (keyof Model.MapObjectLight)[] = [
	'kind',
	'followOrientation',
	'color',
	'groundColor',
	'intensity',
	'intensityOffset',
	'intensityTime',
	'x',
	'y',
	'z',
	'distance',
	'angle',
	'penumbra',
	'targetX',
	'targetY',
	'targetZ',
];

const LEGACY_LIGHT_PROPERTIES = LIGHT_PROPERTIES.filter((property) => property !== 'followOrientation');

enum SUB_MOVE_KIND {
	STEP,
	TURN,
	TURN_90,
	LOOK_AT_HERO,
	CHANGE_GRAPHICS,
	CHANGE_SPEED,
	CHANGE_FREQUENCY,
	JUMP,
	PLAY_SOUND,
	TOGGLE,
	WAIT,
	UNSUPPORTED,
}

const playSimulationSound = (id: number, volume: number) => {
	if (id < 0) {
		return;
	}
	const song = Project.current!.songs.getByID(SONG_KIND.SOUND, id);
	if (!song) {
		return;
	}
	void (async () => {
		const src = await song.getPathOrBase64();
		if (!src) {
			return;
		}
		const { Howl } = await import('howler');
		const howl = new Howl({
			src: [src],
			html5: true,
			volume: Math.max(0, Math.min(1, volume / 100)),
		});
		howl.once('end', () => howl.unload());
		howl.play();
	})();
};

const findObject = (ctx: SimulationContext, id: number): SimulationObject | null => {
	if (ctx.object && (id === -1 || id === ctx.object.object.id)) {
		return ctx.object;
	}
	if (ctx.hero && id === 0) {
		return ctx.hero;
	}
	return ctx.mapObjects.get(id) ?? null;
};

type SubMove =
	| {
			kind: SUB_MOVE_KIND.STEP;
			square: boolean;
			vector: THREE.Vector3 | null;
			facing: SIM_ORIENTATION | null;
			special: 'random' | 'front' | 'back' | 'towardHero' | 'awayFromHero' | null;
			diagonal: boolean;
	  }
	| { kind: SUB_MOVE_KIND.TURN; facing: SIM_ORIENTATION }
	| { kind: SUB_MOVE_KIND.TURN_90; right: boolean }
	| { kind: SUB_MOVE_KIND.LOOK_AT_HERO; opposite: boolean }
	| {
			kind: SUB_MOVE_KIND.CHANGE_GRAPHICS;
			graphicsKind: ELEMENT_MAP_KIND;
			pictureID: DynamicValue;
			indexX: number | DynamicValue;
			indexY: number | DynamicValue;
			changeOrientation: boolean;
	  }
	| { kind: SUB_MOVE_KIND.CHANGE_SPEED; value: DynamicValue }
	| { kind: SUB_MOVE_KIND.CHANGE_FREQUENCY; value: DynamicValue }
	| {
			kind: SUB_MOVE_KIND.JUMP;
			square: boolean;
			x: DynamicValue;
			y: DynamicValue;
			yPlus: DynamicValue;
			z: DynamicValue;
			peakY: DynamicValue;
			peakYPlus: DynamicValue;
			time: DynamicValue;
	  }
	| { kind: SUB_MOVE_KIND.PLAY_SOUND; songID: DynamicValue; volume: DynamicValue }
	| {
			kind: SUB_MOVE_KIND.TOGGLE;
			flag:
				| 'moveAnimation'
				| 'stopAnimation'
				| 'directionFix'
				| 'climbAnimation'
				| 'through'
				| 'setWithCamera'
				| 'pixelOffset'
				| 'keepPosition'
				| null;
			onOff: boolean;
	  }
	| { kind: SUB_MOVE_KIND.WAIT; milliseconds: DynamicValue }
	| { kind: SUB_MOVE_KIND.UNSUPPORTED };

class CommandMoveObject extends CommandBase {
	private objectID: DynamicValue;
	private isWaitEnd: boolean;
	private subMoves: SubMove[] = [];

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		const l = command.length;
		this.objectID = DynamicValue.createCommand(command, iterator);
		iterator.i++;
		this.isWaitEnd = Utils.numToBool(command[iterator.i++] as number);
		iterator.i++;
		while (iterator.i < l) {
			const kind = command[iterator.i++] as COMMAND_MOVE_KIND;
			if (kind >= COMMAND_MOVE_KIND.MOVE_NORTH && kind <= COMMAND_MOVE_KIND.MOVE_BACK) {
				const square = command[iterator.i++] === 0;
				switch (kind) {
					case COMMAND_MOVE_KIND.MOVE_NORTH:
						this.pushStep(square, SIM_ORIENTATION_VECTORS[SIM_ORIENTATION.NORTH], SIM_ORIENTATION.NORTH);
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH:
						this.pushStep(square, SIM_ORIENTATION_VECTORS[SIM_ORIENTATION.SOUTH], SIM_ORIENTATION.SOUTH);
						break;
					case COMMAND_MOVE_KIND.MOVE_WEST:
						this.pushStep(square, SIM_ORIENTATION_VECTORS[SIM_ORIENTATION.WEST], SIM_ORIENTATION.WEST);
						break;
					case COMMAND_MOVE_KIND.MOVE_EAST:
						this.pushStep(square, SIM_ORIENTATION_VECTORS[SIM_ORIENTATION.EAST], SIM_ORIENTATION.EAST);
						break;
					case COMMAND_MOVE_KIND.MOVE_NORTH_WEST:
						this.pushStep(square, new THREE.Vector3(-1, 0, -1), SIM_ORIENTATION.NORTH, true);
						break;
					case COMMAND_MOVE_KIND.MOVE_NORTH_EAST:
						this.pushStep(square, new THREE.Vector3(1, 0, -1), SIM_ORIENTATION.NORTH, true);
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH_WEST:
						this.pushStep(square, new THREE.Vector3(-1, 0, 1), SIM_ORIENTATION.SOUTH, true);
						break;
					case COMMAND_MOVE_KIND.MOVE_SOUTH_EAST:
						this.pushStep(square, new THREE.Vector3(1, 0, 1), SIM_ORIENTATION.SOUTH, true);
						break;
					case COMMAND_MOVE_KIND.MOVE_RANDOM:
						this.subMoves.push({
							kind: SUB_MOVE_KIND.STEP,
							square,
							vector: null,
							facing: null,
							special: 'random',
							diagonal: false,
						});
						break;
					case COMMAND_MOVE_KIND.MOVE_FRONT:
						this.subMoves.push({
							kind: SUB_MOVE_KIND.STEP,
							square,
							vector: null,
							facing: null,
							special: 'front',
							diagonal: false,
						});
						break;
					case COMMAND_MOVE_KIND.MOVE_BACK:
						this.subMoves.push({
							kind: SUB_MOVE_KIND.STEP,
							square,
							vector: null,
							facing: null,
							special: 'back',
							diagonal: false,
						});
						break;
					case COMMAND_MOVE_KIND.MOVE_HERO:
						this.subMoves.push({
							kind: SUB_MOVE_KIND.STEP,
							square,
							vector: null,
							facing: null,
							special: 'towardHero',
							diagonal: false,
						});
						break;
					case COMMAND_MOVE_KIND.MOVE_OPPOSITE_HERO:
						this.subMoves.push({
							kind: SUB_MOVE_KIND.STEP,
							square,
							vector: null,
							facing: null,
							special: 'awayFromHero',
							diagonal: false,
						});
						break;
					default:
						break;
				}
			} else if (kind === COMMAND_MOVE_KIND.JUMP) {
				const square = command[iterator.i++] === 0;
				const x = DynamicValue.createCommand(command, iterator);
				const y = DynamicValue.createCommand(command, iterator);
				const yPlus = DynamicValue.createCommand(command, iterator);
				const z = DynamicValue.createCommand(command, iterator);
				const peakY = DynamicValue.createCommand(command, iterator);
				const peakYPlus = DynamicValue.createCommand(command, iterator);
				const time = DynamicValue.createCommand(command, iterator);
				this.subMoves.push({ kind: SUB_MOVE_KIND.JUMP, square, x, y, yPlus, z, peakY, peakYPlus, time });
			} else if (kind === COMMAND_MOVE_KIND.CHANGE_GRAPHICS) {
				iterator.i++;
				const dontChangeOrientation = Utils.numToBool(command[iterator.i++] as number);
				const indexKind = command[iterator.i++] as number;
				let graphicsKind = ELEMENT_MAP_KIND.NONE;
				switch (indexKind) {
					case 1:
						graphicsKind = ELEMENT_MAP_KIND.SPRITE_FIX;
						break;
					case 2:
						graphicsKind = ELEMENT_MAP_KIND.SPRITE_FACE;
						break;
					case 3:
						graphicsKind = ELEMENT_MAP_KIND.OBJECT3D;
						break;
					default:
						break;
				}
				const pictureID = DynamicValue.createCommand(command, iterator);
				iterator.i++;
				const indexX = command[iterator.i++] as number;
				const indexY = command[iterator.i++] as number;
				iterator.i += 2;
				let dynamicIndexX: DynamicValue | undefined;
				let dynamicIndexY: DynamicValue | undefined;
				if (command[iterator.i] === 'indices') {
					iterator.i++;
					if (Utils.numToBool(command[iterator.i++] as number)) {
						dynamicIndexX = DynamicValue.createCommand(command, iterator);
					}
					if (Utils.numToBool(command[iterator.i++] as number)) {
						dynamicIndexY = DynamicValue.createCommand(command, iterator);
					}
				}
				this.subMoves.push({
					kind: SUB_MOVE_KIND.CHANGE_GRAPHICS,
					graphicsKind,
					pictureID,
					indexX: dynamicIndexX ?? indexX,
					indexY: dynamicIndexY ?? indexY,
					changeOrientation: !dontChangeOrientation,
				});
			} else if (kind >= COMMAND_MOVE_KIND.TURN_NORTH && kind <= COMMAND_MOVE_KIND.LOOK_AT_HERO_OPPOSITE) {
				switch (kind) {
					case COMMAND_MOVE_KIND.TURN_NORTH:
						this.subMoves.push({ kind: SUB_MOVE_KIND.TURN, facing: SIM_ORIENTATION.NORTH });
						break;
					case COMMAND_MOVE_KIND.TURN_SOUTH:
						this.subMoves.push({ kind: SUB_MOVE_KIND.TURN, facing: SIM_ORIENTATION.SOUTH });
						break;
					case COMMAND_MOVE_KIND.TURN_WEST:
						this.subMoves.push({ kind: SUB_MOVE_KIND.TURN, facing: SIM_ORIENTATION.WEST });
						break;
					case COMMAND_MOVE_KIND.TURN_EAST:
						this.subMoves.push({ kind: SUB_MOVE_KIND.TURN, facing: SIM_ORIENTATION.EAST });
						break;
					case COMMAND_MOVE_KIND.TURN_90_RIGHT:
						this.subMoves.push({ kind: SUB_MOVE_KIND.TURN_90, right: true });
						break;
					case COMMAND_MOVE_KIND.TURN_90_LEFT:
						this.subMoves.push({ kind: SUB_MOVE_KIND.TURN_90, right: false });
						break;
					case COMMAND_MOVE_KIND.LOOK_AT_HERO:
						this.subMoves.push({ kind: SUB_MOVE_KIND.LOOK_AT_HERO, opposite: false });
						break;
					case COMMAND_MOVE_KIND.LOOK_AT_HERO_OPPOSITE:
						this.subMoves.push({ kind: SUB_MOVE_KIND.LOOK_AT_HERO, opposite: true });
						break;
					default:
						break;
				}
			} else if (kind === COMMAND_MOVE_KIND.CHANGE_SPEED || kind === COMMAND_MOVE_KIND.CHANGE_FREQUENCY) {
				iterator.i++;
				const value = DynamicValue.createCommand(command, iterator);
				if (kind === COMMAND_MOVE_KIND.CHANGE_SPEED) {
					this.subMoves.push({ kind: SUB_MOVE_KIND.CHANGE_SPEED, value });
				} else {
					this.subMoves.push({ kind: SUB_MOVE_KIND.CHANGE_FREQUENCY, value });
				}
			} else if (kind >= COMMAND_MOVE_KIND.MOVE_ANIMATION && kind <= COMMAND_MOVE_KIND.KEEP_POSITION) {
				const onOff = Utils.numToBool(command[iterator.i++] as number);
				iterator.i++;
				let flag:
					| 'moveAnimation'
					| 'stopAnimation'
					| 'directionFix'
					| 'climbAnimation'
					| 'through'
					| 'setWithCamera'
					| 'pixelOffset'
					| 'keepPosition'
					| null = null;
				switch (kind) {
					case COMMAND_MOVE_KIND.MOVE_ANIMATION:
						flag = 'moveAnimation';
						break;
					case COMMAND_MOVE_KIND.STOP_ANIMATION:
						flag = 'stopAnimation';
						break;
					case COMMAND_MOVE_KIND.CLIMB_ANIMATION:
						flag = 'climbAnimation';
						break;
					case COMMAND_MOVE_KIND.FIX_DIRECTION:
						flag = 'directionFix';
						break;
					case COMMAND_MOVE_KIND.THROUGH:
						flag = 'through';
						break;
					case COMMAND_MOVE_KIND.SET_WITH_CAMERA:
						flag = 'setWithCamera';
						break;
					case COMMAND_MOVE_KIND.PIXEL_OFFSET:
						flag = 'pixelOffset';
						break;
					case COMMAND_MOVE_KIND.KEEP_POSITION:
						flag = 'keepPosition';
						break;
					default:
						break;
				}
				this.subMoves.push({ kind: SUB_MOVE_KIND.TOGGLE, flag, onOff });
			} else if (kind >= COMMAND_MOVE_KIND.WAIT && kind <= COMMAND_MOVE_KIND.SCRIPT) {
				let length = 2;
				if (kind === COMMAND_MOVE_KIND.PLAY_SOUND) {
					length = 12;
				} else if (kind === COMMAND_MOVE_KIND.SCRIPT) {
					length = Utils.numToBool(command[iterator.i] as number) ? 3 : 2;
				}
				const subCommand = command.slice(iterator.i, iterator.i + length);
				iterator.i += length;
				if (kind === COMMAND_MOVE_KIND.WAIT) {
					this.subMoves.push({
						kind: SUB_MOVE_KIND.WAIT,
						milliseconds: DynamicValue.createCommand(subCommand, Utils.generateIterator()),
					});
				} else {
					if (kind === COMMAND_MOVE_KIND.PLAY_SOUND) {
						const soundIterator = Utils.generateIterator();
						const isIDprimitive = Utils.numToBool(subCommand[soundIterator.i++] as number);
						const valueID = DynamicValue.createCommand(subCommand, soundIterator);
						const id = DynamicValue.create(
							DYNAMIC_VALUE_KIND.NUMBER,
							subCommand[soundIterator.i++] as number,
						);
						const songID = isIDprimitive ? valueID : id;
						const volume = DynamicValue.createCommand(subCommand, soundIterator);
						this.subMoves.push({ kind: SUB_MOVE_KIND.PLAY_SOUND, songID, volume });
					} else {
						this.subMoves.push({ kind: SUB_MOVE_KIND.UNSUPPORTED });
					}
				}
			} else {
				break;
			}
		}
		this.parallel = !this.isWaitEnd;
	}

	private pushStep(square: boolean, vector: THREE.Vector3, facing: SIM_ORIENTATION, diagonal = false) {
		this.subMoves.push({ kind: SUB_MOVE_KIND.STEP, square, vector, facing, special: null, diagonal });
	}

	private resolveTarget(ctx: SimulationContext): SimulationObject | null {
		return findObject(ctx, ctx.game.resolveNumber(this.objectID));
	}

	private getOrientationToHero(target: SimulationObject, ctx: SimulationContext): SIM_ORIENTATION | null {
		if (!ctx.hero || ctx.hero === target) {
			return null;
		}
		const dx = ctx.hero.worldPosition.x - target.worldPosition.x;
		const dz = ctx.hero.worldPosition.z - target.worldPosition.z;
		if (dx === 0 && dz === 0) {
			return null;
		}
		if (Math.abs(dx) > Math.abs(dz)) {
			return dx > 0 ? SIM_ORIENTATION.EAST : SIM_ORIENTATION.WEST;
		}
		return dz > 0 ? SIM_ORIENTATION.SOUTH : SIM_ORIENTATION.NORTH;
	}

	initialize(): CommandState {
		return {
			parallel: this.isWaitEnd,
			index: 0,
			progress: 0,
			from: null,
			vector: null,
			waitRemaining: null,
		};
	}

	private executeMove(
		state: Record<string, unknown>,
		move: SubMove,
		target: SimulationObject,
		ctx: SimulationContext,
		elapsedTime: number,
		fast: boolean,
	): boolean {
		switch (move.kind) {
			case SUB_MOVE_KIND.STEP: {
				if (state.from === null) {
					if (target.moveFrequencyTick > 0) {
						return false;
					}
					let vector = move.vector;
					let facing = move.facing;
					switch (move.special) {
						case 'random': {
							const orientation = Math.floor(Math.random() * 4) as SIM_ORIENTATION;
							vector = SIM_ORIENTATION_VECTORS[orientation];
							facing = orientation;
							break;
						}
						case 'front':
							vector = SIM_ORIENTATION_VECTORS[target.orientation];
							facing = target.orientation;
							break;
						case 'back':
							vector = SIM_ORIENTATION_VECTORS[(target.orientation + 2) % 4];
							facing = null;
							break;
						case 'towardHero':
						case 'awayFromHero': {
							let orientation = this.getOrientationToHero(target, ctx);
							if (orientation === null) {
								return true;
							}
							if (move.special === 'awayFromHero') {
								orientation = ((orientation + 2) % 4) as SIM_ORIENTATION;
							}
							vector = SIM_ORIENTATION_VECTORS[orientation];
							facing = orientation;
							break;
						}
						default:
							break;
					}
					state.from = target.worldPosition.clone();
					state.vector = vector!.clone();
					if (facing !== null) {
						target.setOrientation(facing);
					}
					target.moving = true;
				}
				const speed = target.speedValue * SPEED_NORMAL * elapsedTime * (move.diagonal ? Math.SQRT1_2 : 1);
				state.progress = (state.progress as number) + speed;
				const advance = Math.min(state.progress as number, 1);
				const desired = (state.from as THREE.Vector3)
					.clone()
					.addScaledVector(state.vector as THREE.Vector3, advance);
				const next = ctx.map
					? SimulationCollisions.adjustMove(
							ctx.map,
							target.worldPosition,
							desired,
							target.through,
							ctx.ignoreMoveBlockingCollisions,
						)
					: desired;
				target.setWorldPosition(next);
				const done = advance >= 1;
				if (done) {
					target.moveFrequencyTick = target.frequencyValue * 1000;
				}
				return done;
			}
			case SUB_MOVE_KIND.JUMP: {
				if (state.jumpTime === undefined) {
					const start = target.worldPosition.clone();
					const square = move.square ? 1 : 1 / Project.SQUARE_SIZE;
					state.jumpStart = start;
					state.jumpEnd = new THREE.Vector3(
						ctx.game.resolveNumber(move.x) * square + start.x,
						ctx.game.resolveNumber(move.y) * square +
							ctx.game.resolveNumber(move.yPlus) / Project.SQUARE_SIZE +
							start.y,
						ctx.game.resolveNumber(move.z) * square + start.z,
					);
					state.jumpPeak =
						ctx.game.resolveNumber(move.peakY) +
						ctx.game.resolveNumber(move.peakYPlus) / Project.SQUARE_SIZE;
					state.jumpTime = ctx.game.resolveNumber(move.time) * 1000;
					state.jumpCurrent = 0;
				}
				if ((state.jumpTime as number) <= 0) {
					target.setWorldPosition(state.jumpEnd as THREE.Vector3);
					target.moving = false;
					return true;
				}
				state.jumpCurrent = target.jump(
					state.jumpStart as THREE.Vector3,
					state.jumpEnd as THREE.Vector3,
					state.jumpPeak as number,
					state.jumpCurrent as number,
					state.jumpTime as number,
					elapsedTime,
				);
				if ((state.jumpCurrent as number) >= (state.jumpTime as number)) {
					target.moving = false;
					return true;
				}
				return false;
			}
			case SUB_MOVE_KIND.CHANGE_FREQUENCY: {
				const id = ctx.game.resolveNumber(move.value);
				const frequency = Model.Base.getByID(
					Project.current!.systems.frequencies,
					id,
				) as Model.Frequency | null;
				target.frequencyValue = frequency ? frequency.value.getFixNumberValue() : id;
				return true;
			}
			case SUB_MOVE_KIND.PLAY_SOUND:
				if (!fast) {
					playSimulationSound(ctx.game.resolveNumber(move.songID), ctx.game.resolveNumber(move.volume));
				}
				return true;
			case SUB_MOVE_KIND.TURN:
				target.setOrientation(move.facing);
				return true;
			case SUB_MOVE_KIND.TURN_90:
				target.setOrientation(((target.orientation + (move.right ? 1 : 3)) % 4) as SIM_ORIENTATION);
				return true;
			case SUB_MOVE_KIND.LOOK_AT_HERO: {
				let orientation = this.getOrientationToHero(target, ctx);
				if (orientation === null) {
					return true;
				}
				if (move.opposite) {
					orientation = ((orientation + 2) % 4) as SIM_ORIENTATION;
				}
				target.setOrientation(orientation);
				return true;
			}
			case SUB_MOVE_KIND.CHANGE_GRAPHICS:
				target.updateGraphics(
					move.graphicsKind,
					ctx.game.resolveNumber(move.pictureID),
					move.indexX instanceof DynamicValue ? ctx.game.resolveNumber(move.indexX) : move.indexX,
					move.indexY instanceof DynamicValue ? ctx.game.resolveNumber(move.indexY) : move.indexY,
					move.changeOrientation,
				);
				return true;
			case SUB_MOVE_KIND.CHANGE_SPEED: {
				const id = ctx.game.resolveNumber(move.value);
				const speed = Model.Base.getByID(Project.current!.systems.speeds, id) as Model.Speed | null;
				target.speedValue = speed ? speed.value.getFixNumberValue() : id;
				return true;
			}
			case SUB_MOVE_KIND.TOGGLE:
				if (move.flag !== null) {
					target[move.flag] = move.onOff;
					target.state[move.flag] = move.onOff;
					target.build();
				}
				return true;
			case SUB_MOVE_KIND.WAIT:
				if (state.waitRemaining === null) {
					state.waitRemaining = ctx.game.resolveNumber(move.milliseconds) * 1000;
				}
				state.waitRemaining = (state.waitRemaining as number) - elapsedTime;
				return (state.waitRemaining as number) <= 0;
			case SUB_MOVE_KIND.UNSUPPORTED:
				return true;
			default:
				return true;
		}
	}

	private execute(
		state: Record<string, unknown>,
		ctx: SimulationContext,
		elapsedTime: number,
		fast: boolean,
	): number {
		const target = this.resolveTarget(ctx);
		if (target === null || this.subMoves.length === 0) {
			return 1;
		}
		const move = this.subMoves[state.index as number];
		if (!move) {
			target.moving = false;
			return 1;
		}
		const finished = this.executeMove(state, move, target, ctx, elapsedTime, fast);
		if (finished) {
			state.index = (state.index as number) + 1;
			state.progress = 0;
			state.from = null;
			state.vector = null;
			state.waitRemaining = null;
			state.jumpTime = undefined;
			if (!this.subMoves[state.index as number]) {
				target.moving = false;
				return 1;
			}
		}
		return 0;
	}

	update(state: CommandState, ctx: SimulationContext): number {
		if (state!.parallel) {
			return this.execute(state!, ctx, ctx.getElapsedTime(), false);
		}
		return 1;
	}

	updateFast(state: CommandState, ctx: SimulationContext): number {
		for (let i = 0; i < 100000; i++) {
			if (this.execute(state!, ctx, 16, true) === 1) {
				return 1;
			}
		}
		return 1;
	}
}

class CommandMoveCamera extends CommandBase {
	private targetID: DynamicValue | null;
	private operation: number;
	private moveTargetOffset: boolean;
	private x: DynamicValue;
	private xSquare: boolean;
	private y: DynamicValue;
	private ySquare: boolean;
	private z: DynamicValue;
	private zSquare: boolean;
	private h: DynamicValue;
	private v: DynamicValue;
	private distance: DynamicValue;
	private isWaitEnd: boolean;
	private time: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		if (!Utils.numToBool(command[iterator.i++] as number)) {
			this.targetID = null;
		} else {
			this.targetID = DynamicValue.createCommand(command, iterator);
		}
		this.operation = command[iterator.i++] as number;
		this.moveTargetOffset = Utils.numToBool(command[iterator.i++] as number);
		iterator.i++;
		this.x = DynamicValue.createCommand(command, iterator);
		this.xSquare = !Utils.numToBool(command[iterator.i++] as number);
		this.y = DynamicValue.createCommand(command, iterator);
		this.ySquare = !Utils.numToBool(command[iterator.i++] as number);
		this.z = DynamicValue.createCommand(command, iterator);
		this.zSquare = !Utils.numToBool(command[iterator.i++] as number);
		iterator.i++;
		this.h = DynamicValue.createCommand(command, iterator);
		this.v = DynamicValue.createCommand(command, iterator);
		this.distance = DynamicValue.createCommand(command, iterator);
		this.isWaitEnd = Utils.numToBool(command[iterator.i++] as number);
		this.time = DynamicValue.createCommand(command, iterator);
		this.parallel = !this.isWaitEnd;
	}

	initialize(ctx: SimulationContext): CommandState {
		const camera = ctx.camera;
		if (!camera) {
			return { parallel: this.isWaitEnd, noCamera: true };
		}
		const game = ctx.game;
		const operation = OPERATORS_NUMBERS[this.operation];
		const three = camera.getThreeCamera();
		const time = game.resolveNumber(this.time) * 1000;
		const finalPosition = new THREE.Vector3(
			operation(three.position.x, game.resolveNumber(this.x) / (this.xSquare ? 1 : Project.SQUARE_SIZE)),
			operation(three.position.y, game.resolveNumber(this.y) / (this.ySquare ? 1 : Project.SQUARE_SIZE)),
			operation(three.position.z, game.resolveNumber(this.z) / (this.zSquare ? 1 : Project.SQUARE_SIZE)),
		);
		let newTarget: SimulationObject | null = null;
		if (this.targetID !== null) {
			newTarget = findObject(ctx, game.resolveNumber(this.targetID));
		}
		return {
			parallel: this.isWaitEnd,
			newTarget,
			targetApplied: false,
			targetStartPosition: null,
			targetEndPosition: null,
			finalDifPosition: finalPosition.sub(three.position),
			finalDifH: operation(camera.horizontalAngle, game.resolveNumber(this.h)) - camera.horizontalAngle,
			finalDifV: operation(camera.verticalAngle, game.resolveNumber(this.v)) - camera.verticalAngle,
			finalDifDistance:
				operation(camera.distance, game.resolveNumber(this.distance) / Constants.BASE_SQUARE_SIZE) -
				camera.distance,
			time,
			timeLeft: time,
		};
	}

	update(state: CommandState, ctx: SimulationContext): number {
		if (!state!.parallel || state!.noCamera) {
			return 1;
		}
		const camera = ctx.camera!;
		let timeRate: number;
		if ((state!.time as number) === 0) {
			timeRate = 1;
		} else {
			let difNb = ctx.getElapsedTime();
			state!.timeLeft = (state!.timeLeft as number) - difNb;
			if ((state!.timeLeft as number) < 0) {
				difNb += state!.timeLeft as number;
				state!.timeLeft = 0;
			}
			timeRate = difNb / (state!.time as number);
		}
		camera.horizontalAngle += timeRate * (state!.finalDifH as number);
		camera.verticalAngle += timeRate * (state!.finalDifV as number);
		camera.distance += timeRate * (state!.finalDifDistance as number);
		ctx.map?.updateLayerOffsets();
		if (!state!.targetApplied) {
			state!.targetApplied = true;
			if (state!.newTarget) {
				ctx.cameraTarget = state!.newTarget as SimulationObject;
				state!.targetStartPosition = camera.targetPosition.clone();
				state!.targetEndPosition = (state!.newTarget as SimulationObject).worldPosition
					.clone()
					.add(new THREE.Vector3(0.5, 0, 0.5));
			}
		}
		if (state!.targetStartPosition && state!.targetEndPosition) {
			const progress =
				(state!.time as number) === 0 ? 1 : 1 - (state!.timeLeft as number) / (state!.time as number);
			ctx.cameraTargetPosition = (state!.targetStartPosition as THREE.Vector3)
				.clone()
				.lerp(state!.targetEndPosition as THREE.Vector3, progress);
			if (progress === 1) {
				ctx.cameraTargetPosition = null;
			}
		}
		const offset = state!.finalDifPosition as THREE.Vector3;
		camera.targetOffset.add(new THREE.Vector3(timeRate * offset.x, timeRate * offset.y, timeRate * offset.z));
		return (state!.time as number) === 0 || (state!.timeLeft as number) === 0 ? 1 : 0;
	}

	initializeFast(ctx: SimulationContext): CommandState {
		ctx.camera?.update();
		return this.initialize(ctx);
	}

	updateFast(state: CommandState, ctx: SimulationContext): number {
		if (!state || state.noCamera || !ctx.camera) {
			return 1;
		}
		const camera = ctx.camera;
		camera.horizontalAngle += state.finalDifH as number;
		camera.verticalAngle += state.finalDifV as number;
		camera.distance += state.finalDifDistance as number;
		ctx.map?.updateLayerOffsets();
		if (state.newTarget) {
			ctx.cameraTarget = state.newTarget as SimulationObject;
			ctx.cameraTargetPosition = null;
		}
		camera.targetOffset.add(state.finalDifPosition as THREE.Vector3);
		camera.update();
		return 1;
	}
}

const TRANSITION_DURATION = 1000;

class CommandTeleportObject extends CommandBase {
	private objectID: DynamicValue;
	private objectIDPosition: DynamicValue | null = null;
	private mapID: DynamicValue | null = null;
	private x!: DynamicValue;
	private y!: DynamicValue;
	private yPlus!: DynamicValue;
	private z!: DynamicValue;
	private direction: number;
	private transitionStart: number;
	private transitionStartColor!: DynamicValue;
	private transitionEnd: number;
	private transitionEndColor!: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.objectID = DynamicValue.createCommand(command, iterator);
		const createNumber = () => DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, command[iterator.i++] as number);
		switch (command[iterator.i++] as number) {
			case 0:
				this.mapID = createNumber();
				this.x = createNumber();
				this.y = createNumber();
				this.yPlus = createNumber();
				this.z = createNumber();
				break;
			case 1:
				this.mapID = DynamicValue.createCommand(command, iterator);
				this.x = DynamicValue.createCommand(command, iterator);
				this.y = DynamicValue.createCommand(command, iterator);
				this.yPlus = DynamicValue.createCommand(command, iterator);
				this.z = DynamicValue.createCommand(command, iterator);
				break;
			case 2:
				this.objectIDPosition = DynamicValue.createCommand(command, iterator);
				break;
		}
		this.direction = command[iterator.i++] as number;
		this.transitionStart = command[iterator.i++] as number;
		if (this.transitionStart === 1) {
			this.transitionStartColor = DynamicValue.createCommand(command, iterator);
		}
		this.transitionEnd = command[iterator.i++] as number;
		if (this.transitionEnd === 1) {
			this.transitionEndColor = DynamicValue.createCommand(command, iterator);
		}
	}

	private getColor(ctx: SimulationContext, value: DynamicValue): Model.Color {
		return Model.Base.getByIDOrFirst(Project.current!.systems.colors, ctx.game.resolveNumber(value)) as Model.Color;
	}

	private resolvePosition(ctx: SimulationContext): THREE.Vector3 | null {
		const game = ctx.game;
		if (this.objectIDPosition !== null) {
			const other = findObject(ctx, game.resolveNumber(this.objectIDPosition));
			if (other === null) {
				return null;
			}
			return other.worldPosition.clone();
		}
		return new Position(
			game.resolveNumber(this.x),
			game.resolveNumber(this.y),
			(game.resolveNumber(this.yPlus) * 100) / Project.SQUARE_SIZE,
			game.resolveNumber(this.z),
		).toVector3(false);
	}

	private teleport(ctx: SimulationContext) {
		if (this.mapID !== null && ctx.game.resolveNumber(this.mapID) !== ctx.map?.id) {
			return;
		}
		const target = findObject(ctx, ctx.game.resolveNumber(this.objectID));
		if (target === null) {
			return;
		}
		const position = this.resolvePosition(ctx);
		if (position !== null) {
			target.setWorldPosition(position);
		}
		if (this.direction > 0) {
			target.setOrientation((this.direction - 1) as SIM_ORIENTATION);
		}
	}

	initialize(ctx: SimulationContext): CommandState {
		return {
			teleported: false,
			transitionedStart: this.transitionStart === 0,
			transitionedEnd: this.transitionEnd === 0,
			endTransitionStarted: false,
			startColor: this.transitionStart === 1 ? this.getColor(ctx, this.transitionStartColor) : null,
			endColor: this.transitionEnd === 1 ? this.getColor(ctx, this.transitionEndColor) : null,
			colorAlpha: 0,
			fade: null,
			distance: ctx.camera ? ctx.camera.distance : 0,
			tick: 0,
		};
	}

	private getFade(ctx: SimulationContext, state: Record<string, unknown>, color: Model.Color): SimulationScreenFade {
		if (state.fade === null) {
			state.fade = ctx.screen.addFade(color.red, color.green, color.blue, 0);
		}
		const fade = state.fade as SimulationScreenFade;
		fade.red = color.red;
		fade.green = color.green;
		fade.blue = color.blue;
		return fade;
	}

	private finish(ctx: SimulationContext, state: Record<string, unknown>): number {
		if (state.fade !== null) {
			ctx.screen.removeFade(state.fade as SimulationScreenFade);
			state.fade = null;
		}
		if (this.transitionStart === 2 && this.transitionEnd !== 2 && ctx.camera) {
			ctx.camera.distance = state.distance as number;
		}
		return 1;
	}

	update(state: CommandState, ctx: SimulationContext): number {
		const current = state!;
		if (!current.transitionedStart) {
			current.tick = (current.tick as number) + ctx.getElapsedTime();
			const coef = Math.min((current.tick as number) / TRANSITION_DURATION, 1);
			if (this.transitionStart === 1) {
				current.colorAlpha = coef;
				this.getFade(ctx, current, current.startColor as Model.Color).alpha = coef;
			} else if (this.transitionStart === 2 && ctx.camera && ctx.camera.distance > 0) {
				ctx.camera.distance = 1 + (1 - coef) * ((current.distance as number) - 1);
			}
			if (coef < 1) {
				return 0;
			}
			current.transitionedStart = true;
			current.tick = 0;
		}
		if (!current.teleported) {
			this.teleport(ctx);
			current.teleported = true;
		}
		if (!current.transitionedEnd) {
			if (!current.endTransitionStarted) {
				current.endTransitionStarted = true;
				current.tick = 0;
				if (this.transitionEnd !== 1 && current.fade !== null) {
					ctx.screen.removeFade(current.fade as SimulationScreenFade);
					current.fade = null;
				}
				if (this.transitionEnd === 2 && ctx.camera) {
					ctx.camera.distance = 1;
				}
			}
			current.tick = (current.tick as number) + ctx.getElapsedTime();
			const coef = Math.min((current.tick as number) / TRANSITION_DURATION, 1);
			if (this.transitionEnd === 1) {
				if ((current.colorAlpha as number) > 0) {
					current.colorAlpha = 1 - coef;
					this.getFade(ctx, current, current.endColor as Model.Color).alpha = current.colorAlpha as number;
				}
			} else if (this.transitionEnd === 2 && ctx.camera && ctx.camera.distance < (current.distance as number)) {
				ctx.camera.distance = 1 + coef * ((current.distance as number) - 1);
			}
			if (coef < 1) {
				return 0;
			}
			current.transitionedEnd = true;
		}
		return this.finish(ctx, current);
	}

	updateFast(state: CommandState, ctx: SimulationContext): number {
		const current = state!;
		if (!current.teleported) {
			this.teleport(ctx);
			current.teleported = true;
		}
		return this.finish(ctx, current);
	}
}

class CommandModifyLight extends CommandBase {
	private objectID: DynamicValue;
	private action: MODIFY_LIGHT_ACTION;
	private lightID: DynamicValue;
	private light: Model.MapObjectLight | null = null;
	private selectedFields: boolean[] = [];

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.objectID = DynamicValue.createCommand(command, iterator);
		this.action = command[iterator.i++] as MODIFY_LIGHT_ACTION;
		this.lightID = DynamicValue.createCommand(command, iterator);
		if (this.action !== MODIFY_LIGHT_ACTION.DELETE) {
			this.light = new Model.MapObjectLight();
			this.light.applyDefault();
			const properties =
				command.length - iterator.i ===
				LEGACY_LIGHT_PROPERTIES.length * (this.action === MODIFY_LIGHT_ACTION.EDIT ? 3 : 2)
					? LEGACY_LIGHT_PROPERTIES
					: LIGHT_PROPERTIES;
			const hasSelectedFields =
				this.action === MODIFY_LIGHT_ACTION.EDIT && command.length - iterator.i >= properties.length * 3;
			for (const property of properties) {
				this.selectedFields[LIGHT_PROPERTIES.indexOf(property)] = hasSelectedFields
					? Utils.initializeBoolCommand(command, iterator)
					: true;
				(this.light[property] as DynamicValue).updateCommand(command, iterator);
			}
		}
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const target = findObject(ctx, ctx.game.resolveNumber(this.objectID));
		if (target === null) {
			return 1;
		}
		const lightID = ctx.game.resolveNumber(this.lightID);
		const lights = target.state.lights ?? (target.state.lights = []);
		const index = lights.findIndex((light) => Number(light.id) === lightID);
		switch (this.action) {
			case MODIFY_LIGHT_ACTION.ADD:
				if (index === -1 && this.light) {
					const light = this.light.clone();
					light.id = lightID;
					lights.push(light);
					ctx.showObjectPreview?.(target);
					target.refreshLights();
				}
				break;
			case MODIFY_LIGHT_ACTION.DELETE:
				if (index !== -1) {
					lights.splice(index, 1);
					ctx.showObjectPreview?.(target);
					target.refreshLights();
				}
				break;
			case MODIFY_LIGHT_ACTION.EDIT:
				if (index !== -1 && this.light) {
					let hasUpdated = false;
					for (let i = 0; i < LIGHT_PROPERTIES.length; i++) {
						if (this.selectedFields[i]) {
							const property = LIGHT_PROPERTIES[i];
							(lights[index][property] as DynamicValue).copy(this.light[property] as DynamicValue);
							hasUpdated = true;
						}
					}
					if (hasUpdated) {
						ctx.showObjectPreview?.(target);
						target.refreshLights();
					}
				}
				break;
		}
		return 1;
	}
}

class CommandChangeState extends CommandBase {
	private mapID: DynamicValue;
	private objectID: DynamicValue;
	private stateID: DynamicValue;
	private dontChangeOrientation: boolean;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.mapID = DynamicValue.createCommand(command, iterator);
		this.objectID = DynamicValue.createCommand(command, iterator);
		this.stateID = DynamicValue.createCommand(command, iterator);
		iterator.i++; // The preview only changes graphics, so the state operation is irrelevant here.
		this.dontChangeOrientation = Utils.numToBool(command[iterator.i] as number);
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const mapID = ctx.game.resolveNumber(this.mapID);
		if (mapID !== -1 && mapID !== ctx.map?.id) {
			return 1;
		}
		const target = findObject(ctx, ctx.game.resolveNumber(this.objectID));
		if (target === null) {
			return 1;
		}
		const state = target.object.states.find((candidate) => candidate.id === ctx.game.resolveNumber(this.stateID));
		if (!state) {
			return 1;
		}
		ctx.showObjectPreview?.(target);
		target.updateGraphics(
			state.graphicsKind,
			state.graphicsID,
			state.graphicsIndexX,
			state.graphicsIndexY,
			!this.dontChangeOrientation,
		);
		return 1;
	}
}

extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.MOVE_OBJECT,
	(command: MapObjectCommandType[]) => new CommandMoveObject(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.MOVE_CAMERA,
	(command: MapObjectCommandType[]) => new CommandMoveCamera(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.TELEPORT_OBJECT,
	(command: MapObjectCommandType[]) => new CommandTeleportObject(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.MODIFY_LIGHT,
	(command: MapObjectCommandType[]) => new CommandModifyLight(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.CHANGE_STATE,
	(command: MapObjectCommandType[]) => new CommandChangeState(command),
);

export { CommandChangeState, CommandModifyLight, CommandMoveCamera, CommandMoveObject, CommandTeleportObject };
