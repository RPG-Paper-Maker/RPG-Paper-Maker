/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, ITEM_KIND, ITERATOR, Utils } from '../../common';
import { Localization, MapObjectCommandType } from '../../models';
import { DynamicValue } from '../DynamicValue';
import { Project } from '../Project';
import { GameStateSimulation, OPERATORS_COMPARE, OPERATORS_NUMBERS } from './GameStateSimulation';
import type { SimulationContext } from './SimulationInterpreter';

export type CommandState = Record<string, unknown> | null;

export type SimulationTextContent = {
	interlocutor: string;
	message: string;
	facesetID: number;
	facesetIndexX: number;
	facesetIndexY: number;
};

export type SimulationDialogBoxOptions = Partial<{
	windowSkinID: number;
	x: number;
	y: number;
	w: number;
	h: number;
	pLeft: number;
	pTop: number;
	pRight: number;
	pBottom: number;
	fPosAbove: boolean;
	fX: number;
	fY: number;
	tOutline: boolean;
	tcTextID: number;
	tcOutlineID: number;
	tSizeID: number;
	tFontID: number;
	iX: number;
	iY: number;
	iW: number;
	iH: number;
}>;

export interface SimulationHud {
	showText(content: SimulationTextContent, onAction: () => void): void;
	showChoices(text: SimulationTextContent | null, choices: string[], onChoice: (index: number) => void): void;
	setDialogBoxOptions(options: SimulationDialogBoxOptions): void;
	clear(): void;
}

class CommandBase {
	public parallel = false;
	public disabled = false;
	public goToNextCommand?: () => number;

	initialize(_ctx: SimulationContext): CommandState {
		return null;
	}

	update(_state: CommandState, _ctx: SimulationContext): number | string {
		return 1;
	}

	initializeFast(ctx: SimulationContext): CommandState {
		return this.initialize(ctx);
	}

	updateFast(state: CommandState, ctx: SimulationContext): number | string {
		return this.update(state, ctx);
	}
}

class CommandUnsupported extends CommandBase {
	update(_state: CommandState, _ctx: SimulationContext): number {
		return 1;
	}
}

class CommandCallACommonReaction extends CommandBase {
	private reactionID: number;
	constructor(command: MapObjectCommandType[]) {
		super();
		this.reactionID = command[0] as number;
	}
	initialize(ctx: SimulationContext): CommandState {
		return { interpreter: ctx.createCommonReactionInterpreter?.(this.reactionID) ?? null };
	}
	update(state: CommandState, _ctx: SimulationContext): number {
		const interpreter = state!.interpreter as import('./SimulationInterpreter').SimulationInterpreter | null;
		if (interpreter === null) {
			return 1;
		}
		interpreter.update();
		return interpreter.isFinished() ? 1 : 0;
	}
}

