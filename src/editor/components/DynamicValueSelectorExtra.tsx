/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE } from '../common';
import { Node } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import useStateBool from '../hooks/useStateBool';
import { CustomStructure } from '../models';
import Checkbox from './Checkbox';
import DynamicValueSelector from './DynamicValueSelector';
import Flex from './Flex';
import Form, { Label, Value } from './Form';
import InputNumber from './InputNumber';
import TreeCustomStructure from './TreeCustomStructure';

type Props = {
	value: DynamicValue;
	kind: DYNAMIC_VALUE_KIND;
	min?: number;
	setMin?: (m?: number) => void;
	max?: number;
	setMax?: (m?: number) => void;
	canEditMinMax?: boolean;
	noStructure?: boolean;
};

function DynamicValueSelectorExtra({
	value,
	kind,
	min,
	setMin,
	max,
	setMax,
	canEditMinMax = false,
	noStructure = false,
}: Props) {
	const [nodes, setNodes] = useState<Node[]>([]);
	const [, setTrigger] = useStateBool();

	const handleChangeIsMin = (b: boolean) => {
		setMin?.(b ? 0 : undefined);
		value.min = b ? 0 : null;
	};

	const handleChangeMin = (m: number) => {
		setMin?.(m);
		value.min = m;
	};

	const handleChangeIsMax = (b: boolean) => {
		setMax?.(b ? 0 : undefined);
		value.max = b ? 0 : null;
	};

	const handleChangeMax = (m: number) => {
		setMax?.(m);
		value.max = m;
	};

	const handleStructureUpdated = () => {
		switch (kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				value.customStructure = CustomStructure.fromNode(nodes[0]);
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				value.customList = CustomStructure.fromNode(nodes[0]);
				break;
		}
	};

	useEffect(() => {
		switch (kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
				if (!value.customStructure) {
					value.customStructure = new CustomStructure();
					value.customStructure.applyDefault();
					value.customStructure.isElement = false;
					value.customStructure.isList = false;
					value.customStructure.elements = [];
				}
				setNodes(value.customStructure.toNodes());
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				if (!value.customList) {
					value.customList = new CustomStructure();
					value.customList.applyDefault();
					value.customList.isElement = false;
					value.customList.isList = true;
					value.customList.elements = [];
				}
				setNodes(value.customList.toNodes());
				break;
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				setMin?.(value.min ?? undefined);
				setMax?.(value.max ?? undefined);
				break;
			case DYNAMIC_VALUE_KIND.VECTOR2:
			case DYNAMIC_VALUE_KIND.VECTOR3:
				if (!value.x) {
					value.x = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0);
					value.y = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0);
				}
				if (kind === DYNAMIC_VALUE_KIND.VECTOR3 && !value.z) {
					value.x = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0);
					value.y = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0);
					value.z = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0);
				}
				setTrigger((v) => !v);
				break;
		}
	}, [kind, setMin, setMax, value, setTrigger]);

	const getContent = () => {
		switch (kind) {
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
				return noStructure ? null : <TreeCustomStructure list={nodes} onListUpdated={handleStructureUpdated} />;
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				return canEditMinMax ? (
					<Flex column>
						<Flex spacedLarge centerV>
							<Flex spaced centerV>
								<Checkbox isChecked={min !== undefined} onChange={handleChangeIsMin}>
									Min:
								</Checkbox>
								<InputNumber
									value={min ?? 0}
									onChange={handleChangeMin}
									disabled={min === undefined}
									max={max}
								/>
							</Flex>
							<Flex spaced centerV>
								<Checkbox isChecked={max !== undefined} onChange={handleChangeIsMax}>
									Max:
								</Checkbox>
								<InputNumber
									value={max ?? 0}
									onChange={handleChangeMax}
									disabled={max === undefined}
									min={min}
								/>
							</Flex>
						</Flex>
						<Flex one />
					</Flex>
				) : null;
			case DYNAMIC_VALUE_KIND.VECTOR2:
			case DYNAMIC_VALUE_KIND.VECTOR3:
				return (
					<Flex column>
						<Form>
							<Label>X</Label>
							<Value>
								{value.x && (
									<DynamicValueSelector
										value={value.x}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									/>
								)}
							</Value>
							<Label>Y</Label>
							<Value>
								{value.y && (
									<DynamicValueSelector
										value={value.y}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									/>
								)}
							</Value>
							{kind === DYNAMIC_VALUE_KIND.VECTOR3 && (
								<>
									<Label>Z</Label>
									<Value>
										{value.z && (
											<DynamicValueSelector
												value={value.z}
												optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
											/>
										)}
									</Value>
								</>
							)}
						</Form>
						<Flex one />
					</Flex>
				);
		}
		return null;
	};

	return getContent();
}

export default DynamicValueSelectorExtra;
