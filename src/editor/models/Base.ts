/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ModelType } from '../common/Enum';
import { Utils } from '../common/Utils';
import { Serializable } from '../core/Serializable';

class Base extends Serializable {
	public static readonly JSON_ID = 'i';
	public static readonly JSON_NAME = 'n';
	public static readonly DEFAULT_ID = 0;
	public static readonly DEFAULT_NAME = '';

	public id: number = Base.DEFAULT_ID;
	public name: string = Base.DEFAULT_NAME;

	constructor(json?: Record<string, any>, ...args: any) {
		super();
		this.setup(args);
		if (json) {
			this.read(json);
		}
	}

	static getModel(kind: ModelType): any {
		switch (kind) {
		}
	}

	static getDialog(kind: ModelType): any {
		switch (kind) {
		}
	}

	setup(...args: any) {
		// Setup here
	}

	toStrings(): string[] {
		return ['>'];
	}

	createCopy(): Base {
		const model = new Base();
		model.copy(this);
		return model;
	}

	copy(model: Base) {
		this.id = model.id;
		this.name = model.name;
	}

	read(json: Record<string, any>) {
		this.id = Utils.defaultValue(json[Base.JSON_ID], Base.DEFAULT_ID);
		this.name = json[Base.JSON_NAME];
	}

	write(json: Record<string, any>) {
		Utils.writeDefaultValue(json, Base.JSON_ID, this.id, Base.DEFAULT_ID);
		json[Base.JSON_NAME] = this.name;
	}
}

export { Base };