class CommandSetDialogBoxOptions extends CommandBase {
	private windowSkinID?: DynamicValue;
	private x?: DynamicValue;
	private y?: DynamicValue;
	private w?: DynamicValue;
	private h?: DynamicValue;
	private pLeft?: DynamicValue;
	private pTop?: DynamicValue;
	private pRight?: DynamicValue;
	private pBottom?: DynamicValue;
	private fPosAbove?: boolean;
	private fX?: DynamicValue;
	private fY?: DynamicValue;
	private tOutline?: boolean;
	private tcTextID?: DynamicValue;
	private tcOutlineID?: DynamicValue;
	private tSizeID?: DynamicValue;
	private tFontID?: DynamicValue;
	private iX?: DynamicValue;
	private iY?: DynamicValue;
	private iW?: DynamicValue;
	private iH?: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		const readValue = () =>
			Utils.numToBool(command[iterator.i++] as number)
				? DynamicValue.createCommand(command, iterator)
				: undefined;
		this.windowSkinID = readValue();
		this.x = readValue();
		this.y = readValue();
		this.w = readValue();
		this.h = readValue();
		this.pLeft = readValue();
		this.pTop = readValue();
		this.pRight = readValue();
		this.pBottom = readValue();
		if (Utils.numToBool(command[iterator.i++] as number))
			this.fPosAbove = Utils.numToBool(command[iterator.i++] as number);
		this.fX = readValue();
		this.fY = readValue();
		if (Utils.numToBool(command[iterator.i++] as number))
			this.tOutline = !Utils.numToBool(command[iterator.i++] as number);
		this.tcTextID = readValue();
		this.tcOutlineID = readValue();
		readValue(); // Background color is not used by the runtime message renderer.
		this.tSizeID = readValue();
		this.tFontID = readValue();
		this.iX = readValue();
		this.iY = readValue();
		this.iW = readValue();
		this.iH = readValue();
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const resolve = (value: DynamicValue | undefined) => (value ? ctx.game.resolveNumber(value) : undefined);
		ctx.hud?.setDialogBoxOptions({
			windowSkinID: resolve(this.windowSkinID),
			x: resolve(this.x),
			y: resolve(this.y),
			w: resolve(this.w),
			h: resolve(this.h),
			pLeft: resolve(this.pLeft),
			pTop: resolve(this.pTop),
			pRight: resolve(this.pRight),
			pBottom: resolve(this.pBottom),
			fPosAbove: this.fPosAbove,
			fX: resolve(this.fX),
			fY: resolve(this.fY),
			tOutline: this.tOutline,
			tcTextID: resolve(this.tcTextID),
			tcOutlineID: resolve(this.tcOutlineID),
			tSizeID: resolve(this.tSizeID),
			tFontID: resolve(this.tFontID),
			iX: resolve(this.iX),
			iY: resolve(this.iY),
			iW: resolve(this.iW),
			iH: resolve(this.iH),
		});
		return 1;
	}
}

class CommandShowText extends CommandBase {
	private interlocutor: DynamicValue;
	private facesetID: number;
	private facesetIndexX: number;
	private facesetIndexY: number;
	private message: string;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.interlocutor = DynamicValue.createCommand(command, iterator);
		this.facesetID = command[iterator.i++] as number;
		this.facesetIndexX = command[iterator.i++] as number;
		this.facesetIndexY = command[iterator.i++] as number;
		const texts = new Map<string, string>();
		while (iterator.i < command.length) {
			const id = '' + (command[iterator.i++] as number);
			texts.set(id, command[iterator.i++] as string);
		}
		const firstLanguageID = '' + Project.current!.languages.list[0].id;
		this.message = texts.get(firstLanguageID) ?? [...texts.values()][0] ?? '';
	}

	private resolveMessage(game: GameStateSimulation): string {
		return this.message.replace(
			/\[(?:(var|par|pro|hname)=(-?\d+)|lvar=([^\]]*))\]/g,
			(_match, tag: string | undefined, num: string | undefined, localVariableName: string | undefined) => {
				if (localVariableName !== undefined) {
					return String(game.getLocalVariable(localVariableName));
				}
				const id = parseInt(num!, 10);
				switch (tag) {
					case 'var':
						return String(game.getVariable(id) ?? '');
					case 'hname': {
						const instanceID = game.getVariable(id);
						const hero =
							game.findHeroByInstanceID(
								typeof instanceID === 'number' ? instanceID : Number(instanceID),
							) ??
							game.teamHeroes[0] ??
							null;
						return hero ? hero.name : '';
					}
					case 'par':
						return '0';
					case 'pro':
						return '0';
					default:
						return '';
				}
			},
		);
	}

	getContent(ctx: SimulationContext): SimulationTextContent {
		return {
			interlocutor: ctx.game.resolveString(this.interlocutor),
			message: this.resolveMessage(ctx.game),
			facesetID: this.facesetID,
			facesetIndexX: this.facesetIndexX,
			facesetIndexY: this.facesetIndexY,
		};
	}

	initialize(ctx: SimulationContext): CommandState {
		const state: CommandState = { clicked: false };
		if (ctx.hud) {
			ctx.hud.showText(this.getContent(ctx), () => {
				state.clicked = true;
			});
		} else {
			state.clicked = true;
		}
		return state;
	}

	update(state: CommandState, ctx: SimulationContext): number {
		if (state!.clicked) {
			ctx.hud?.clear();
			return 1;
		}
		return 0;
	}

	initializeFast(): CommandState {
		return null;
	}

	updateFast(): number {
		return 1;
	}
}

