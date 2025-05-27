/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ITERATOR } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import useStateNumber from '../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../models';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import RadioButton from '../RadioButton';
import RadioGroup from '../RadioGroup';
import Tree from '../Tree';

export interface PanelObjectEventRef {
	initialize: (list?: MapObjectCommandType[], iterator?: ITERATOR) => void;
	accept: (newList?: MapObjectCommandType[]) => void;
}

enum SELECTION_TYPE {
	SYSTEM,
	USER,
}

type Props = {
	event: Model.MapObjectEvent;
	isNew: boolean;
};

const PanelObjectEvent = forwardRef(({ event, isNew }: Props, ref) => {
	const { t } = useTranslation();

	const [eventSystemID, setEventSystemID] = useStateNumber();
	const [eventUserID, setEventUserID] = useStateNumber();
	const [parameters, setParameters] = useState<Node[]>([]);
	const [selectionType, setSelectionType] = useStateNumber();

	const initialize = (list?: MapObjectCommandType[], iterator?: ITERATOR) => {
		if (isNew) {
			setSelectionType(SELECTION_TYPE.SYSTEM);
			const systemID = Project.current!.commonEvents.eventsSystem[0].id;
			setEventSystemID(systemID);
			setEventUserID(Project.current!.commonEvents.eventsUser[0].id);
			updateParameters(systemID, true);
		} else {
			if (list && iterator) {
				event.initialize(list, iterator);
			}
			setSelectionType(event.isSystem ? SELECTION_TYPE.SYSTEM : SELECTION_TYPE.USER);
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

	const updateParameters = (eventID: number, isSys: boolean) => {
		setParameters(
			Node.createList(
				Model.MapObjectEvent.getDefaultParameters(eventID, isSys, Node.createListFromNodes(parameters)),
				false
			)
		);
	};

	const handleChangeEventUserID = (id: number) => {
		setEventUserID(id);
		updateParameters(id, false);
	};

	const handleChangeEventSystemID = (id: number) => {
		setEventSystemID(id);
		updateParameters(id, true);
	};

	const handleChangeSelection = (selection: number) => {
		setSelectionType(selection);
		if (selection === 0) {
			handleChangeEventSystemID(eventSystemID);
		} else {
			handleChangeEventUserID(eventUserID);
		}
	};

	const accept = (newList?: MapObjectCommandType[]) => {
		event.id = selectionType === SELECTION_TYPE.SYSTEM ? eventSystemID : eventUserID;
		event.isSystem = selectionType === SELECTION_TYPE.SYSTEM;
		event.parameters = Node.createListFromNodes(parameters);
		if (newList) {
			newList.push(event.isSystem ? 0 : 1);
			newList.push(event.id);
			for (const parameter of event.parameters) {
				newList.push(parameter.id);
				parameter.value.getCommand(newList);
			}
		}
	};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	return (
		<Flex column spacedLarge>
			<RadioGroup selected={selectionType} onChange={handleChangeSelection}>
				<Form>
					<Label>
						<RadioButton value={SELECTION_TYPE.SYSTEM}>{t('event.system')}</RadioButton>
					</Label>
					<Value>
						<Dropdown
							selectedID={eventSystemID}
							onChange={handleChangeEventSystemID}
							options={Project.current!.commonEvents.eventsSystem}
							disabled={selectionType !== SELECTION_TYPE.SYSTEM}
							displayIDs
						/>
					</Value>
					<Label>
						<RadioButton value={SELECTION_TYPE.USER}>{t('event.user')}</RadioButton>
					</Label>
					<Value>
						<Dropdown
							selectedID={eventUserID}
							onChange={handleChangeEventUserID}
							options={Project.current!.commonEvents.eventsUser}
							disabled={selectionType !== SELECTION_TYPE.USER}
							displayIDs
						/>
					</Value>
				</Form>
			</RadioGroup>
			{parameters.length > 0 && (
				<Groupbox title={t('parameter.values')}>
					<Tree constructorType={Model.MapObjectParameter} list={parameters} cannotAdd cannotDragDrop />
				</Groupbox>
			)}
		</Flex>
	);
});

export default PanelObjectEvent;
