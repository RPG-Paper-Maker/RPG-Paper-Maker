/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, OPERATION_KIND, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import PanelSelectionHero, { PanelSelectionHeroRef } from '../../panels/PanelSelectionHero';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_OPERATION_TYPE {
	LEARN,
	FORGET,
}

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandChangeASkill({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>();

	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [skillID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			skillID.updateCommand(list, iterator);
			panelSelectionHeroRef.current?.initialize(list, iterator);
			setSelectionOperationType(list[iterator.i++] as OPERATION_KIND);
		} else {
			skillID.updateToDefaultDatabase();
			panelSelectionHeroRef.current?.initialize();
			setSelectionOperationType(OPERATION_KIND.EQUAL_TO);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		skillID.getCommand(newList);
		panelSelectionHeroRef.current?.getCommand(newList);
		newList.push(selectionOperationType);
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.CHANGE_A_SKILL, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('change.a.skill')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<PanelSelectionHero ref={panelSelectionHeroRef} />
				<Groupbox title={t('operation')}>
					<RadioGroup selected={selectionOperationType} onChange={setSelectionOperationType}>
						<Flex spaced>
							<RadioButton value={SELECTION_OPERATION_TYPE.LEARN}>{t('learn')}</RadioButton>
							<RadioButton value={SELECTION_OPERATION_TYPE.FORGET}>{t('forget')}</RadioButton>
						</Flex>
					</RadioGroup>
				</Groupbox>
				<Groupbox title={t('skill')}>
					<Flex spaced centerV>
						<div>{t('skill.id')}:</div>
						<DynamicValueSelector
							value={skillID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.skills.list}
						/>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeASkill;