class CommandDisplayChoice extends CommandBase {
	private cancelAutoIndex: DynamicValue;
	private isStockChoiceIndex: boolean;
	private stockChoiceIndexVariable?: DynamicValue;
	private choices: string[] = [];
	private showText: CommandShowText | null = null;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.cancelAutoIndex = DynamicValue.createCommand(command, iterator);
		DynamicValue.createCommand(command, iterator);
		this.isStockChoiceIndex =
			iterator.i < command.length && command[iterator.i] !== '-'
				? Utils.initializeBoolCommand(command, iterator)
				: false;
		if (this.isStockChoiceIndex) {
			this.stockChoiceIndexVariable = DynamicValue.createCommand(command, iterator);
		}
		let localization: Localization | null = null;
		while (iterator.i < command.length) {
			const next = command[iterator.i];
			if (next === '-') {
				iterator.i++;
				if (localization !== null) {
					this.choices.push(localization.getName());
				}
				localization = new Localization();
			} else if (localization) {
				localization.initializeCommand(command, iterator);
			}
		}
		if (localization !== null) {
			this.choices.push(localization.getName());
		}
	}

	setShowText(showText: CommandShowText | null) {
		this.showText = showText;
	}

	initialize(ctx: SimulationContext): CommandState {
		const state: CommandState = { index: -1 };
		if (ctx.hud) {
			ctx.hud.showChoices(this.showText ? this.showText.getContent(ctx) : null, this.choices, (index) => {
				state.index = index;
			});
		} else {
			state.index = ctx.game.resolveNumber(this.cancelAutoIndex) - 1;
		}
		return state;
	}

	update(state: CommandState, ctx: SimulationContext): number {
		const index = state!.index as number;
		if (this.isStockChoiceIndex && index >= 0) {
			if (this.stockChoiceIndexVariable!.kind === DYNAMIC_VALUE_KIND.LOCAL_VARIABLE) {
				ctx.game.setLocalVariable(this.stockChoiceIndexVariable!.value as string, index);
			} else {
				ctx.game.setVariable(ctx.game.resolveNumber(this.stockChoiceIndexVariable!), index);
			}
		}
		if (index >= 0) {
			ctx.hud?.clear();
		}
		return index + 1;
	}

	initializeFast(): CommandState {
		return { index: -1 };
	}

	goToNextCommand = () => 1;
}

class CommandChoice extends CommandBase {
	public index: number;

	constructor(command: MapObjectCommandType[]) {
		super();
		this.index = command[0] as number;
	}

	update(): number {
		return -1;
	}

	goToNextCommand = () => 1;
}

type ConditionTree = {
	condition?: MapObjectCommandType[];
	operator?: number;
	children?: ConditionTree[];
};

