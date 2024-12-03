/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, ITERATOR, Utils } from '../../common';
import useStateBool from '../../hooks/useStateBool';
import useStateDynamicValue from '../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../models';
import Checkbox from '../Checkbox';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';

export interface PanelWaitTimeRef {
	initialize: (list?: MapObjectCommandType[], iterator?: ITERATOR) => void;
	getCommand: (newList: MapObjectCommandType[]) => void;
}

type Props = {
	defaultSeconds?: number;
};

const PanelWaitTime = forwardRef(({ defaultSeconds = 0 }: Props, ref) => {
	const { t } = useTranslation();

	const [isWaitingEndCommand, setIsWaitingEndCommand] = useStateBool();
	const [time] = useStateDynamicValue();

	const initialize = (list?: MapObjectCommandType[], iterator?: ITERATOR) => {
		if (list && iterator) {
			setIsWaitingEndCommand(Utils.initializeBoolCommand(list, iterator));
			time.updateCommand(list, iterator);
		} else {
			setIsWaitingEndCommand(true);
			time.updateToDefaultNumber(defaultSeconds, true);
		}
	};

	const getCommand = (newList: MapObjectCommandType[]) => {
		newList.push(Utils.boolToNum(isWaitingEndCommand));
		time.getCommand(newList);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		getCommand,
	}));

	return (
		<Flex column spacedLarge>
			<Checkbox isChecked={isWaitingEndCommand} onChange={setIsWaitingEndCommand}>
				{t('wait.end.change.before.next.command')}
			</Checkbox>
			<Flex>
				<Flex one />
				<Flex spaced centerV>
					<div>{t('time')}:</div>
					<DynamicValueSelector value={time} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
					<div>{t('seconds')}</div>
				</Flex>
			</Flex>
		</Flex>
	);
});

export default PanelWaitTime;
