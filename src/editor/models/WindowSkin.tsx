/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';

class WindowSkin extends Base {
	public pictureID!: number;
	public borderTopLeft!: number[];
	public borderTopRight!: number[];
	public borderBotLeft!: number[];
	public borderBotRight!: number[];
	public borderLeft!: number[];
	public borderRight!: number[];
	public borderTop!: number[];
	public borderBot!: number[];
	public background!: number[];
	public backgroundSelection!: number[];
	public backgroundRepeat!: number[];
	public arrowEndMessage!: number[];
	public arrowTargetSelection!: number[];
	public arrowUpDown!: number[];
	public textNormal!: number[];
	public textCritical!: number[];
	public textHeal!: number[];
	public textMiss!: number[];

	public static bindings: BindingType[] = [
		['pictureID', 'pid', undefined, BINDING.NUMBER],
		['borderTopLeft', 'tl', undefined, BINDING.NUMBER],
		['borderTopRight', 'tr', undefined, BINDING.NUMBER],
		['borderBotLeft', 'bl', undefined, BINDING.NUMBER],
		['borderBotRight', 'br', undefined, BINDING.NUMBER],
		['borderLeft', 'l', undefined, BINDING.NUMBER],
		['borderRight', 'r', undefined, BINDING.NUMBER],
		['borderTop', 't', undefined, BINDING.NUMBER],
		['borderBot', 'b', undefined, BINDING.NUMBER],
		['background', 'back', undefined, BINDING.NUMBER],
		['backgroundSelection', 'backs', undefined, BINDING.NUMBER],
		['backgroundRepeat', 'backr', undefined, BINDING.NUMBER],
		['arrowEndMessage', 'aem', undefined, BINDING.NUMBER],
		['arrowTargetSelection', 'ats', undefined, BINDING.NUMBER],
		['arrowUpDown', 'aud', undefined, BINDING.NUMBER],
		['textNormal', 'tn', undefined, BINDING.NUMBER],
		['textCritical', 'tc', undefined, BINDING.NUMBER],
		['textHeal', 'th', undefined, BINDING.NUMBER],
		['textMiss', 'tm', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(windowSkin: WindowSkin): void {
		super.copy(windowSkin, WindowSkin.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, WindowSkin.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, WindowSkin.getBindings(additionnalBinding));
	}
}

export { WindowSkin };
