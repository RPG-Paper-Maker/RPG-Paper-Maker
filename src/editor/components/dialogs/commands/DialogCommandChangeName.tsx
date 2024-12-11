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
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import PanelSelectionHero, { PanelSelectionHeroRef } from '../../panels/PanelSelectionHero';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandChangeName({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>();

	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [name] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			name.updateCommand(list, iterator);
			panelSelectionHeroRef.current?.initialize(list, iterator);
			setSelectionOperationType(list[iterator.i++] as OPERATION_KIND);
		} else {
			name.updateToDefaultText();
			panelSelectionHeroRef.current?.initialize();
			setSelectionOperationType(OPERATION_KIND.EQUAL_TO);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		name.getCommand(newList);
		panelSelectionHeroRef.current?.getCommand(newList);
		newList.push(selectionOperationType);
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.CHANGE_NAME, newList));
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
			title={`${t('change.name')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<PanelSelectionHero ref={panelSelectionHeroRef} />
				<Groupbox title={t('value')}>
					<Flex spaced centerV>
						<div>{t('name')}:</div>
						<DynamicValueSelector value={name} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT} />
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeName;
