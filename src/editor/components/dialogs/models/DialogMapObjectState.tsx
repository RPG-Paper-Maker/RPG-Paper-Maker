/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import { showWarning } from '../../../store';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectState({ setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const state = model as Model.MapObjectState;

	const { t } = useTranslation();

	const [stateID, setStateID] = useStateNumber();

	const dispatch = useDispatch();

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
			dispatch(
				showWarning(
					`${t('cannot.duplicate.state')} ${Model.Base.getByID(
						Project.current!.commonEvents.states,
						stateID,
					)?.toStringNameID()}`,
				),
			);
		}
	};

	const handleReject = () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('select.a.state')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
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
	);
}

export default DialogMapObjectState;
