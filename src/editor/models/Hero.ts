/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import { BindingType } from '../core/Serializable';
import { Class } from './Class';
import { Localization } from './Localization';

class Hero extends Localization {
	public static type = 'Hero';
	public class!: number;
	public idBattler!: number;
	public idFaceset!: number;
	public indexXFaceset!: number;
	public indexYFaceset!: number;
	public classInherit!: Class;
	public description!: Localization;

	public static bindings: BindingType[] = [
		['class', 'class', undefined, BINDING.NUMBER],
		['idBattler', 'bid', -1, BINDING.NUMBER],
		['idFaceset', 'fid', -1, BINDING.NUMBER],
		['indexXFaceset', 'indexXFaceset', 0, BINDING.NUMBER],
		['indexYFaceset', 'indexYFaceset', 0, BINDING.NUMBER],
		['classInherit', 'ci', undefined, BINDING.OBJECT, Class],
		['description', 'description', undefined, BINDING.OBJECT, Localization],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(Hero.getBindings(additionnalBinding));
		this.class = 1;
		this.classInherit = new Class();
		this.classInherit.applyDefault();
		this.description = Localization.create(-1, '');
	}

	copy(hero: Hero, additionnalBinding: BindingType[] = []): void {
		super.copy(hero, Hero.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Hero.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Hero.getBindings(additionnalBinding));
	}
}

export { Hero };
