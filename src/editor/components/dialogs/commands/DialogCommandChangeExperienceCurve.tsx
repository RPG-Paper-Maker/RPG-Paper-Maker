/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, OPERATION_KIND, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import PanelOperation from '../../panels/PanelOperation';
import PanelSelectionHero, { PanelSelectionHeroRef } from '../../panels/PanelSelectionHero';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandChangeExperienceCurve({
	commandKind,
	isOpen,
	setIsOpen,
	list,
	onAccept,
	onReject,
}: CommandProps) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>(null);

	const [levelFrom] = useStateDynamicValue();
	const [levelTo] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [totalExperience] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			panelSelectionHeroRef.current?.initialize(list, iterator);
			levelFrom.updateCommand(list, iterator);
			levelTo.updateCommand(list, iterator);
			setSelectionOperationType(list[iterator.i++] as OPERATION_KIND);
			totalExperience.updateCommand(list, iterator);
		} else {
			panelSelectionHeroRef.current?.initialize();
			levelFrom.updateToDefaultNumber(0);
			levelTo.updateToDefaultNumber(2);
			setSelectionOperationType(OPERATION_KIND.EQUAL_TO);
			totalExperience.updateToDefaultNumber(0);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		panelSelectionHeroRef.current?.getCommand(newList);
		levelFrom.getCommand(newList);
		levelTo.getCommand(newList);
		newList.push(selectionOperationType);
		totalExperience.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
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
			title={`${t('change.experience.curve')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<PanelSelectionHero ref={panelSelectionHeroRef} />
				<Groupbox title={t('level')}>
					<Flex spaced centerV>
						<div>{t('range')}:</div>
						<DynamicValueSelector value={levelFrom} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
						{t('to').toLowerCase()}
						<DynamicValueSelector value={levelTo} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					</Flex>
				</Groupbox>
				<PanelOperation selectionType={selectionOperationType} setSelectionType={setSelectionOperationType} />
				<Flex spaced centerV>
					<div>{t('total.experience')}:</div>
					<DynamicValueSelector value={totalExperience} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeExperienceCurve;