class CommandIf extends CommandBase {
	private hasElse: boolean;
	private kind: number;
	private operator?: number;
	private conditions?: CommandIf[];
	private variableParamProp!: DynamicValue;
	private variableParamPropOperation!: number;
	private variableParamPropValue!: DynamicValue;
	private currencyID!: DynamicValue;
	private operationCurrency!: number;
	private currencyValue!: DynamicValue;
	private itemID!: DynamicValue;
	private operationItem!: number;
	private itemValue!: DynamicValue;
	private weaponID!: DynamicValue;
	private operationWeapon!: number;
	private weaponValue!: DynamicValue;
	private weaponEquiped!: boolean;
	private armorID!: DynamicValue;
	private operationArmor!: number;
	private armorValue!: DynamicValue;
	private armorEquiped!: boolean;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.hasElse = Utils.numToBool(command[iterator.i++] as number);
		this.kind = command[iterator.i++] as number;
		if (this.kind === -1) {
			const tree = command[iterator.i++] as unknown as {
				operator: number;
				conditions?: MapObjectCommandType[][];
				children?: ConditionTree[];
			};
			this.operator = tree.operator;
			const conditions: ConditionTree[] = tree.children ?? tree.conditions!.map((condition) => ({ condition }));
			this.conditions = conditions.map(
				(condition) =>
					new CommandIf(
						condition.children
							? ([0, -1, condition] as MapObjectCommandType[])
							: ([0, ...condition.condition!] as MapObjectCommandType[]),
					),
			);
			return;
		}
		switch (this.kind) {
			case 0:
				this.variableParamProp = DynamicValue.createCommand(command, iterator);
				this.variableParamPropOperation = command[iterator.i++] as number;
				this.variableParamPropValue = DynamicValue.createCommand(command, iterator);
				break;
			case 2:
				this.currencyID = DynamicValue.createCommand(command, iterator);
				this.operationCurrency = command[iterator.i++] as number;
				this.currencyValue = DynamicValue.createCommand(command, iterator);
				break;
			case 3:
				this.itemID = DynamicValue.createCommand(command, iterator);
				this.operationItem = command[iterator.i++] as number;
				this.itemValue = DynamicValue.createCommand(command, iterator);
				break;
			case 4:
				this.weaponID = DynamicValue.createCommand(command, iterator);
				this.operationWeapon = command[iterator.i++] as number;
				this.weaponValue = DynamicValue.createCommand(command, iterator);
				this.weaponEquiped = Utils.numToBool(command[iterator.i++] as number);
				break;
			case 5:
				this.armorID = DynamicValue.createCommand(command, iterator);
				this.operationArmor = command[iterator.i++] as number;
				this.armorValue = DynamicValue.createCommand(command, iterator);
				this.armorEquiped = Utils.numToBool(command[iterator.i++] as number);
				break;
		}
	}

	getItemsNumber(game: GameStateSimulation, kind: ITEM_KIND, id: DynamicValue): number {
		const item = game.findItem(kind, game.resolveNumber(id));
		return item === null ? 0 : item.nb;
	}

	evaluate(ctx: SimulationContext): boolean {
		if (this.conditions) {
			return this.operator === 0
				? this.conditions.every((condition) => condition.evaluate(ctx))
				: this.conditions.some((condition) => condition.evaluate(ctx));
		}
		const game = ctx.game;
		switch (this.kind) {
			case 0:
				return OPERATORS_COMPARE[this.variableParamPropOperation](
					game.resolveNumber(this.variableParamProp),
					game.resolveNumber(this.variableParamPropValue),
				);
			case 2:
				return OPERATORS_COMPARE[this.operationCurrency](
					game.getCurrency(game.resolveNumber(this.currencyID)),
					game.resolveNumber(this.currencyValue),
				);
			case 3:
				return OPERATORS_COMPARE[this.operationItem](
					this.getItemsNumber(game, ITEM_KIND.ITEM, this.itemID),
					game.resolveNumber(this.itemValue),
				);
			case 4:
				return OPERATORS_COMPARE[this.operationWeapon](
					this.getItemsNumber(game, ITEM_KIND.WEAPON, this.weaponID),
					game.resolveNumber(this.weaponValue),
				);
			case 5:
				return OPERATORS_COMPARE[this.operationArmor](
					this.getItemsNumber(game, ITEM_KIND.ARMOR, this.armorID),
					game.resolveNumber(this.armorValue),
				);
			default:
				return false;
		}
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		return this.evaluate(ctx) ? -1 : 1 + (this.hasElse ? 0 : 1);
	}

	goToNextCommand = () => 2 + (this.hasElse ? 1 : 0);
}

class CommandElse extends CommandBase {
	update(): number {
		return -1;
	}

	goToNextCommand = () => 2;
}

class CommandWhile extends CommandBase {
	update(): number {
		return -1;
	}

	goToNextCommand = () => 2;
}

class CommandWhileBreak extends CommandBase {
	update(): number {
		return -2;
	}
}

class CommandStopReaction extends CommandBase {
	update(): number {
		return -3;
	}
}

class CommandLabel extends CommandBase {
	public name: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.name = DynamicValue.createCommand(command, iterator);
	}
}

class CommandJumpToLabel extends CommandBase {
	private label: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.label = DynamicValue.createCommand(command, iterator);
	}

	update(_state: CommandState, ctx: SimulationContext): string {
		return ctx.game.resolveString(this.label);
	}
}

