/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../Editor';
import { ELEMENT_MAP_KIND, OBJECT_MOVING_KIND, Utils } from '../../common';
import { Node, Project, Rectangle } from '../../core';
import useStateBool from '../../hooks/useStateBool';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import { MapObjectCommand, MapObjectEvent, MapObjectState } from '../../models';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form from '../Form';
import GraphicsSelector from '../GraphicsSelector';
import Groupbox from '../Groupbox';
import InputText from '../InputText';
import Tab from '../Tab';
import Tree from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	object: Model.CommonObject;
	onAccept: () => Promise<void>;
};

function DialogMapObject({ isOpen, setIsOpen, object, onAccept }: Props) {
	const { t } = useTranslation();

	const [focusFirst, setFocustFirst] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useStateString();
	const [modelID, setModelID] = useStateNumber();
	const [tabTitles, setTabTitles] = useState<Model.Base[]>([]);
	const [tabContents, setTabContents] = useState<ReactNode[]>([]);
	const [states, setStates] = useState<Node[]>([]);
	const [events, setEvents] = useState<Node[]>([]);
	const [properties, setProperties] = useState<Node[]>([]);
	const [onlyOneEventPerFrame, setOnlyOneEventPerFrame] = useStateBool();
	const [canBeTriggeredAnotherObject, setCanBeTriggeredAnotherObject] = useStateBool();
	const [selectedState, setSelectedState] = useState<MapObjectState | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<MapObjectEvent | null>(null);
	const [graphicsID, setGraphicsID] = useState(-1);
	const [graphicsIndexX, setGraphicsIndexX] = useStateNumber();
	const [graphicsIndexY, setGraphicsIndexY] = useStateNumber();
	const [rectTileset, setRectTileset] = useState<Rectangle>();
	const [graphicsKind, setGraphicsKind] = useStateNumber();
	const [objectMovingKind, setObjectMovingKind] = useStateNumber();
	//const [eventCommandRoute, setEventCommandRoute] = useState<EventCommand | null>(null);
	const [speedID, setSpeedID] = useStateNumber();
	const [frequencyID, setFrequencyID] = useStateNumber();
	const [moveAnimation, setMoveAnimation] = useStateBool();
	const [stopAnimation, setStopAnimation] = useStateBool();
	const [climbAnimation, setClimbAnimation] = useStateBool();
	const [directionFix, setDirectionFix] = useStateBool();
	const [through, setThrough] = useStateBool();
	const [setWithCamera, setSetWithCamera] = useStateBool();
	const [pixelOffset, setPixelOffset] = useStateBool();
	const [keepPosition, setKeepPosition] = useStateBool();
	const [eventCommandDetection, setEventCommandDetection] = useState<MapObjectCommand | null>(null);
	const [forcedCurrentIndexTab, setForcedCurrentIndexTab] = useState<number | null>(null);
	const [forcedCurrentSelectedIDState, setForcedCurrentSelectedIDState] = useState<number | null>(null);
	const [forcedCurrentSelectedIndexEvent, setForcedCurrentSelectedIndexEvent] = useState<number | null>(null);
	const [blockingHero, setBlockingHero] = useStateBool();

	const initialize = () => {
		setName(object.name);
		setModelID(object.commonModelID);
		const newStates = Node.createList(object.states);
		const newEvents = Node.createList(object.events);
		const newProperties = Node.createList(object.properties);
		setStates(newStates);
		setForcedCurrentSelectedIDState(newStates[0]?.content?.id ?? -1);
		setProperties(newProperties);
		setEvents(newEvents);
		setOnlyOneEventPerFrame(object.onlyOneEventPerFrame);
		setCanBeTriggeredAnotherObject(object.canBeTriggeredAnotherObject);
		const state = newStates.length > 0 ? (newStates[0].content as MapObjectState) : null;
		handleChangeState(state, newEvents);
		setSelectedEvent(newEvents.length > 0 ? (newEvents[0].content as MapObjectEvent) : null);
		Project.current!.currentMapObjectStates = newStates;
		Project.current!.currentMapObjectEvents = newEvents;
		Project.current!.currentMapObjectProperties = newProperties;
	};

	const reset = () => {
		setGraphicsID(-1);
		setGraphicsIndexX(0);
		setGraphicsIndexY(0);
		setGraphicsKind(ELEMENT_MAP_KIND.NONE);
		setSelectedState(null);
	};

	const getObjectsList = () => [Model.Base.create(-1, t('none')), ...Project.current!.commonEvents.commonObjects];

	const updateReactionsTab = (nodes: Node[], state: MapObjectState | null) => {
		if (state) {
			setTabTitles(nodes.map((node) => node.content));
			setTabContents(
				nodes.map((node) => {
					const event = node.content as MapObjectEvent;
					const reaction = event.reactions.get('' + state.id);
					return reaction ? <Tree key={node.content.id} list={reaction.commands} /> : null;
				})
			);
		}
	};

	const handleChangeBlockingHero = (b: boolean) => {
		setBlockingHero(b);
		if (selectedEvent && selectedState) {
			const reaction = selectedEvent.reactions.get('' + selectedState.id);
			if (reaction) {
				reaction.blockingHero = b;
			}
		}
	};

	const handleCurrentIndexTabChanged = (index: number, model: Model.Base, isClick: boolean) => {
		if (isClick) {
			setForcedCurrentSelectedIndexEvent(index);
		}
	};

	const handleSelectedItemState = (node: Node | null) => {
		const state = node && node.content.id !== -1 ? (node.content as MapObjectState) : null;
		handleChangeState(state);
		if (state) {
			setBlockingHero(selectedEvent?.reactions?.get?.('' + state.id)?.blockingHero ?? false);
		}
	};

	const handleCreateState = (node: Node) => {
		const state = node.content as Model.MapObjectState;
		state.initialize();
		const id = '' + state.id;
		for (const node of events) {
			const event = node.content as Model.MapObjectEvent;
			const reaction = new Model.MapObjectReaction();
			reaction.commands = [];
			reaction.blockingHero = true;
			event.reactions.set(id, reaction);
		}
	};

	const handleEventListUpdated = () => {
		updateReactionsTab(events, selectedState);
	};

	const handleCreateEvent = (node: Node) => {
		const reactions = new Map<string, Model.MapObjectReaction>();
		const event = node.content as Model.MapObjectEvent;
		event.reactions = reactions;
		for (const state of states) {
			const id = '' + state.content.id;
			const reaction = new Model.MapObjectReaction();
			reaction.commands = [];
			reaction.blockingHero = true;
			reactions.set(id, reaction);
		}
	};

	const handleSelectedItemEvent = (node: Node | null) => {
		const event = (node?.content as MapObjectEvent) ?? null;
		setSelectedEvent(event);
		if (event) {
			setBlockingHero(event.reactions?.get?.('' + selectedState?.id)?.blockingHero ?? false);
		}
		setForcedCurrentIndexTab(node ? events.indexOf(node) : -1);
	};

	const handleChangeState = (state: MapObjectState | null, newEvents?: Node[]) => {
		setSelectedState(state);
		if (state) {
			setGraphicsKind(state.graphicsKind);
			setGraphicsIndexX(state.graphicsIndexX);
			setGraphicsIndexY(state.graphicsIndexY);
			setRectTileset(state.rectTileset);
			setGraphicsID(state.graphicsID);
			setObjectMovingKind(state.objectMovingKind);
			//setEventCommandRoute(state.eventCommandRoute);
			setSpeedID(state.speedID);
			setFrequencyID(state.frequencyID);
			setMoveAnimation(state.moveAnimation);
			setStopAnimation(state.stopAnimation);
			setClimbAnimation(state.climbAnimation);
			setDirectionFix(state.directionFix);
			setThrough(state.through);
			setSetWithCamera(state.setWithCamera);
			setPixelOffset(state.pixelOffset);
			setKeepPosition(state.keepPosition);
			setEventCommandDetection(state.eventCommandDetection);
		}
		updateReactionsTab(newEvents ?? events, state);
	};

	const handleChangeGraphicsKind = (kind: number) => {
		setGraphicsKind(kind);
		selectedState!.graphicsKind = kind;
	};

	const handleUpdateGraphics = (id: number, rect: Rectangle, isTileset: boolean) => {
		if (selectedState === null) {
			return;
		}
		selectedState!.graphicsID = id;
		selectedState!.graphicsIndexX = isTileset ? 0 : rect.x;
		selectedState!.graphicsIndexY = isTileset ? 0 : rect.y;
		selectedState!.rectTileset = isTileset ? rect.clone() : undefined;
		setGraphicsID(id);
		setGraphicsIndexX(selectedState!.graphicsIndexX);
		setGraphicsIndexY(selectedState!.graphicsIndexY);
		setRectTileset(selectedState!.rectTileset);
	};

	const handleChangeObjectMovingKind = (movingKind: number) => {
		setObjectMovingKind(movingKind);
		selectedState!.objectMovingKind = movingKind;
	};

	const handleClickEditRoute = () => {
		alert('TODO');
	};

	const handleChangeSpeedID = (speedID: number) => {
		setSpeedID(speedID);
		selectedState!.speedID = speedID;
	};

	const handleChangeFrequencyID = (frequencyID: number) => {
		setFrequencyID(frequencyID);
		selectedState!.frequencyID = frequencyID;
	};

	const handleChangeMoveAnimation = (moveAnimation: boolean) => {
		setMoveAnimation(moveAnimation);
		selectedState!.moveAnimation = moveAnimation;
	};

	const handleChangeStopAnimation = (stopAnimation: boolean) => {
		setStopAnimation(stopAnimation);
		selectedState!.stopAnimation = stopAnimation;
	};

	const handleChangeClimbAnimation = (climbAnimation: boolean) => {
		setClimbAnimation(climbAnimation);
		selectedState!.climbAnimation = climbAnimation;
	};

	const handleChangeDirectionFix = (directionFix: boolean) => {
		setDirectionFix(directionFix);
		selectedState!.directionFix = directionFix;
	};

	const handleChangeThrough = (through: boolean) => {
		setThrough(through);
		selectedState!.through = through;
	};

	const handleChangeSetWithCamera = (setWithCamera: boolean) => {
		setSetWithCamera(setWithCamera);
		selectedState!.setWithCamera = setWithCamera;
	};

	const handleChangePixelOffset = (pixelOffset: boolean) => {
		setPixelOffset(pixelOffset);
		selectedState!.pixelOffset = pixelOffset;
	};

	const handleChangeKeepPosition = (keepPosition: boolean) => {
		setKeepPosition(keepPosition);
		selectedState!.keepPosition = keepPosition;
	};

	const handleChangeDetectionCheck = (isChecked: boolean) => {
		setEventCommandDetection(isChecked ? new MapObjectCommand() : null);
	};

	const handleAccept = async () => {
		setIsLoading(true);
		object.name = name;
		object.commonModelID = modelID;
		object.canBeTriggeredAnotherObject = canBeTriggeredAnotherObject;
		object.onlyOneEventPerFrame = onlyOneEventPerFrame;
		object.states = Node.createListFromNodes(states);
		object.events = Node.createListFromNodes(events);
		object.properties = Node.createListFromNodes(properties);
		await onAccept();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			setFocustFirst(true);
			initialize();
		} else {
			reset();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('edit.object')}...`}
			isOpen={isOpen}
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='60%'
			initialHeight='90%'
		>
			<Flex column fillHeight spaced>
				<Flex centerV spaced>
					<Flex centerV spaced>
						{t('name')}:
						<InputText
							value={name}
							onChange={setName}
							focusFirst={focusFirst}
							setFocustFirst={setFocustFirst}
						/>
						ID: {Utils.formatNumberID(object.id)}
					</Flex>
					<Flex one />
					<Flex centerV spaced>
						{t('model')}:
						<Dropdown selectedID={modelID} onChange={setModelID} options={getObjectsList()} displayIDs />
					</Flex>
				</Flex>
				<Flex one spacedLarge>
					<Flex one spaced className={Utils.getClassName({ 'visibility-hidden': !selectedState })}>
						<Flex column one spaced>
							<Tab
								titles={tabTitles}
								setTitles={setTabTitles}
								contents={tabContents}
								setContents={setTabContents}
								forcedCurrentIndex={forcedCurrentIndexTab}
								setForcedCurrentIndex={setForcedCurrentIndexTab}
								onCurrentIndexChanged={handleCurrentIndexTabChanged}
							/>
							<Checkbox isChecked={blockingHero} onChange={handleChangeBlockingHero}>
								{t('block.hero.when.reaction')}
							</Checkbox>
						</Flex>
					</Flex>
					<Flex column spaced>
						<Flex one spacedLarge>
							<Flex column one spaced>
								{t('states')}:
								<Flex one zeroHeight>
									<Tree
										constructorType={Model.MapObjectState}
										list={states}
										onSelectedItem={handleSelectedItemState}
										onCreateItem={handleCreateState}
										forcedCurrentSelectedItemID={forcedCurrentSelectedIDState}
										setForcedCurrentSelectedItemID={setForcedCurrentSelectedIDState}
									/>
								</Flex>
							</Flex>
							<Flex column one spaced>
								{t('properties')}:
								<Flex one zeroHeight>
									<Tree list={properties} constructorType={Model.MapObjectProperty} />
								</Flex>
							</Flex>
						</Flex>
						<Flex column one spaced>
							{t('events')}:
							<Flex one zeroHeight>
								<Tree
									constructorType={Model.MapObjectEvent}
									list={events}
									onSelectedItem={handleSelectedItemEvent}
									onListUpdated={handleEventListUpdated}
									onCreateItem={handleCreateEvent}
									forcedCurrentSelectedItemIndex={forcedCurrentSelectedIndexEvent}
									setForcedCurrentSelectedItemIndex={setForcedCurrentSelectedIndexEvent}
									doNotGenerateIDOnPaste
									byIndex
								/>
							</Flex>
						</Flex>
						<Flex spaced className={Utils.getClassName({ 'visibility-hidden': !selectedState })}>
							<GraphicsSelector
								sceneID='dialog-map-object'
								graphicsID={graphicsID}
								graphicsIndexX={graphicsIndexX}
								graphicsIndexY={graphicsIndexY}
								rectTileset={rectTileset}
								graphicsKind={graphicsKind}
								onChangeGraphicsKind={handleChangeGraphicsKind}
								onUpdateGraphics={handleUpdateGraphics}
							/>
							<Flex column one spaced>
								<Groupbox title={t('moving')}>
									<Form>
										<td>{t('type')}:</td>
										<td>
											<Dropdown
												selectedID={objectMovingKind}
												onChange={handleChangeObjectMovingKind}
												options={Model.Base.OBJECT_MOVING_OPTIONS}
												translateOptions
												fillWidth
											/>
										</td>
										<td></td>
										<td>
											<Button
												disabled={objectMovingKind !== OBJECT_MOVING_KIND.ROUTE}
												onClick={handleClickEditRoute}
											>
												{t('edit.route')}...
											</Button>
										</td>
										<td>{t('speed')}:</td>
										<td>
											<Dropdown
												selectedID={speedID}
												onChange={handleChangeSpeedID}
												options={Project.current!.systems.speeds}
												fillWidth
											/>
										</td>
										<td>{t('frequency')}:</td>
										<td>
											<Dropdown
												selectedID={frequencyID}
												onChange={handleChangeFrequencyID}
												options={Project.current!.systems.frequencies}
												fillWidth
											/>
										</td>
									</Form>
								</Groupbox>
								<Button>{t('update.transformations')}...</Button>
							</Flex>
						</Flex>
						<Flex className={Utils.getClassName({ 'visibility-hidden': !selectedState })}>
							<Groupbox title={t('options')}>
								<Flex spacedLarge>
									<Flex column>
										<Checkbox isChecked={moveAnimation} onChange={handleChangeMoveAnimation}>
											{t('move.animation')}
										</Checkbox>
										<Checkbox isChecked={stopAnimation} onChange={handleChangeStopAnimation}>
											{t('stop.animation')}
										</Checkbox>
										<Checkbox isChecked={climbAnimation} onChange={handleChangeClimbAnimation}>
											{t('climb.animation')}
										</Checkbox>
										<Checkbox isChecked={directionFix} onChange={handleChangeDirectionFix}>
											{t('direction.fix')}
										</Checkbox>
									</Flex>
									<Flex column>
										<Checkbox isChecked={through} onChange={handleChangeThrough}>
											{t('through')}
										</Checkbox>
										<Checkbox isChecked={setWithCamera} onChange={handleChangeSetWithCamera}>
											{t('set.with.camera')}
										</Checkbox>
										<Checkbox isChecked={pixelOffset} onChange={handleChangePixelOffset}>
											{t('pixel.offset')}
										</Checkbox>
										<Checkbox isChecked={keepPosition} onChange={handleChangeKeepPosition}>
											{t('keep.position')}
										</Checkbox>
									</Flex>
									<Flex one />
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
				</Flex>
				<Flex>
					<Flex one spaced>
						<Checkbox isChecked={onlyOneEventPerFrame} onChange={setOnlyOneEventPerFrame}>
							{t('only.one.event.per.frame')}
						</Checkbox>
						<Checkbox isChecked={canBeTriggeredAnotherObject} onChange={setCanBeTriggeredAnotherObject}>
							{t('can.be.triggered.another.object')}
						</Checkbox>
					</Flex>
					<Flex className={Utils.getClassName({ 'visibility-hidden': !selectedState })}>
						<Checkbox isChecked={!!eventCommandDetection} onChange={handleChangeDetectionCheck}>
							<Flex centerV spaced>
								{t('detection')} <Button disabled={eventCommandDetection === null}>...</Button>
							</Flex>
						</Checkbox>
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogMapObject;
