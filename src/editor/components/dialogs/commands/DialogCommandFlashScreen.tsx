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
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import PanelWaitTime, { PanelWaitTimeRef } from '../../panels/PanelWaitTime';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandFlashScreen({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelWaitTimeRef = useRef<PanelWaitTimeRef>(null);

	const [colorID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		colorID.updateToDefaultDatabase();
		if (list) {
			const iterator = Utils.generateIterator();
			colorID.updateCommand(list, iterator);
			panelWaitTimeRef.current?.initialize(list, iterator);
		} else {
			panelWaitTimeRef.current?.initialize();
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		colorID.getCommand(newList);
		panelWaitTimeRef.current?.getCommand(newList);
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
			title={`${t('flash.screen')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<Flex spaced>
					<div>{t('color.id')}:</div>
					<DynamicValueSelector
						value={colorID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.systems.colors}
					/>
				</Flex>
				<PanelWaitTime ref={panelWaitTimeRef} defaultSeconds={1} />
			</Flex>
		</Dialog>
	);
}

export default DialogCommandFlashScreen;
