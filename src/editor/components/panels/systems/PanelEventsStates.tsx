/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';

const PanelEventsStates = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [events, setEvents] = useState<Node[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<Model.CommonEvent | null>(null);
	const [parameters, setParameters] = useState<Node[]>([]);
	const [states, setStates] = useState<Node[]>([]);

	const isEventDisabled = useMemo(() => selectedEvent === null || selectedEvent.id === -1, [selectedEvent]);

	const initialize = () => {
		const commonEvents = Project.current!.commonEvents;
		setEvents(Node.createList(commonEvents.eventsUser));
		setStates(Node.createList(commonEvents.states));
	};

	const handleSelectEvent = (node: Node | null) => {
		if (node) {
			const event = node.content as Model.CommonEvent;
			setSelectedEvent(event);
			setParameters(Node.createList(event.parameters));
		}
	};

	const handleUpdateParameters = () => {
		if (selectedEvent) {
			selectedEvent.parameters = Node.createListFromNodes(parameters);
		}
	};

	const accept = () => {
		const commonEvents = Project.current!.commonEvents;
		commonEvents.eventsUser = Node.createListFromNodes(events);
		commonEvents.states = Node.createListFromNodes(states);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Flex column spacedLarge fillWidth fillHeight>
			<Flex one>
				<Groupbox title={t('events')} fillWidth>
					<Flex spacedLarge fillHeight>
						<Flex column fillHeight>
							<Flex one fillHeight>
								<Tree
									constructorType={Model.CommonEvent}
									list={events}
									minWidth={TREES_MIN_WIDTH}
									onSelectedItem={handleSelectEvent}
									noScrollOnForce
									scrollable
									showEditName
									applyDefault
								/>
							</Flex>
						</Flex>
						<Flex one>
							<Groupbox title={t('parameters')} fillWidth disabled={isEventDisabled}>
								<Flex one fillHeight>
									<Tree
										constructorType={Model.CreateParameter}
										list={parameters}
										onListUpdated={handleUpdateParameters}
										disabled={isEventDisabled}
										noScrollOnForce
										scrollable
										canBeEmpty
									/>
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
				</Groupbox>
			</Flex>
			<Flex one>
				<Groupbox title={t('states')} fillWidth>
					<Flex one fillHeight>
						<Tree
							constructorType={Model.Base}
							list={states}
							minWidth={TREES_MIN_WIDTH}
							noScrollOnForce
							scrollable
							showEditName
						/>
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);
});

export default PanelEventsStates;
