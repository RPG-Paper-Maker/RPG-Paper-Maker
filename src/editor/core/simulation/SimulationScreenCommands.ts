/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, Utils } from '../../common';
import { Manager, Model } from '../../Editor';
import { MapObjectCommandType } from '../../models';
import { DynamicValue } from '../DynamicValue';
import { Project } from '../Project';
import { CommandBase, CommandState, extraSimulationCommandFactories } from './SimulationCommands';
import type { SimulationContext } from './SimulationInterpreter';
import {
	SIM_SCREEN_X,
	SIM_SCREEN_Y,
	SimulationPicture,
	SimulationScreenFade,
	SimulationWeather,
} from './SimulationScreen';

const getColor = (id: number): Model.Color =>
	Model.Base.getByIDOrFirst(Project.current!.systems.colors, id) as Model.Color;

const clampTone = (value: number): number => Math.max(Math.min(value, 1), -1);

const getTimeRate = (state: Record<string, unknown>, elapsedTime: number): number => {
	if ((state.time as number) === 0) {
		return 1;
	}
	let dif = elapsedTime;
	state.timeLeft = (state.timeLeft as number) - elapsedTime;
	if ((state.timeLeft as number) < 0) {
		dif += state.timeLeft as number;
		state.timeLeft = 0;
	}
	return dif / (state.time as number);
};

class CommandDisplayAPicture extends CommandBase {
	private pictureID: DynamicValue;
	private index: DynamicValue;
	private centered: boolean;
	private x: DynamicValue;
	private y: DynamicValue;
	private zoom: DynamicValue;
	private opacity: DynamicValue;
	private angle: DynamicValue;
	private stretch: boolean;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.pictureID = DynamicValue.createCommand(command, iterator, true);
		this.index = DynamicValue.createCommand(command, iterator);
		this.centered = Utils.numToBool(command[iterator.i++] as number);
		this.x = DynamicValue.createCommand(command, iterator);
		this.y = DynamicValue.createCommand(command, iterator);
		this.zoom = DynamicValue.createCommand(command, iterator);
		this.opacity = DynamicValue.createCommand(command, iterator);
		this.angle = DynamicValue.createCommand(command, iterator);
		this.stretch = Utils.numToBool(command[iterator.i++] as number);
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const game = ctx.game;
		const x = game.resolveNumber(this.x);
		const y = game.resolveNumber(this.y);
		ctx.screen.setPicture({
			index: game.resolveNumber(this.index),
			pictureID: game.resolveNumber(this.pictureID),
			centered: this.centered,
			stretch: this.stretch,
			x: this.centered ? SIM_SCREEN_X / 2 + x : x,
			y: this.centered ? SIM_SCREEN_Y / 2 + y : y,
			zoom: game.resolveNumber(this.zoom) / 100,
			opacity: game.resolveNumber(this.opacity) / 100,
			angle: game.resolveNumber(this.angle),
		});
		return 1;
	}
}

