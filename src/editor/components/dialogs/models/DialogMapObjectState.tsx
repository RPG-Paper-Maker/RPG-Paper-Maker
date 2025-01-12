/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import FooterOK from '../footers/FooterOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectState({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isOpenWarning, setIsOpenWarning] = useState(false);
	const [stateID, setStateID] = useStateNumber();

	const state = model as Model.MapObjectState;

	const initialize = () => {
		if (isNew) {
			state.id = 1;
		}
		setStateID(state.id);
	};

	const handleAccept = () => {
		if (
			(!isNew && state.id === stateID) ||
			Project.current!.currentMapObjectStates.every((node) => node.content.id !== stateID)
		) {
			state.id = stateID;
			onAccept();
			setIsOpen(false);
		} else {
			setIsOpenWarning(true);
		}
	};

	const handleReject = () => {
		onReject?.();
		setIsOpen(false);
	};

	const handleCloseWarning = () => {
		setIsOpenWarning(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<>
			<Dialog
				title={`${t('select.a.state')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<Flex spacedLarge>
					{t('state.id')}:
					<Dropdown
						selectedID={stateID}
						onChange={setStateID}
						options={Project.current!.commonEvents.states}
						displayIDs
					/>
				</Flex>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isOpenWarning}
				footer={<FooterOK onOK={handleCloseWarning} />}
				onClose={handleCloseWarning}
			>
				<p>{`${t('cannot.duplicate.state')} ${Model.Base.getByID(
					Project.current!.commonEvents.states,
					stateID
				)?.toStringNameID()}`}</p>
			</Dialog>
		</>
	);
}

export default DialogMapObjectState;
