/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectEvent } from '../../../models';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form from '../../Form';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import Tree from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectEvent({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const event = model as Model.MapObjectEvent;

	const { t } = useTranslation();

	const [eventSystemID, setEventSystemID] = useStateNumber();
	const [eventUserID, setEventUserID] = useStateNumber();
	const [isSystem, setIsSystem] = useStateBool();
	const [isUser, setIsUser] = useStateBool();
	const [parameters, setParameters] = useState<Node[]>([]);

	const initialize = () => {
		if (isNew) {
			setIsSystem(true);
			setIsUser(false);
			const systemID = Project.current!.commonEvents.eventsSystem[0].id;
			setEventSystemID(systemID);
			setEventUserID(Project.current!.commonEvents.eventsUser[0].id);
			updateParameters(systemID, true);
		} else {
			setIsSystem(event.isSystem);
			setIsUser(!event.isSystem);
			if (event.isSystem) {
				setEventSystemID(event.id);
				setEventUserID(Project.current!.commonEvents.eventsUser[0].id);
			} else {
				setEventUserID(event.id);
				setEventSystemID(Project.current!.commonEvents.eventsSystem[0].id);
			}
			setParameters(Node.createList(event.parameters));
		}
	};

	const radiosSetters = [setIsSystem, setIsUser];

	const updateParameters = (eventID: number, isSys: boolean) => {
		setParameters(
			Node.createList(MapObjectEvent.getDefaultParameters(eventID, isSys, Node.createListFromNodes(parameters)))
		);
	};

	const handleChangeIsSystem = (b: boolean) => {
		updateParameters(b ? eventSystemID : eventUserID, b);
	};

	const handleChangeIsUser = (b: boolean) => {
		updateParameters(b ? eventUserID : eventSystemID, !b);
	};

	const handleChangeEventUserID = (id: number) => {
		setEventUserID(id);
		updateParameters(id, false);
	};

	const handleChangeEventSystemID = (id: number) => {
		setEventUserID(id);
		updateParameters(id, true);
	};

	const handleAccept = () => {
		event.id = isSystem ? eventSystemID : eventUserID;
		event.isSystem = isSystem;
		event.parameters = Node.createListFromNodes(parameters);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = () => {
		onReject?.();
		setIsOpen(false);
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
				title={`${t('set.event')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<Flex column spacedLarge>
					<Form>
						<td>
							<RadioButton
								isChecked={isSystem}
								onChange={setIsSystem}
								additionalChange={handleChangeIsSystem}
								allOnChanges={radiosSetters}
							>
								{t('event.system')}:
							</RadioButton>
						</td>
						<td>
							<Dropdown
								selectedID={eventSystemID}
								onChange={handleChangeEventSystemID}
								options={Project.current!.commonEvents.eventsSystem}
								disabled={!isSystem}
								displayIDs
							/>
						</td>
						<td>
							<RadioButton
								isChecked={isUser}
								onChange={setIsUser}
								additionalChange={handleChangeIsUser}
								allOnChanges={radiosSetters}
							>
								{t('event.user')}:
							</RadioButton>
						</td>
						<td>
							<Dropdown
								selectedID={eventUserID}
								onChange={handleChangeEventUserID}
								options={Project.current!.commonEvents.eventsUser}
								disabled={!isUser}
								displayIDs
							/>
						</td>
					</Form>
					{parameters.length > 0 && (
						<Groupbox title={t('parameter.values')}>
							<Tree
								constructorType={Model.MapObjectParameter}
								list={parameters}
								cannotAdd
								cannotDragDrop
							/>
						</Groupbox>
					)}
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogMapObjectEvent;