class CommandSetMoveTurnAPicture extends CommandBase {
	private index: DynamicValue;
	private pictureID: DynamicValue | null = null;
	private zoom: DynamicValue | null = null;
	private opacity: DynamicValue | null = null;
	private x: DynamicValue | null = null;
	private y: DynamicValue | null = null;
	private angle: DynamicValue | null = null;
	private waitEnd: boolean;
	private time: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.index = DynamicValue.createCommand(command, iterator);
		if (Utils.numToBool(command[iterator.i++] as number)) {
			this.pictureID = DynamicValue.createCommand(command, iterator, true);
		}
		if (Utils.numToBool(command[iterator.i++] as number)) {
			this.zoom = DynamicValue.createCommand(command, iterator);
		}
		if (Utils.numToBool(command[iterator.i++] as number)) {
			this.opacity = DynamicValue.createCommand(command, iterator);
		}
		if (Utils.numToBool(command[iterator.i++] as number)) {
			this.x = DynamicValue.createCommand(command, iterator);
		}
		if (Utils.numToBool(command[iterator.i++] as number)) {
			this.y = DynamicValue.createCommand(command, iterator);
		}
		if (Utils.numToBool(command[iterator.i++] as number)) {
			this.angle = DynamicValue.createCommand(command, iterator);
		}
		this.waitEnd = Utils.numToBool(command[iterator.i++] as number);
		this.time = DynamicValue.createCommand(command, iterator);
		this.parallel = !this.waitEnd;
	}

	initialize(ctx: SimulationContext): CommandState {
		const game = ctx.game;
		const picture = ctx.screen.getPicture(game.resolveNumber(this.index));
		if (picture === null) {
			return {};
		}
		if (this.pictureID !== null) {
			const newPictureID = game.resolveNumber(this.pictureID);
			if (picture.centered) {
				const previousSize = ctx.screen.getImageSize(picture.pictureID);
				const newSize = ctx.screen.getImageSize(newPictureID);
				if (previousSize !== null && newSize !== null) {
					picture.x += (previousSize.width - newSize.width) / 2;
					picture.y += (previousSize.height - newSize.height) / 2;
				}
			}
			picture.pictureID = newPictureID;
			ctx.screen.getImage(newPictureID);
		}
		const time = game.resolveNumber(this.time) * 1000;
		return {
			parallel: this.waitEnd,
			picture,
			finalDifZoom: this.zoom === null ? null : game.resolveNumber(this.zoom) / 100 - picture.zoom,
			finalDifOpacity: this.opacity === null ? null : game.resolveNumber(this.opacity) / 100 - picture.opacity,
			finalDifX:
				this.x === null
					? null
					: (picture.centered ? SIM_SCREEN_X / 2 : 0) + game.resolveNumber(this.x) - picture.x,
			finalDifY:
				this.y === null
					? null
					: (picture.centered ? SIM_SCREEN_Y / 2 : 0) + game.resolveNumber(this.y) - picture.y,
			finalDifAngle: this.angle === null ? null : game.resolveNumber(this.angle) - picture.angle,
			time,
			timeLeft: time,
		};
	}

	private apply(state: Record<string, unknown>, timeRate: number) {
		const picture = state.picture as SimulationPicture;
		if (state.finalDifZoom !== null) {
			picture.zoom += timeRate * (state.finalDifZoom as number);
		}
		if (state.finalDifOpacity !== null) {
			picture.opacity += timeRate * (state.finalDifOpacity as number);
		}
		if (state.finalDifX !== null) {
			picture.x += timeRate * (state.finalDifX as number);
		}
		if (state.finalDifY !== null) {
			picture.y += timeRate * (state.finalDifY as number);
		}
		if (state.finalDifAngle !== null) {
			picture.angle += timeRate * (state.finalDifAngle as number);
		}
	}

	update(state: CommandState, ctx: SimulationContext): number {
		if (!state!.picture) {
			return 1;
		}
		if (!state!.parallel) {
			return 1;
		}
		this.apply(state!, getTimeRate(state!, ctx.getElapsedTime()));
		return (state!.timeLeft as number) === 0 ? 1 : 0;
	}

	updateFast(state: CommandState): number {
		if (state!.picture) {
			this.apply(state!, 1);
		}
		return 1;
	}
}

class CommandRemoveAPicture extends CommandBase {
	private index: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.index = DynamicValue.createCommand(command, iterator);
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		ctx.screen.removePicture(ctx.game.resolveNumber(this.index));
		return 1;
	}
}

class CommandFlashScreen extends CommandBase {
	private colorID: DynamicValue;
	private isWaitEnd: boolean;
	private time: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.colorID = DynamicValue.createCommand(command, iterator);
		this.isWaitEnd = Utils.numToBool(command[iterator.i++] as number);
		this.time = DynamicValue.createCommand(command, iterator);
		this.parallel = !this.isWaitEnd;
	}

	initialize(ctx: SimulationContext): CommandState {
		const time = ctx.game.resolveNumber(this.time) * 1000;
		const color = getColor(ctx.game.resolveNumber(this.colorID));
		return {
			parallel: this.isWaitEnd,
			time,
			timeLeft: time,
			red: color.red,
			green: color.green,
			blue: color.blue,
			a: color.alpha,
			finalDifA: -color.alpha,
			fade: null,
		};
	}

	update(state: CommandState, ctx: SimulationContext): number {
		if (!state!.parallel) {
			return 1;
		}
		if (state!.fade === null) {
			state!.fade = ctx.screen.addFade(
				state!.red as number,
				state!.green as number,
				state!.blue as number,
				state!.a as number,
			);
		}
		const timeRate = getTimeRate(state!, ctx.getElapsedTime());
		state!.a = (state!.a as number) + timeRate * (state!.finalDifA as number);
		(state!.fade as SimulationScreenFade).alpha = Math.max(state!.a as number, 0);
		if ((state!.timeLeft as number) === 0) {
			ctx.screen.removeFade(state!.fade as SimulationScreenFade);
			state!.fade = null;
			return 1;
		}
		return 0;
	}

	updateFast(): number {
		return 1;
	}
}

