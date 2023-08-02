/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import react, { ReactNode } from 'react';
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

	constructor(id: number = Base.DEFAULT_ID, name: string = Base.DEFAULT_NAME) {
		super();
		this.id = id;
		this.name = name;
	}

	static getModel(kind: ModelType): any {
		switch (kind) {
		}
	}

	static getDialog(kind: ModelType): any {
		switch (kind) {
		}
	}

	getIcon(): ReactNode {
		return null;
	}

	toStringNameID() {
		return `${this.id < 0 ? '' : `${Utils.formatNumber(this.id, 4)}: `}${this.name}`;
	}

	toString(): string {
		return this.toStringNameID();
	}

	toStrings(): string[] {
		return [this.toStringNameID()];
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
