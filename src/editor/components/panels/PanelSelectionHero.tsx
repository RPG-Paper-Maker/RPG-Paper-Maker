/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, ITERATOR } from '../../common';
import useStateDynamicValue from '../../hooks/useStateDynamicValue';
import useStateNumber from '../../hooks/useStateNumber';
import { Base, MapObjectCommandType, TroopMonster } from '../../models';
import Dropdown from '../Dropdown';
import DynamicValueSelector from '../DynamicValueSelector';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import RadioButton from '../RadioButton';
import RadioGroup from '../RadioGroup';

export enum SELECTION_HERO_TYPE {
	INSTANCE_ID,
	ENTIRE,
}

export enum ENEMY_SELECTION_HERO_TYPE {
	ENEMY,
	INSTANCE_ID,
}

export interface PanelSelectionHeroRef {
	initialize: (list?: MapObjectCommandType[], iterator?: ITERATOR) => void;
	getCommand: (newList: MapObjectCommandType[]) => void;
}

type Props = {
	isEnemy?: boolean;
};

const PanelSelectionHero = forwardRef(({ isEnemy = false }: Props, ref) => {
	const { t } = useTranslation();

	const [selectionType, setSelectionType] = useStateNumber();
	const [selectedEnemy, setSelectedEnemy] = useStateNumber();
	const [instanceID] = useStateDynamicValue();
	const [selectionTeam, setSelectionTeam] = useStateNumber();

	const initialize = (list?: MapObjectCommandType[], iterator?: ITERATOR) => {
		instanceID.updateToDefaultVariable();
		let st = 0;
		if (list && iterator) {
			const selection = list[iterator.i++] as number;
			setSelectionType(selection);
			if (isEnemy) {
				switch (selection) {
					case ENEMY_SELECTION_HERO_TYPE.ENEMY:
						setSelectedEnemy(TroopMonster.currentMonsters[list[iterator.i++] as number]?.id ?? -1);
						break;
					case ENEMY_SELECTION_HERO_TYPE.INSTANCE_ID:
						instanceID.updateCommand(list, iterator);
						break;
				}
			} else {
				switch (selection) {
					case SELECTION_HERO_TYPE.INSTANCE_ID:
						instanceID.updateCommand(list, iterator);
						break;
					case SELECTION_HERO_TYPE.ENTIRE:
						st = list[iterator.i++] as number;
						break;
				}
			}
		} else {
			setSelectionType(
				isEnemy
					? TroopMonster.currentMonsters.length > 0
						? ENEMY_SELECTION_HERO_TYPE.ENEMY
						: ENEMY_SELECTION_HERO_TYPE.INSTANCE_ID
					: SELECTION_HERO_TYPE.INSTANCE_ID,
			);
			setSelectedEnemy(TroopMonster.currentMonsters[0]?.id ?? -1);
		}
		setSelectionTeam(st);
	};

	const getCommand = (newList: MapObjectCommandType[]) => {
		newList.push(selectionType);
		if (isEnemy) {
			switch (selectionType) {
				case ENEMY_SELECTION_HERO_TYPE.ENEMY:
					newList.push(TroopMonster.currentMonsters.findIndex((monster) => monster.id === selectedEnemy));
					break;
				case ENEMY_SELECTION_HERO_TYPE.INSTANCE_ID:
					instanceID.getCommand(newList);
					break;
			}
		} else {
			switch (selectionType) {
				case SELECTION_HERO_TYPE.INSTANCE_ID:
					instanceID.getCommand(newList);
					break;
				case SELECTION_HERO_TYPE.ENTIRE:
					newList.push(selectionTeam);
					break;
			}
		}
	};

	useImperativeHandle(ref, () => ({
		initialize,
		getCommand,
	}));

	return (
		<Groupbox title={t('selection')}>
			<RadioGroup selected={selectionType} onChange={setSelectionType}>
				<Form>
					{isEnemy && TroopMonster.currentMonsters.length > 0 && (
						<>
							<Label>
								<RadioButton value={ENEMY_SELECTION_HERO_TYPE.ENEMY}>{t('enemy')}</RadioButton>
							</Label>
							<Value>
								<Dropdown
									selectedID={selectedEnemy}
									onChange={setSelectedEnemy}
									options={TroopMonster.currentMonsters}
									disabled={selectionType !== ENEMY_SELECTION_HERO_TYPE.ENEMY}
									displayIDs
								/>
							</Value>
						</>
					)}
					<Label>
						<RadioButton
							value={isEnemy ? ENEMY_SELECTION_HERO_TYPE.INSTANCE_ID : SELECTION_HERO_TYPE.INSTANCE_ID}
						>
							{t('hero.enemy.instance.id')}:
						</RadioButton>
					</Label>
					<Value>
						<DynamicValueSelector
							value={instanceID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={
								isEnemy
									? selectionType !== ENEMY_SELECTION_HERO_TYPE.INSTANCE_ID
									: selectionType !== SELECTION_HERO_TYPE.INSTANCE_ID
							}
						/>
					</Value>
					{!isEnemy && (
						<>
							<Label>
								<RadioButton value={SELECTION_HERO_TYPE.ENTIRE}>{t('the.entire')}</RadioButton>
							</Label>
							<Value>
								<Dropdown
									selectedID={selectionTeam}
									onChange={setSelectionTeam}
									options={Base.TEAM_OPTIONS}
									translateOptions
									disabled={selectionType !== SELECTION_HERO_TYPE.ENTIRE}
								/>
							</Value>
						</>
					)}
				</Form>
			</RadioGroup>
		</Groupbox>
	);
});

PanelSelectionHero.displayName = 'PanelSelectionHero';

export default PanelSelectionHero;