class CommandWait extends CommandBase {
	private milliseconds: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.milliseconds = DynamicValue.createCommand(command, iterator);
	}

	initialize(ctx: SimulationContext): CommandState {
		return {
			remaining: ctx.game.resolveNumber(this.milliseconds) * 1000,
		};
	}

	update(state: CommandState, ctx: SimulationContext): number {
		state!.remaining = (state!.remaining as number) - ctx.getElapsedTime();
		return (state!.remaining as number) <= 0 ? 1 : 0;
	}

	updateFast(): number {
		return 1;
	}
}

class CommandChangeVariables extends CommandBase {
	private selection!: number;
	private nbSelection: number;
	private localVariableName: string | null = null;
	private operation: number;
	private valueKind: number;
	private valueNumber!: DynamicValue;
	private valueRandomA!: DynamicValue;
	private valueRandomB!: DynamicValue;
	private valueMessage!: DynamicValue;
	private valueSwitch!: DynamicValue;
	private valueItemKind!: ITEM_KIND;
	private valueItemID!: DynamicValue;
	private valueTotalCurrencyKind!: number;
	private valueTotalCurrencyID!: DynamicValue;
	private valueScript!: string;
	private valueTerrainX!: DynamicValue;
	private valueTerrainY!: DynamicValue;
	private valueTerrainZ!: DynamicValue;
	private valueTerrainXPlus!: DynamicValue;
	private valueTerrainYPlus!: DynamicValue;
	private valueTerrainZPlus!: DynamicValue;
	private isFloored: boolean;

	constructor(command: MapObjectCommandType[], isLocal = false) {
		super();
		const iterator: ITERATOR = { i: isLocal ? 0 : 2 };
		this.nbSelection = 1;
		if (isLocal) {
			const isCreating = Utils.numToBool(command[iterator.i++] as number);
			this.localVariableName = command[iterator.i++] as string;
			this.operation = isCreating ? 0 : (command[iterator.i++] as number);
		} else {
			this.selection = command[1] as number;
			if (command[0] === 1) {
				this.nbSelection = (command[iterator.i++] as number) - this.selection;
			}
			this.operation = command[iterator.i++] as number;
		}
		this.valueKind = command[iterator.i++] as number;
		switch (this.valueKind) {
			case 0:
				this.valueNumber = DynamicValue.createCommand(command, iterator);
				break;
			case 1:
				this.valueRandomA = DynamicValue.createCommand(command, iterator);
				this.valueRandomB = DynamicValue.createCommand(command, iterator);
				break;
			case 2:
				this.valueMessage = DynamicValue.createCommand(command, iterator);
				break;
			case 3:
				this.valueSwitch = DynamicValue.createCommand(command, iterator);
				break;
			case 5:
				this.valueItemKind = command[iterator.i++] as number;
				this.valueItemID = DynamicValue.createCommand(command, iterator);
				break;
			case 6:
				this.valueTotalCurrencyKind = command[iterator.i++] as number;
				this.valueTotalCurrencyID = DynamicValue.createCommand(command, iterator);
				break;
			case 10:
				this.valueScript = String(command[iterator.i++]);
				break;
			case 11:
				this.valueTerrainX = DynamicValue.createCommand(command, iterator);
				this.valueTerrainY = DynamicValue.createCommand(command, iterator);
				this.valueTerrainZ = DynamicValue.createCommand(command, iterator);
				this.valueTerrainXPlus = DynamicValue.createCommand(command, iterator);
				this.valueTerrainYPlus = DynamicValue.createCommand(command, iterator);
				this.valueTerrainZPlus = DynamicValue.createCommand(command, iterator);
				break;
		}
		this.isFloored = command[iterator.i] === 1;
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const game = ctx.game;
		let value: unknown;
		switch (this.valueKind) {
			case 0:
				value = game.resolveValue(this.valueNumber);
				break;
			case 1: {
				const a = game.resolveNumber(this.valueRandomA);
				const b = game.resolveNumber(this.valueRandomB);
				value = Math.floor(Math.random() * (b - a + 1)) + a;
				break;
			}
			case 2:
				value = game.resolveValue(this.valueMessage);
				break;
			case 3:
				value = game.resolveValue(this.valueSwitch);
				break;
			case 5: {
				const item = game.findItem(this.valueItemKind, game.resolveNumber(this.valueItemID));
				value = item === null ? 0 : item.nb;
				break;
			}
			case 6: {
				const id = game.resolveNumber(this.valueTotalCurrencyID);
				switch (this.valueTotalCurrencyKind) {
					case 1:
						value = game.getCurrencyEarned(id);
						break;
					case 2:
						value = game.getCurrencyUsed(id);
						break;
					default:
						value = game.getCurrency(id);
						break;
				}
				break;
			}
			case 10:
				try {
					const currentValue =
						this.localVariableName === null
							? game.getVariable(this.selection)
							: (game.getLocalVariable(this.localVariableName) ?? 0);
					value = new Function('$value', 'Math', `return ${this.valueScript}`)(currentValue, Math);
				} catch (error) {
					console.error(`Error while interpreting simulation script: "${this.valueScript}"`, error);
					value = null;
				}
				break;
			case 11:
				value = 0;
				break;
			default:
				return 1;
		}
		if (this.localVariableName !== null) {
			const previous = game.getLocalVariable(this.localVariableName);
			const result =
				typeof value === 'number' && typeof previous === 'number'
					? OPERATORS_NUMBERS[this.operation](previous, value)
					: value;
			game.setLocalVariable(this.localVariableName, this.isFloored ? Math.floor(result as number) : result);
			return 1;
		}
		for (let i = 0; i < this.nbSelection; i++) {
			const id = this.selection + i;
			const previous = game.getVariable(id);
			const result =
				typeof value === 'number' && typeof previous === 'number'
					? OPERATORS_NUMBERS[this.operation](previous, value)
					: value;
			game.setVariable(id, this.isFloored ? Math.floor(result as number) : result);
		}
		return 1;
	}
}

