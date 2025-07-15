/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogTroopMonster({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const troopMonster = model as Model.TroopMonster;

	const { t } = useTranslation();

	const [monsterID, setMonsterID] = useStateNumber();
	const [level] = useStateDynamicValue();
	const [hidden] = useStateDynamicValue();
	const [isSpecificPosition, setIsSpecificPosition] = useStateBool();
	const [specificPosition] = useStateDynamicValue();

	const initialize = () => {
		setMonsterID(troopMonster.monsterID);
		level.copy(troopMonster.level);
		hidden.copy(troopMonster.hidden);
		setIsSpecificPosition(troopMonster.isSpecificPosition);
		specificPosition.copy(troopMonster.specificPosition);
	};

	const handleAccept = async () => {
		troopMonster.monsterID = monsterID;
		troopMonster.level.copy(level);
		troopMonster.hidden.copy(hidden);
		troopMonster.isSpecificPosition = isSpecificPosition;
		troopMonster.specificPosition.copy(specificPosition);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.monster.troop')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Form>
					<Label>{t('monster.id')}</Label>
					<Value>
						<Dropdown
							selectedID={monsterID}
							onChange={setMonsterID}
							options={Project.current!.monsters.list}
							displayIDs
						/>
					</Value>
					<Label>{t('level')}</Label>
					<Value>
						<DynamicValueSelector value={level} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					</Value>
					<Label>{t('hidden')}</Label>
					<Value>
						<DynamicValueSelector value={hidden} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH} />
					</Value>
				</Form>
				<Flex spaced>
					<Checkbox isChecked={isSpecificPosition} onChange={setIsSpecificPosition}>
						{t('specific.position.according.center')}
					</Checkbox>
					<DynamicValueSelector
						value={specificPosition}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
						disabled={!isSpecificPosition}
					/>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogTroopMonster;
