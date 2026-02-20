/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, OPERATION_KIND, Utils } from '../../../common';
import { Project } from '../../../core/Project';
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
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_OPERATION_TYPE {
	ADD,
	REMOVE,
}

function DialogCommandChangeStatus({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>(null);

	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [statusID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			panelSelectionHeroRef.current?.initialize(list, iterator);
			setSelectionOperationType(list[iterator.i++] as OPERATION_KIND);
			statusID.updateCommand(list, iterator);
		} else {
			panelSelectionHeroRef.current?.initialize();
			setSelectionOperationType(OPERATION_KIND.EQUAL_TO);
			statusID.updateToDefaultDatabase();
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		panelSelectionHeroRef.current?.getCommand(newList);
		newList.push(selectionOperationType);
		statusID.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('change.status')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<PanelSelectionHero ref={panelSelectionHeroRef} />
				<Groupbox title={t('operation')}>
					<RadioGroup selected={selectionOperationType} onChange={setSelectionOperationType}>
						<Flex spaced>
							<RadioButton value={SELECTION_OPERATION_TYPE.ADD}>{t('add')}</RadioButton>
							<RadioButton value={SELECTION_OPERATION_TYPE.REMOVE}>{t('remove')}</RadioButton>
						</Flex>
					</RadioGroup>
				</Groupbox>
				<Groupbox title={t('status')}>
					<Flex spaced centerV>
						<div>{t('status.id')}:</div>
						<DynamicValueSelector
							value={statusID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.status.list}
						/>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeStatus;
