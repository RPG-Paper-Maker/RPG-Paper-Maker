/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { ElementEfficiency } from './ElementEfficiency';
import { Icon } from './Icon';

class Element extends Icon {
	public efficiencies!: Map<number, DynamicValue>;

	public static bindings: BindingType[] = [['efficiencies', 'e', undefined, BINDING.MAP_KEY_VALUE, DynamicValue]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault() {
		super.applyDefault(Element.getBindings([]));
	}

	getEfficiencies(): ElementEfficiency[] {
		return Project.current!.battleSystem.elements.map((element: Element) =>
			ElementEfficiency.createEfficiency(
				element.id,
				element.getName(),
				this.efficiencies.get(element.id)?.clone() ?? DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 1)
			)
		);
	}

	fromEfficiencies(efficiencies: ElementEfficiency[]) {
		this.efficiencies = new Map();
		for (const efficiency of efficiencies) {
			if (efficiency.value.kind !== DYNAMIC_VALUE_KIND.NUMBER_DECIMAL || efficiency.value.value !== 1) {
				this.efficiencies.set(efficiency.id, efficiency.value.clone());
			}
		}
	}

	copy(element: Element): void {
		super.copy(element, Element.getBindings([]));
		this.efficiencies = new Map(Array.from(element.efficiencies.entries(), ([key, value]) => [key, value.clone()]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Element.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Element.getBindings(additionnalBinding));
	}
}

export { Element };