class CommandShakeScreen extends CommandBase {
	private offset: DynamicValue;
	private shakeNumber: DynamicValue;
	private isWaitEnd: boolean;
	private time: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.offset = DynamicValue.createCommand(command, iterator);
		this.shakeNumber = DynamicValue.createCommand(command, iterator);
		this.isWaitEnd = Utils.numToBool(command[iterator.i++] as number);
		this.time = DynamicValue.createCommand(command, iterator);
		this.parallel = !this.isWaitEnd;
	}

	private static updateTargetOffset(state: Record<string, unknown>, ctx: SimulationContext, timeRate: number) {
		const camera = ctx.camera!;
		const value = timeRate * (state.finalDifPos as number);
		const radians = (camera.horizontalAngle * Math.PI) / 180;
		camera.targetOffset.x += value * -Math.sin(radians);
		camera.targetOffset.z += value * Math.cos(radians);
	}

	initialize(ctx: SimulationContext): CommandState {
		if (!ctx.camera) {
			return { noCamera: true };
		}
		const game = ctx.game;
		const seconds = game.resolveNumber(this.time);
		const time = seconds * 1000;
		let shakeNumber = game.resolveNumber(this.shakeNumber) * 2;
		const totalShakes = shakeNumber * seconds;
		if (totalShakes % 2 !== 0) {
			const floor = Math.floor(totalShakes / 2) * 2;
			const ceil = floor + 2;
			shakeNumber = (floor !== 0 && totalShakes - floor < ceil - totalShakes ? floor : ceil) / seconds;
		}
		if (time <= 0 || shakeNumber <= 0 || !Number.isFinite(shakeNumber)) {
			return { parallel: this.isWaitEnd, noCamera: true };
		}
		const shakeTime = (1 / (shakeNumber * 2)) * 1000;
		const offset = game.resolveNumber(this.offset) / Project.SQUARE_SIZE;
		return {
			parallel: this.isWaitEnd,
			offset,
			shakeTime,
			shakeTimeLeft: shakeTime,
			currentOffset: 0,
			beginPosX: ctx.camera.targetOffset.x,
			beginPosZ: ctx.camera.targetOffset.z,
			finalDifPos: -offset,
			time,
			timeLeft: time,
		};
	}

	update(state: CommandState, ctx: SimulationContext): number {
		if (state!.noCamera || !state!.parallel) {
			return 1;
		}
		let timeRate: number;
		if ((state!.time as number) === 0) {
			timeRate = 1;
		} else {
			let dif = ctx.getElapsedTime();
			state!.timeLeft = (state!.timeLeft as number) - dif;
			if ((state!.timeLeft as number) < 0) {
				dif += state!.timeLeft as number;
				state!.timeLeft = 0;
			}
			state!.shakeTimeLeft = (state!.shakeTimeLeft as number) - ctx.getElapsedTime();
			if ((state!.shakeTimeLeft as number) <= 0) {
				timeRate = (dif + (state!.shakeTimeLeft as number)) / (state!.shakeTime as number);
				CommandShakeScreen.updateTargetOffset(state!, ctx, timeRate);
				dif = -(state!.shakeTimeLeft as number);
				state!.shakeTimeLeft = (state!.shakeTime as number) + (state!.shakeTimeLeft as number);
				state!.currentOffset = (state!.currentOffset as number) + 1;
				state!.finalDifPos =
					Math.ceil((state!.currentOffset as number) / 2) % 2 === 0
						? -(state!.offset as number)
						: (state!.offset as number);
			}
			timeRate = dif / (state!.shakeTime as number);
		}
		CommandShakeScreen.updateTargetOffset(state!, ctx, timeRate);
		if ((state!.timeLeft as number) === 0) {
			ctx.camera!.targetOffset.x = state!.beginPosX as number;
			ctx.camera!.targetOffset.z = state!.beginPosZ as number;
			return 1;
		}
		return 0;
	}

	updateFast(): number {
		return 1;
	}
}

