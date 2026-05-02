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

	const usedStateIDs = Project.current!.currentMapObjectStates
		.filter((node) => !isNew || node.content.id !== state.id)
		.map((node) => node.content.id);

	const initialize = () => {
		if (isNew) {
			const firstAvailable = Project.current!.commonEvents.states.find(
				(s) => !usedStateIDs.includes(s.id),
			);
			state.id = firstAvailable?.id ?? Project.current!.commonEvents.states[0]?.id ?? 1;
		}
		setStateID(state.id);
	};

	const handleAccept = () => {
		if (
			(!isNew && state.id === stateID) ||
			Project.current!.currentMapObjectStates.every((node) => node.content.id !== stateID)
		) {
			const oldID = state.id;
			state.id = stateID;
			if (!isNew && oldID !== stateID) {
				for (const node of Project.current!.currentMapObjectEvents) {
					const event = node.content as Model.MapObjectEvent;
					const reaction = event.reactions?.get('' + oldID);
					if (reaction) {
						event.reactions.delete('' + oldID);
						event.reactions.set('' + stateID, reaction);
					}
				}
			}
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
					disabledIds={usedStateIDs}
					displayIDs
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogMapObjectState;