class CommandModifyCurrency extends CommandBase {
	private currencyID: DynamicValue;
	private operation: number;
	private value: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.currencyID = DynamicValue.createCommand(command, iterator);
		this.operation = command[iterator.i++] as number;
		this.value = DynamicValue.createCommand(command, iterator);
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const game = ctx.game;
		const currencyID = game.resolveNumber(this.currencyID);
		const previous = game.getCurrency(currencyID);
		game.currencies.set(
			currencyID,
			Math.round(OPERATORS_NUMBERS[this.operation](previous, game.resolveNumber(this.value))),
		);
		const dif = game.getCurrency(currencyID) - previous;
		if (dif > 0) {
			game.currenciesEarned.set(currencyID, game.getCurrencyEarned(currencyID) + dif);
		} else {
			game.currenciesUsed.set(currencyID, game.getCurrencyUsed(currencyID) - dif);
		}
		return 1;
	}
}

class CommandModifyInventory extends CommandBase {
	private itemKind: ITEM_KIND;
	private itemID: DynamicValue;
	private operation: number;
	private value: DynamicValue;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.itemKind = command[iterator.i++] as number;
		this.itemID = DynamicValue.createCommand(command, iterator);
		this.operation = command[iterator.i++] as number;
		this.value = DynamicValue.createCommand(command, iterator);
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const game = ctx.game;
		game.modifyItem(this.itemKind, game.resolveNumber(this.itemID), this.operation, game.resolveNumber(this.value));
		return 1;
	}
}

class CommandModifyTeam extends CommandBase {
	private kind: number;
	private instanceLevel!: DynamicValue;
	private instanceTeam!: number;
	private stockVariableID!: DynamicValue;
	private instanceKind!: number;
	private instanceID!: DynamicValue;
	private modifyKind!: number;
	private modifyInstanceID!: DynamicValue;
	private modifyTeam!: number;

	constructor(command: MapObjectCommandType[]) {
		super();
		const iterator = Utils.generateIterator();
		this.kind = command[iterator.i++] as number;
		switch (this.kind) {
			case 0:
				this.instanceLevel = DynamicValue.createCommand(command, iterator);
				this.instanceTeam = command[iterator.i++] as number;
				this.stockVariableID = DynamicValue.createCommand(command, iterator);
				this.instanceKind = command[iterator.i++] as number;
				this.instanceID = DynamicValue.createCommand(command, iterator);
				break;
			case 2:
				this.modifyKind = command[iterator.i++] as number;
				this.modifyInstanceID = DynamicValue.createCommand(command, iterator);
				this.modifyTeam = command[iterator.i++] as number;
				break;
		}
	}