class CommandChangeScreenTone extends CommandBase {
	private r: DynamicValue;
	private g: DynamicValue;
	private b: DynamicValue;
	private grey: DynamicValue;
	private colorID: DynamicValue | null = null;
	private waitEnd: boolean;
	private time: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.r = DynamicValue.createCommand(command, iterator);
		this.g = DynamicValue.createCommand(command, iterator);
		this.b = DynamicValue.createCommand(command, iterator);
		this.grey = DynamicValue.createCommand(command, iterator);
		if (Utils.numToBool(command[iterator.i++] as number)) {
			iterator.i++;
			this.colorID = DynamicValue.createCommand(command, iterator);
		}
		this.waitEnd = Utils.numToBool(command[iterator.i++] as number);
		this.time = DynamicValue.createCommand(command, iterator);
		this.parallel = !this.waitEnd;
	}

	initialize(ctx: SimulationContext): CommandState {
		const game = ctx.game;
		const tone = Manager.GL.screenTone;
		const time = game.resolveNumber(this.time) * 1000;
		const color = this.colorID === null ? null : getColor(game.resolveNumber(this.colorID));
		return {
			parallel: this.waitEnd,
			finalDifRed: clampTone((game.resolveNumber(this.r) + (color ? color.red : 0)) / 255) - tone.x,
			finalDifGreen: clampTone((game.resolveNumber(this.g) + (color ? color.green : 0)) / 255) - tone.y,
			finalDifBlue: clampTone((game.resolveNumber(this.b) + (color ? color.blue : 0)) / 255) - tone.z,
			finalDifGrey: clampTone(1 - game.resolveNumber(this.grey) / 100) - tone.w,
			time,
			timeLeft: time,
		};
	}

	private apply(state: Record<string, unknown>, timeRate: number) {
		const tone = Manager.GL.screenTone;
		tone.setX(tone.x + timeRate * (state.finalDifRed as number));
		tone.setY(tone.y + timeRate * (state.finalDifGreen as number));
		tone.setZ(tone.z + timeRate * (state.finalDifBlue as number));
		tone.setW(tone.w + timeRate * (state.finalDifGrey as number));
	}

	update(state: CommandState, ctx: SimulationContext): number {
		if (!state!.parallel) {
			return 1;
		}
		this.apply(state!, getTimeRate(state!, ctx.getElapsedTime()));
		return (state!.timeLeft as number) === 0 ? 1 : 0;
	}

	updateFast(state: CommandState): number {
		this.apply(state!, 1);
		return 1;
	}
}

class CommandChangeFog extends CommandBase {
	private enabled: boolean;
	private intensity: DynamicValue;
	private colorID: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.enabled = Utils.numToBool(command[iterator.i++] as number);
		this.intensity = DynamicValue.createCommand(command, iterator);
		this.colorID = DynamicValue.createCommand(command, iterator);
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const map = ctx.map;
		if (map === null) {
			return 1;
		}
		map.model.isFog = this.enabled;
		if (this.enabled) {
			map.model.fogColorID = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, ctx.game.resolveNumber(this.colorID));
			map.model.fogIntensity = DynamicValue.create(
				DYNAMIC_VALUE_KIND.NUMBER,
				ctx.game.resolveNumber(this.intensity),
			);
		}
		map.updateFog();
		return 1;
	}
}

