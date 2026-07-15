/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';
import { ObjectCommandTestCurrency } from './ObjectCommandTestCurrency';
import { ObjectCommandTestItem } from './ObjectCommandTestItem';
import { ObjectCommandTestVariable } from './ObjectCommandTestVariable';

class ObjectCommandTestConfig extends Base {
	public static type = 'ObjectCommandTestConfig';

	public cameraPropertyID!: number;
	public variables!: ObjectCommandTestVariable[];
	public currencies!: ObjectCommandTestCurrency[];
	public items!: ObjectCommandTestItem[];

	public static bindings: BindingType[] = [
		['cameraPropertyID', 'cameraPropertyID', 0, BINDING.NUMBER],
		['variables', 'variables', [], BINDING.LIST, ObjectCommandTestVariable],
		['currencies', 'currencies', [], BINDING.LIST, ObjectCommandTestCurrency],
		['items', 'items', [], BINDING.LIST, ObjectCommandTestItem],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createConfig(id: number, name: string): ObjectCommandTestConfig {
		const config = new ObjectCommandTestConfig();
		config.applyDefault();
		config.id = id;
		config.name = name;
		return config;
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(ObjectCommandTestConfig.getBindings(additionnalBinding));
	}

	copy(objectCommandTestConfig: ObjectCommandTestConfig): void {
		super.copy(objectCommandTestConfig, ObjectCommandTestConfig.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ObjectCommandTestConfig.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ObjectCommandTestConfig.getBindings(additionnalBinding));
	}
}

export { ObjectCommandTestConfig };
