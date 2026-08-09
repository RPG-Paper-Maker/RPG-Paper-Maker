/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, ITEM_KIND } from '../../common';
import { Model } from '../../Editor';
import { DynamicValue } from '../DynamicValue';
import { Project } from '../Project';

export type SimulationItem = {
	kind: ITEM_KIND;
	id: number;
	nb: number;
};

export type SimulationHero = {
	instanceID: number;
	heroID: number;
	level: number;
	name: string;
};

export const OPERATORS_COMPARE: ReadonlyArray<(a: number, b: number) => boolean> = [
	(a, b) => a === b,
	(a, b) => a !== b,
	(a, b) => a >= b,
	(a, b) => a <= b,
	(a, b) => a > b,
	(a, b) => a < b,
];

export const OPERATORS_NUMBERS: ReadonlyArray<(a: number, b: number) => number> = [
	(_a, b) => b,
	(a, b) => Math.round((a + b) * 1e4) / 1e4,
	(a, b) => Math.round((a - b) * 1e4) / 1e4,
	(a, b) => Math.round(a * b * 1e4) / 1e4,
	(a, b) => Math.round((a / b) * 1e4) / 1e4,
	(a, b) => a % b,
];

class GameStateSimulation {
	public variables = new Map<number, unknown>();
	public localVariables = new Map<string, unknown>();
	public currencies = new Map<number, number>();
	public currenciesEarned = new Map<number, number>();
	public currenciesUsed = new Map<number, number>();
	public items: SimulationItem[] = [];
	public teamHeroes: SimulationHero[] = [];
	public reserveHeroes: SimulationHero[] = [];
	public hiddenHeroes: SimulationHero[] = [];

	private nextInstanceID = 1;

	static create(config: Model.ObjectCommandTestConfig): GameStateSimulation {
		const simulation = new GameStateSimulation();
		for (const currency of Project.current!.systems.currencies) {
			simulation.currencies.set(currency.id, 0);
			simulation.currenciesEarned.set(currency.id, 0);
			simulation.currenciesUsed.set(currency.id, 0);
		}
		for (const variable of config.variables) {
			simulation.variables.set(variable.variableID, variable.value);
		}
		for (const currency of config.currencies) {
			simulation.currencies.set(currency.currencyID, currency.nb);
		}
		for (const item of config.items) {
			simulation.items.push({ kind: item.kind, id: item.itemID, nb: item.nb });
		}
		for (const member of Project.current!.systems.initialPartyMembers) {
			if (member.isHero) {
				simulation.addHero(
					simulation.getTeam(member.teamKind),
					simulation.resolveNumber(member.heroID),
					simulation.resolveNumber(member.level),
				);
			}
		}
		return simulation;
	}

	addHero(group: SimulationHero[], heroID: number, level: number): SimulationHero {
		const hero: SimulationHero = {
			instanceID: this.nextInstanceID++,
			heroID,
			level,
			name: Project.current!.heroes.getByID(heroID)?.getName() ?? '',
		};
		group.push(hero);
		return hero;
	}

	getGroups(): SimulationHero[][] {
		return [this.teamHeroes, this.reserveHeroes, this.hiddenHeroes];
	}

	getTeam(groupIndex: number): SimulationHero[] {
		return this.getGroups()[groupIndex] ?? this.teamHeroes;
	}

	findHeroByInstanceID(instanceID: number): SimulationHero | null {
		for (const group of this.getGroups()) {
			const hero = group.find((h) => h.instanceID === instanceID);
			if (hero) {
				return hero;
			}
		}
		return null;
	}

	getVariable(id: number): unknown {
		if (this.variables.has(id)) {
			return this.variables.get(id);
		}
		const variable = Project.current!.variables.getVariableByID(id) as Model.Variable | null;
		return variable?.defaultValue ?? 0;
	}

	setVariable(id: number, value: unknown) {
		this.variables.set(id, value);
	}

	getLocalVariable(name: string): unknown {
		return this.localVariables.get(name) ?? 0;
	}

	setLocalVariable(name: string, value: unknown) {
		this.localVariables.set(name, value);
	}

	getCurrency(id: number): number {
		return this.currencies.get(id) ?? 0;
	}

	getCurrencyEarned(id: number): number {
		return this.currenciesEarned.get(id) ?? 0;
	}

	getCurrencyUsed(id: number): number {
		return this.currenciesUsed.get(id) ?? 0;
	}

	findItem(kind: ITEM_KIND, id: number): SimulationItem | null {
		return this.items.find((item) => item.kind === kind && item.id === id) ?? null;
	}

	modifyItem(kind: ITEM_KIND, id: number, operation: number, value: number) {
		let item = this.findItem(kind, id);
		if (item === null) {
			item = { kind, id, nb: 0 };
			this.items.push(item);
		}
		item.nb = Math.round(OPERATORS_NUMBERS[operation](item.nb, value));
		if (item.nb <= 0) {
			this.items.splice(this.items.indexOf(item), 1);
		}
	}

	resolveValue(value: DynamicValue): unknown {
		switch (value.kind) {
			case DYNAMIC_VALUE_KIND.VARIABLE:
				return this.getVariable(value.value as number);
			case DYNAMIC_VALUE_KIND.LOCAL_VARIABLE:
				return this.getLocalVariable(value.value as string);
			case DYNAMIC_VALUE_KIND.PARAMETER:
			case DYNAMIC_VALUE_KIND.PROPERTY:
				return 0;
			case DYNAMIC_VALUE_KIND.FORMULA:
				// Game-Scripts evaluates formula dynamic values at runtime. This is
				// essential for weather, whose standard velocity formulas use Math
				// and are re-evaluated for every particle update.
				try {
					return new Function('Math', `return ${String(value.value)}`)(Math);
				} catch (error) {
					console.error(`Error while interpreting simulation formula: "${String(value.value)}"`, error);
					return null;
				}
			case DYNAMIC_VALUE_KIND.NONE:
				return null;
			default:
				return value.value;
		}
	}

	resolveNumber(value: DynamicValue): number {
		const resolved = this.resolveValue(value);
		if (typeof resolved === 'number') {
			return resolved;
		}
		if (typeof resolved === 'boolean') {
			return resolved ? 1 : 0;
		}
		const parsed = Number(resolved);
		return isNaN(parsed) ? 0 : parsed;
	}

	resolveString(value: DynamicValue): string {
		const resolved = this.resolveValue(value);
		return resolved === null || resolved === undefined ? '' : String(resolved);
	}
}

export { GameStateSimulation };