class CommandChangeWeather extends CommandBase {
	private isNone: boolean;
	private isColor = false;
	private colorID: DynamicValue | null = null;
	private imageID: DynamicValue | null = null;
	private numberPerPortion: DynamicValue | null = null;
	private portionsRay: DynamicValue | null = null;
	private size: DynamicValue | null = null;
	private depthTest: DynamicValue | null = null;
	private depthWrite: DynamicValue | null = null;
	private initialVelocity: DynamicValue | null = null;
	private velocityAddition: DynamicValue | null = null;
	private initialYRotation: DynamicValue | null = null;
	private yRotationAddition: DynamicValue | null = null;
	private isWaitEnd: boolean;
	private time: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.isNone = (command[iterator.i++] as number) === 0;
		if (!this.isNone) {
			this.isColor = (command[iterator.i++] as number) === 0;
			if (this.isColor) this.colorID = DynamicValue.createCommand(command, iterator);
			else this.imageID = DynamicValue.createCommand(command, iterator, true);
			this.numberPerPortion = DynamicValue.createCommand(command, iterator);
			this.portionsRay = DynamicValue.createCommand(command, iterator);
			this.size = DynamicValue.createCommand(command, iterator);
			this.depthTest = DynamicValue.createCommand(command, iterator);
			this.depthWrite = DynamicValue.createCommand(command, iterator);
			this.initialVelocity = DynamicValue.createCommand(command, iterator);
			this.velocityAddition = DynamicValue.createCommand(command, iterator);
			this.initialYRotation = DynamicValue.createCommand(command, iterator);
			this.yRotationAddition = DynamicValue.createCommand(command, iterator);
		}
		this.isWaitEnd = Utils.numToBool(command[iterator.i++] as number);
		this.time = DynamicValue.createCommand(command, iterator);
		this.parallel = !this.isWaitEnd;
	}

	initialize(ctx: SimulationContext): CommandState {
		const game = ctx.game;
		const time = game.resolveNumber(this.time) * 1000;
		const state: Record<string, unknown> = {
			parallel: this.isWaitEnd,
			time,
			timeLeft: time,
			isNone: this.isNone,
			created: false,
			particlesNumber: 0,
			finalParticlesNumber: 0,
		};
		if (!this.isNone) {
			const portionsRay = game.resolveNumber(this.portionsRay!);
			state.finalParticlesNumber =
				game.resolveNumber(this.numberPerPortion!) * (portionsRay * 8 + 1) * (portionsRay * 2 + 1);
			state.weather = {
				isNone: false,
				isColor: this.isColor,
				color: this.isColor ? getColor(game.resolveNumber(this.colorID!)).getTHREEColor() : null,
				imageID: this.isColor ? null : game.resolveNumber(this.imageID!),
				size: game.resolveNumber(this.size!),
				depthTest: game.resolveNumber(this.depthTest!) !== 0,
				depthWrite: game.resolveNumber(this.depthWrite!) !== 0,
				portionsRay,
				particlesNumber: 0,
				finalParticlesNumber: state.finalParticlesNumber as number,
				initialVelocity: () => game.resolveNumber(this.initialVelocity!),
				velocityAddition: () => game.resolveNumber(this.velocityAddition!),
				initialYRotation: () => game.resolveNumber(this.initialYRotation!),
				yRotationAddition: () => game.resolveNumber(this.yRotationAddition!),
				transition: true,
				points: null,
				velocities: [],
				rotationsAngle: [],
				rotationsPoints: [],
			};
		}
		return state;
	}

	private create(state: Record<string, unknown>, ctx: SimulationContext) {
		if (state.created) return;
		state.created = true;
		if (ctx.screen.previousWeather?.transition) {
			ctx.screen.removeWeather(ctx.screen.previousWeather, ctx.map!);
		}
		if (ctx.screen.weather) {
			ctx.screen.weather.transition = true;
		}
		ctx.screen.previousWeather = ctx.screen.weather;
		const weather = state.weather as SimulationWeather | undefined;
		ctx.screen.weather = weather ?? {
			isNone: true,
			isColor: false,
			color: null,
			imageID: null,
			size: 0,
			depthTest: false,
			depthWrite: false,
			portionsRay: 0,
			particlesNumber: 0,
			finalParticlesNumber: 0,
			initialVelocity: () => 0,
			velocityAddition: () => 0,
			initialYRotation: () => 0,
			yRotationAddition: () => 0,
			transition: true,
			points: null,
			velocities: [],
			rotationsAngle: [],
			rotationsPoints: [],
		};
		ctx.screen.createWeather(ctx.screen.weather, ctx.map!, ctx.camera!);
	}

	private apply(state: Record<string, unknown>, timeRate: number, ctx: SimulationContext) {
		state.particlesNumber = (state.particlesNumber as number) + timeRate * (state.finalParticlesNumber as number);
		this.create(state, ctx);
		const weather = ctx.screen.weather!;
		weather.particlesNumber = state.particlesNumber as number;
		if (ctx.screen.previousWeather) {
			ctx.screen.previousWeather.particlesNumber -= timeRate * ctx.screen.previousWeather.finalParticlesNumber;
		}
	}

	update(state: CommandState, ctx: SimulationContext): number {
		if (!state!.parallel) return 1;
		const timeRate = getTimeRate(state!, ctx.getElapsedTime());
		this.apply(state!, timeRate, ctx);
		if ((state!.timeLeft as number) === 0) {
			if (ctx.screen.weather) ctx.screen.weather.particlesNumber = state!.finalParticlesNumber as number;
			if (ctx.screen.weather) ctx.screen.weather.transition = false;
			if (ctx.screen.previousWeather) {
				ctx.screen.previousWeather.transition = false;
				ctx.screen.removeWeather(ctx.screen.previousWeather, ctx.map!);
				ctx.screen.previousWeather = null;
			}
			return 1;
		}
		return 0;
	}

	updateFast(state: CommandState, ctx: SimulationContext): number {
		this.apply(state!, 1, ctx);
		if (ctx.screen.previousWeather) {
			ctx.screen.removeWeather(ctx.screen.previousWeather, ctx.map!);
			ctx.screen.previousWeather = null;
		}
		if (ctx.screen.weather) ctx.screen.weather.transition = false;
		return 1;
	}
}

