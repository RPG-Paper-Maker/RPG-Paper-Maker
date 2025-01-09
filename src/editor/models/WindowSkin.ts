/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Rectangle } from '../core';
import { Base } from './Base';

class WindowSkin extends Base {
	public pictureID!: number;
	public borderTopLeft!: Rectangle;
	public borderTopRight!: Rectangle;
	public borderBotLeft!: Rectangle;
	public borderBotRight!: Rectangle;
	public borderLeft!: Rectangle;
	public borderRight!: Rectangle;
	public borderTop!: Rectangle;
	public borderBot!: Rectangle;
	public background!: Rectangle;
	public backgroundSelection!: Rectangle;
	public backgroundRepeat!: boolean;
	public arrowEndMessage!: Rectangle;
	public arrowTargetSelection!: Rectangle;
	public arrowUpDown!: Rectangle;
	public textNormal!: Rectangle;
	public textCritical!: Rectangle;
	public textHeal!: Rectangle;
	public textMiss!: Rectangle;

	public static bindings: BindingType[] = [
		['pictureID', 'pid', undefined, BINDING.NUMBER],
		['borderTopLeft', 'tl', undefined, BINDING.RECTANGLE],
		['borderTopRight', 'tr', undefined, BINDING.RECTANGLE],
		['borderBotLeft', 'bl', undefined, BINDING.RECTANGLE],
		['borderBotRight', 'br', undefined, BINDING.RECTANGLE],
		['borderLeft', 'l', undefined, BINDING.RECTANGLE],
		['borderRight', 'r', undefined, BINDING.RECTANGLE],
		['borderTop', 't', undefined, BINDING.RECTANGLE],
		['borderBot', 'b', undefined, BINDING.RECTANGLE],
		['background', 'back', undefined, BINDING.RECTANGLE],
		['backgroundSelection', 'backs', undefined, BINDING.RECTANGLE],
		['backgroundRepeat', 'backr', undefined, BINDING.BOOLEAN],
		['arrowEndMessage', 'aem', undefined, BINDING.RECTANGLE],
		['arrowTargetSelection', 'ats', undefined, BINDING.RECTANGLE],
		['arrowUpDown', 'aud', undefined, BINDING.RECTANGLE],
		['textNormal', 'tn', undefined, BINDING.RECTANGLE],
		['textCritical', 'tc', undefined, BINDING.RECTANGLE],
		['textHeal', 'th', undefined, BINDING.RECTANGLE],
		['textMiss', 'tm', undefined, BINDING.RECTANGLE],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(WindowSkin.getBindings([]));
		this.pictureID = -1;
		this.borderTopLeft = new Rectangle();
		this.borderTopRight = new Rectangle();
		this.borderBotLeft = new Rectangle();
		this.borderBotRight = new Rectangle();
		this.borderLeft = new Rectangle();
		this.borderRight = new Rectangle();
		this.borderTop = new Rectangle();
		this.borderBot = new Rectangle();
		this.background = new Rectangle();
		this.backgroundSelection = new Rectangle();
		this.backgroundRepeat = false;
		this.arrowEndMessage = new Rectangle();
		this.arrowTargetSelection = new Rectangle();
		this.arrowUpDown = new Rectangle();
		this.textNormal = new Rectangle();
		this.textCritical = new Rectangle();
		this.textHeal = new Rectangle();
		this.textMiss = new Rectangle();
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
