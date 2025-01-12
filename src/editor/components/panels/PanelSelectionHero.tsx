/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, ITERATOR } from '../../common';
import { Model } from '../../Editor';
import useStateDynamicValue from '../../hooks/useStateDynamicValue';
import useStateNumber from '../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../models';
import Dropdown from '../Dropdown';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import RadioButton from '../RadioButton';
import RadioGroup from '../RadioGroup';

export enum SELECTION_HERO_TYPE {
	INSTANCE_ID,
	ENTIRE,
}

export interface PanelSelectionHeroRef {
	initialize: (list?: MapObjectCommandType[], iterator?: ITERATOR) => void;
	getCommand: (newList: MapObjectCommandType[]) => void;
}

const PanelSelectionHero = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [selectionType, setSelectionType] = useStateNumber();
	const [instanceID] = useStateDynamicValue();
	const [selectionTeam, setSelectionTeam] = useStateNumber();

	const isInstanceID = selectionType === SELECTION_HERO_TYPE.INSTANCE_ID;

	const initialize = (list?: MapObjectCommandType[], iterator?: ITERATOR) => {
		instanceID.updateToDefaultVariable();
		let st = 0;
		if (list && iterator) {
			const selection = list[iterator.i++] as SELECTION_HERO_TYPE;
			setSelectionType(selection);
			switch (selection) {
				case SELECTION_HERO_TYPE.INSTANCE_ID:
					instanceID.updateCommand(list, iterator);
					break;
				case SELECTION_HERO_TYPE.ENTIRE:
					st = list[iterator.i++] as number;
					break;
			}
		} else {
			setSelectionType(SELECTION_HERO_TYPE.INSTANCE_ID);
		}
		setSelectionTeam(st);
	};

	const getCommand = (newList: MapObjectCommandType[]) => {
		newList.push(selectionType);
		switch (selectionType) {
			case SELECTION_HERO_TYPE.INSTANCE_ID:
				instanceID.getCommand(newList);
				break;
			case SELECTION_HERO_TYPE.ENTIRE:
				newList.push(selectionTeam);
				break;
		}
	};

	useImperativeHandle(ref, () => ({
		initialize,
		getCommand,
	}));

	return (
		<Groupbox title={t('selection')}>
			<RadioGroup selected={selectionType} onChange={setSelectionType}>
				<Flex column spacedLarge>
					<Flex spaced centerV>
						<RadioButton value={SELECTION_HERO_TYPE.INSTANCE_ID}>
							{t('hero.enemy.instance.id')}:
						</RadioButton>
						<DynamicValueSelector
							value={instanceID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={!isInstanceID}
						/>
					</Flex>
					<Flex spaced centerV>
						<RadioButton value={SELECTION_HERO_TYPE.ENTIRE}>{t('the.entire')}</RadioButton>
						<Dropdown
							selectedID={selectionTeam}
							onChange={setSelectionTeam}
							options={Model.Base.TEAM_OPTIONS}
							translateOptions
							disabled={isInstanceID}
						/>
					</Flex>
				</Flex>
			</RadioGroup>
		</Groupbox>
	);
});

export default PanelSelectionHero;
