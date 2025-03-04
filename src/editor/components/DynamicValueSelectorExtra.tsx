/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { DYNAMIC_VALUE_KIND } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import Checkbox from './Checkbox';
import Flex from './Flex';
import InputNumber from './InputNumber';

type Props = {
	value: DynamicValue;
	kind: DYNAMIC_VALUE_KIND;
	canEditMinMax?: boolean;
};

function DynamicValueSelectorExtra({ value, kind, canEditMinMax = false }: Props) {
	const [previousKind, setPreviousKind] = useState(kind);
	const [isMin, setIsMin] = useState(value.min !== null);
	const [min, setMin] = useState(value.min ?? 0);
	const [isMax, setIsMax] = useState(value.max !== null);
	const [max, setMax] = useState(value.max ?? 0);

	const handleChangeIsMin = (b: boolean) => {
		setIsMin(b);
		value.min = b ? min : null;
	};

	const handleChangeMin = (m: number) => {
		setMin(m);
		value.min = m;
	};

	const handleChangeIsMax = (b: boolean) => {
		setIsMax(b);
		value.max = b ? max : null;
	};

	const handleChangeMax = (m: number) => {
		setMax(m);
		value.max = m;
	};

	useEffect(() => {
		switch (previousKind) {
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				value.min = null;
				value.max = null;
				break;
		}
		setPreviousKind(kind);
		switch (kind) {
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				value.min = isMin ? min : null;
				value.max = isMax ? max : null;
				break;
		}
	}, [kind]);

	const getContent = () => {
		switch (kind) {
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				return (
					<Flex spacedLarge centerV>
						<Flex spaced centerV>
							<Checkbox isChecked={isMin} onChange={handleChangeIsMin}>
								Min:
							</Checkbox>
							<InputNumber value={min} onChange={handleChangeMin} disabled={!isMin} />
						</Flex>
						<Flex spaced centerV>
							<Checkbox isChecked={isMax} onChange={handleChangeIsMax}>
								Max:
							</Checkbox>
							<InputNumber value={max} onChange={handleChangeMax} disabled={!isMax} />
						</Flex>
					</Flex>
				);
		}
		return null;
	};

	return (
		<Flex column>
			{getContent()}
			<Flex one />
		</Flex>
	);
}

export default DynamicValueSelectorExtra;
