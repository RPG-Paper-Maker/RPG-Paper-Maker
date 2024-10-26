/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, Constants, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class FontName extends Base {
	public isBasic!: boolean;
	public font!: DynamicValue;
	public customFontID!: number;

	public static bindings: BindingType[] = [
		['isBasic', 'isBasic', true, BINDING.BOOLEAN],
		[
			'font',
			'f',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, Constants.DEFAULT_FONT_NAME),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['customFontID', 'customFontID', 1, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(fontName: FontName, additionnalBinding: BindingType[] = []): void {
		super.copy(fontName, FontName.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, FontName.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, FontName.getBindings(additionnalBinding));
	}
}

export { FontName };