	update(_state: CommandState, ctx: SimulationContext): number {
		const game = ctx.game;
		switch (this.kind) {
			case 0: {
				if (this.instanceKind !== 0) {
					break;
				}
				const hero = game.addHero(
					game.getTeam(this.instanceTeam),
					game.resolveNumber(this.instanceID),
					game.resolveNumber(this.instanceLevel),
				);
				game.setVariable(this.stockVariableID.value as number, hero.instanceID);
				break;
			}
			case 1:
				break;
			case 2: {
				const id = game.resolveNumber(this.modifyInstanceID);
				for (const group of game.getGroups()) {
					const index = group.findIndex((hero) => hero.instanceID === id);
					if (index >= 0) {
						const [hero] = group.splice(index, 1);
						if (this.modifyKind === 0) {
							game.getTeam(this.modifyTeam).push(hero);
						}
						break;
					}
				}
				break;
			}
		}
		return 1;
	}
}

export type SimulationCommandFactory = (command: MapObjectCommandType[]) => CommandBase;

export const extraSimulationCommandFactories = new Map<EVENT_COMMAND_KIND, SimulationCommandFactory>();

export const createSimulationCommand = (
	kind: EVENT_COMMAND_KIND,
	command: MapObjectCommandType[],
): CommandBase | null => {
	const extraFactory = extraSimulationCommandFactories.get(kind);
	if (extraFactory) {
		return extraFactory(command);
	}
	switch (kind) {
		case EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS:
			return new CommandSetDialogBoxOptions(command);
		case EVENT_COMMAND_KIND.SHOW_TEXT:
			return new CommandShowText(command);
		case EVENT_COMMAND_KIND.CHANGE_VARIABLES:
			return new CommandChangeVariables(command);
		case EVENT_COMMAND_KIND.CHANGE_LOCAL_VARIABLE:
			return new CommandChangeVariables(command, true);
		case EVENT_COMMAND_KIND.WHILE:
			return new CommandWhile();
		case EVENT_COMMAND_KIND.WHILE_BREAK:
			return new CommandWhileBreak();
		case EVENT_COMMAND_KIND.IF:
			return new CommandIf(command);
		case EVENT_COMMAND_KIND.ELSE:
			return new CommandElse();
		case EVENT_COMMAND_KIND.MODIFY_INVENTORY:
			return new CommandModifyInventory(command);
		case EVENT_COMMAND_KIND.MODIFY_TEAM:
			return new CommandModifyTeam(command);
		case EVENT_COMMAND_KIND.WAIT:
			return new CommandWait(command);
		case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
			return new CommandDisplayChoice(command);
		case EVENT_COMMAND_KIND.CHOICE:
			return new CommandChoice(command);
		case EVENT_COMMAND_KIND.STOP_REACTION:
			return new CommandStopReaction();
		case EVENT_COMMAND_KIND.LABEL:
			return new CommandLabel(command);
		case EVENT_COMMAND_KIND.JUMP_LABEL:
			return new CommandJumpToLabel(command);
		case EVENT_COMMAND_KIND.MODIFY_CURRENCY:
			return new CommandModifyCurrency(command);
		case EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION:
			return new CommandCallACommonReaction(command);
		case EVENT_COMMAND_KIND.END_WHILE:
		case EVENT_COMMAND_KIND.END_IF:
		case EVENT_COMMAND_KIND.END_CHOICE:
		case EVENT_COMMAND_KIND.IF_WIN:
		case EVENT_COMMAND_KIND.IF_LOSE:
			return null;
		default:
			return new CommandUnsupported();
	}
};

export {
	CommandBase,
	CommandCallACommonReaction,
	CommandChangeVariables,
	CommandChoice,
	CommandDisplayChoice,
	CommandElse,
	CommandIf,
	CommandJumpToLabel,
	CommandLabel,
	CommandModifyCurrency,
	CommandModifyInventory,
	CommandModifyTeam,
	CommandSetDialogBoxOptions,
	CommandShowText,
	CommandStopReaction,
	CommandUnsupported,
	CommandWait,
	CommandWhile,
	CommandWhileBreak,
};
