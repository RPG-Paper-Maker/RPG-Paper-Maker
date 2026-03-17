/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { DYNAMIC_VALUE_KIND, ITERATOR, JSONType, Utils } from '../common';
import DialogCustomStructure from '../components/dialogs/models/DialogCustomStructure';
import Flex from '../components/Flex';
import { DynamicValue } from '../core/DynamicValue';
import { Node } from '../core/Node';
import { BindingType } from '../core/Serializable';
import { Model } from '../Editor';
import { Base, DIALOG_OPTIONS } from './Base';
import { MapObjectCommandType } from './MapObjectCommand';

class CustomStructure extends Base {
	public static type = 'CustomStructure';
	public elements!: CustomStructure[];
	public isList!: boolean;
	public isProperty!: boolean;
	public description!: string;
	public value!: DynamicValue;
	public isElement = false;
	public isClosure = false;

	static fromNode(node: Node): CustomStructure {
		const structure = node.content as CustomStructure;
		structure.elements = CustomStructure.fromNodes(node.children);
		return structure;
	}

	static fromNodes(nodes: Node[]): CustomStructure[] {
		const elements = [];
		for (const node of nodes) {
			const structure = node.content as CustomStructure;
			if (!structure.isClosure) {
				if (structure.value) {
					if (structure.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE) {
						structure.value.customStructure.elements = CustomStructure.fromNodes(node.children);
					}
					if (structure.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST) {
						structure.value.customList.elements = CustomStructure.fromNodes(node.children);
					}
				}
				elements.push(structure);
			}
		}
		return elements;
	}

	applyDefault() {
		super.applyDefault(CustomStructure.getBindings([]));
		this.isElement = true;
		this.isProperty = true;
		this.description = '';
		this.value = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
	}

	getSelectionNextIndexes(): number {
		return this.canHaveChildren() ? 2 : 0;
	}

	canHaveChildren(): boolean {
		return (
			!!this.elements ||
			(!this.isClosure &&
				(!this.value ||
					this.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE ||
					this.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST))
		);
	}

	canExpand(): boolean {
		return this.canHaveChildren();
	}

	isFixedNode(): boolean {
		return this.isClosure;
	}

	updateCommand(command: MapObjectCommandType[], iterator: ITERATOR) {
		this.read(command[iterator.i++] as JSONType);
	}

	getCommand(command: MapObjectCommandType[]) {
		const json = {} as JSONType;
		this.write(json);
		command.push(json);
	}

	toNodes(parent: Node | null = null): Node[] {
		const children = [] as Node[];
		const node = Node.create(this.clone(), children, parent);
		if (this.canHaveChildren()) {
			const elements =
				this.elements ??
				(this.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE
					? this.value.customStructure.elements
					: this.value.customList.elements);
			for (const element of elements) {
				const nodes = element.toNodes(node);
				children.push(...nodes);
			}
			const closure = new CustomStructure();
			closure.applyDefault();
			closure.isClosure = true;
			closure.isList = this.value ? this.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST : this.isList;
			return [node, Node.create(closure, [], parent)];
		}
		return [node];
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogCustomStructure {...options} />;
	}

	toStringComplete(): string {
		if (this.elements) {
			const inside = this.elements.map((element) => element.toStringComplete()).join(', ');
			return this.isList ? `[${inside}]` : `{${inside}}`;
		} else {
			if (this.isProperty) {
				return `"${this.name}": ${this.value.toString()}`;
			} else {
				return this.value.toString();
			}
		}
	}

	toStringValue(): string | ReactNode {
		switch (this.value.kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				return <div style={{ fontWeight: 'bold', color: Model.MapObjectCommand.COLOR_ORANGE }}>{'{'}</div>;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				return <div style={{ fontWeight: 'bold', color: Model.MapObjectCommand.COLOR_ORANGE }}>{'['}</div>;
			default:
				return this.value.toString();
		}
	}

	toString(): string | ReactNode {
		return this.isClosure ? (
			<Flex spaced>
				{'>'}
				<div style={{ fontWeight: 'bold', color: Model.MapObjectCommand.COLOR_ORANGE }}>
					{this.isList ? ']' : '}'}
				</div>
			</Flex>
		) : this.canHaveChildren() ? (
			<Flex spaced>
				{'>'}
				{this.isProperty && (
					<div style={{ fontWeight: 'bold', color: Model.MapObjectCommand.COLOR_GREEN }}>
						{`"${this.name}":`}
					</div>
				)}
				<div style={{ fontWeight: 'bold', color: Model.MapObjectCommand.COLOR_ORANGE }}>
					{this.isList || this.value?.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST ? '[' : '{'}
				</div>
			</Flex>
		) : (
			<Flex spaced>
				{'>'}
				{this.isProperty ? (
					<>
						<div style={{ fontWeight: 'bold', color: Model.MapObjectCommand.COLOR_GREEN }}>
							{`"${this.name}":`}
						</div>
						{this.toStringValue()}
					</>
				) : (
					<div>{this.toStringValue()}</div>
				)}
			</Flex>
		);
	}

	copy(customStructure: CustomStructure): void {
		super.copy(customStructure, CustomStructure.getBindings([]));
		if (customStructure.elements) {
			this.elements = customStructure.elements.map((element) => element.clone());
			this.isList = customStructure.isList;
		} else {
			this.isProperty = customStructure.isProperty;
			this.description = customStructure.description;
			this.value = customStructure.value.clone();
		}
		this.isElement = customStructure.isElement;
		this.isClosure = customStructure.isClosure;
		if (this.isClosure) {
			this.isList = customStructure.isList;
		}
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CustomStructure.getBindings(additionnalBinding));
		this.id = 0;
		if (this.isElement) {
			this.isProperty = Utils.defaultValue(json.isProperty as boolean, true);
			this.description = Utils.defaultValue(json.description as string, '');
			if (json.value) {
				this.value = new DynamicValue();
				this.value.read(json.value as JSONType);
			} else {
				this.value = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			}
		} else {
			this.isList = Utils.defaultValue(json.isList as boolean, false);
			this.elements = ((this.isList ? (json.list as JSONType[]) : (json.properties as JSONType[])) ?? []).map(
				(jsonElement) => {
					const element = new CustomStructure();
					element.isElement = true;
					element.read(jsonElement);
					return element;
				},
			);
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		const id = this.id;
		this.id = 0;
		super.write(json, CustomStructure.getBindings(additionnalBinding));
		this.id = id;
		if (this.elements) {
			const tab = this.elements.map((element) => {
				const obj = {};
				element.write(obj);
				return obj;
			}) as JSONType[];
			if (this.isList && tab.length > 0) {
				json.list = tab;
			} else {
				json.properties = tab;
			}
			if (this.isList) {
				json.isList = true;
			}
		} else {
			if (!this.isProperty) {
				json.isProperty = false;
			}
			if (this.description) {
				json.description = this.description;
			}
			if (this.value.kind !== DYNAMIC_VALUE_KIND.NUMBER_DECIMAL || this.value.value !== 0) {
				const obj = {};
				this.value.write(obj);
				json.value = obj;
			}
		}
	}
}

export { CustomStructure };
