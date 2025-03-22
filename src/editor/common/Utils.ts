/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, ITERATOR, JSONType } from '.';
import { Serializable } from '../core';
import { Model } from '../Editor';

class Utils {
	public static defaultValue<T>(value: T | undefined, defaultValue: T): T {
		return value === undefined ? defaultValue : value;
	}

	public static writeDefaultValue<T>(json: JSONType, jsonName: string, value: T, defaultValue: T) {
		if (value !== defaultValue) {
			json[jsonName] = value;
		}
	}

	public static writeDefaultValueArray(prop: JSONType, propName: string, value: unknown[]) {
		if (value.length > 0) {
			prop[propName] = value;
		}
	}

	static isNumber(value: unknown): boolean {
		return typeof value === Constants.NUMBER;
	}

	static isString(value: unknown): boolean {
		return typeof value === Constants.STRING;
	}

	static readList(list: Serializable[], json: JSONType[], constructor: typeof Serializable) {
		if (json) {
			for (const jsonModel of json) {
				const model = new constructor();
				model.read(jsonModel);
				list.push(model);
			}
		}
	}

	static writeList(list: Serializable[], json: JSONType, jsonName: string) {
		const jsonList: JSONType[] = [];
		for (const model of list) {
			const jsonModel = {};
			model.write(jsonModel);
			jsonList.push(jsonModel);
		}
		json[jsonName] = jsonList;
	}

	static formatNumber(num: number, size: number): string {
		return String(num).padStart(size, '0');
	}

	static formatNumberID(num: number): string {
		return this.formatNumber(num, 4);
	}

	static numToBool(n: number): boolean {
		return n === Constants.NUM_BOOL_TRUE;
	}

	static initializeBoolCommand(list: Model.MapObjectCommandType[], iterator: ITERATOR): boolean {
		return Utils.numToBool(Number(list[iterator.i++]));
	}

	static boolToNum(b: boolean): number {
		return b ? Constants.NUM_BOOL_TRUE : Constants.NUM_BOOL_FALSE;
	}

	static getClassName(conditionals: Record<string, boolean>, always?: string): string {
		return `${Object.keys(conditionals)
			.filter((key) => conditionals[key])
			.join(' ')}${always ? ` ${always}` : ''}`;
	}

	static isMobile(): boolean {
		return 'ontouchstart' in window;
	}

	static isDesktop(): boolean {
		return !!window?.process?.versions?.electron;
	}

	static drawStrokedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
		ctx.strokeText(text, x, y);
		ctx.fillText(text, x, y);
	}

	static formatProjectFolderName(name: string) {
		return name
			.replace(/ /g, '-')
			.replace(/[^a-zA-Z0-9-]/g, '')
			.toLowerCase();
	}

	static sanitizeFilename(name: string): string {
		const forbiddenChars = /[\\/:*?"<>|]/g;
		let sanitized = name.replace(forbiddenChars, '');
		sanitized = sanitized.normalize('NFD').replace(/[̀-ͯ]/g, '');
		sanitized = sanitized.replace(/[^a-zA-Z0-9_.-]/g, '');
		const reservedNames = [
			'CON',
			'PRN',
			'AUX',
			'NUL',
			'COM1',
			'COM2',
			'COM3',
			'COM4',
			'COM5',
			'COM6',
			'COM7',
			'COM8',
			'COM9',
			'LPT1',
			'LPT2',
			'LPT3',
			'LPT4',
			'LPT5',
			'LPT6',
			'LPT7',
			'LPT8',
			'LPT9',
		];
		if (reservedNames.includes(sanitized.toUpperCase())) {
			sanitized = '_' + sanitized;
		}
		return sanitized;
	}

	static getViewport() {
		const dialogs = document.getElementsByClassName('dialog');
		return dialogs.length === 0 ? document.body : dialogs[dialogs.length - 1];
	}

	static getViewportLeft() {
		return Utils.getViewport().getBoundingClientRect().x;
	}

	static getViewportTop() {
		const viewport = Utils.getViewport();
		return viewport === document.body ? 0 : viewport.getBoundingClientRect().top;
	}

	static getViewportBottom() {
		const viewport = Utils.getViewport();
		return viewport === document.body ? 0 : viewport.getBoundingClientRect().bottom;
	}

	static generateIterator(): ITERATOR {
		return { i: 0 };
	}

	static capitalize(str: string): string {
		if (str.length === 0) {
			return str;
		}
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}

export { Utils };
