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
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import PanelSelectionHero, { PanelSelectionHeroRef } from '../../panels/PanelSelectionHero';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandChangeClass({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>(null);

	const [classID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			classID.updateCommand(list, iterator);
			panelSelectionHeroRef.current?.initialize(list, iterator);
		} else {
			classID.updateToDefaultDatabase();
			panelSelectionHeroRef.current?.initialize();
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		classID.getCommand(newList);
		panelSelectionHeroRef.current?.getCommand(newList);
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
			title={`${t('change.class')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<PanelSelectionHero ref={panelSelectionHeroRef} />
				<Groupbox title={t('value')}>
					<Flex spaced centerV>
						<div>{t('class.id')}:</div>
						<DynamicValueSelector
							value={classID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.classes.list}
						/>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeClass;