class CommandDisplayAnAnimation extends CommandBase {
	private objectID: DynamicValue;
	private animationID: DynamicValue;
	private waitEnd: boolean;
	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.objectID = DynamicValue.createCommand(command, iterator);
		this.animationID = DynamicValue.createCommand(command, iterator);
		this.waitEnd = Utils.numToBool(command[iterator.i++] as number);
		this.parallel = !this.waitEnd;
	}
	initialize(_ctx: SimulationContext): CommandState {
		return { parallel: this.waitEnd, animation: null };
	}
	update(state: CommandState, ctx: SimulationContext): number {
		if (!state!.parallel) return 1;
		if (state!.animation === null) {
			const model = Project.current!.animations.getAnimationByID(ctx.game.resolveNumber(this.animationID));
			const targetID = ctx.game.resolveNumber(this.objectID);
			const target =
				targetID === 0
					? ctx.hero
					: targetID === -1 || targetID === ctx.object?.object.id
						? ctx.object
						: (ctx.mapObjects.get(targetID) ?? null);
			if (!model || !target || !ctx.camera) return 1;
			const frameMax = Math.max(0, ...model.frames.map((frame) => frame.id));
			const animation = {
				started: performance.now(),
				duration: ((frameMax + 1) * 1000) / 60,
				model,
				target,
				camera: ctx.camera,
			};
			state!.animation = animation;
			ctx.screen.animations.push(animation);
		}
		const animation = state!.animation as (typeof ctx.screen.animations)[number];
		if (performance.now() - animation.started < animation.duration) return 0;
		const index = ctx.screen.animations.indexOf(animation);
		if (index >= 0) ctx.screen.animations.splice(index, 1);
		return 1;
	}
	updateFast(_state: CommandState, _ctx: SimulationContext): number {
		return 1;
	}
}

class CommandResetCamera extends CommandBase {
	update(_state: CommandState, ctx: SimulationContext): number {
		if (ctx.map && ctx.camera) ctx.map.applyCameraProperty(ctx.map.model.cameraPropertiesID.getFixNumberValue());
		return 1;
	}
}

extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.DISPLAY_A_PICTURE,
	(command: MapObjectCommandType[]) => new CommandDisplayAPicture(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.SET_MOVE_TURN_A_PICTURE,
	(command: MapObjectCommandType[]) => new CommandSetMoveTurnAPicture(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.REMOVE_A_PICTURE,
	(command: MapObjectCommandType[]) => new CommandRemoveAPicture(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.FLASH_SCREEN,
	(command: MapObjectCommandType[]) => new CommandFlashScreen(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.SHAKE_SCREEN,
	(command: MapObjectCommandType[]) => new CommandShakeScreen(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE,
	(command: MapObjectCommandType[]) => new CommandChangeScreenTone(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.CHANGE_FOG,
	(command: MapObjectCommandType[]) => new CommandChangeFog(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.CHANGE_WEATHER,
	(command: MapObjectCommandType[]) => new CommandChangeWeather(command),
);
extraSimulationCommandFactories.set(
	EVENT_COMMAND_KIND.DISPLAY_AN_ANIMATION,
	(command) => new CommandDisplayAnAnimation(command),
);
extraSimulationCommandFactories.set(EVENT_COMMAND_KIND.RESET_CAMERA, () => new CommandResetCamera());

export {
	CommandChangeFog,
	CommandChangeScreenTone,
	CommandChangeWeather,
	CommandDisplayAPicture,
	CommandFlashScreen,
	CommandRemoveAPicture,
	CommandSetMoveTurnAPicture,
	CommandShakeScreen,
};
