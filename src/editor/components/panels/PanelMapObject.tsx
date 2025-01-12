/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ELEMENT_MAP_KIND, EVENT_COMMAND_KIND, OBJECT_MOVING_KIND, Utils } from '../../common';
import { Node, Project, Rectangle } from '../../core';
import { Model } from '../../Editor';
import useStateBool from '../../hooks/useStateBool';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import Button from '../Button';
import Checkbox from '../Checkbox';
import DialogCommandMoveObject from '../dialogs/commands/DialogCommandMoveObject';
import DialogCommandSendEvent from '../dialogs/commands/DialogCommandSendEvent';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import GraphicsSelector from '../GraphicsSelector';
import Groupbox from '../Groupbox';
import InputText from '../InputText';
import Tab from '../Tab';
import Tree from '../Tree';
import TreeCommands from '../TreeCommands';

export interface PanelMapObjectRef {
	initialize: () => void;
	reset: () => void;
	accept: () => void;
}

type Props = {
	object: Model.CommonObject;
	hideNameID?: boolean;
	hideStateValues?: boolean;
	saveOnDestruction?: boolean;
};

const PanelMapObject = forwardRef(
	({ object, hideNameID = false, hideStateValues = false, saveOnDestruction = false }: Props, ref) => {
		const { t } = useTranslation();

		const [focusFirst, setFocustFirst] = useState(false);
		const [isDialogCommandMoveObjectOpen, setIsDialogCommandMoveObjectOpen] = useState(false);
		const [isDialogCommandSendEventOpen, setIsDialogCommandSendEventOpen] = useState(false);
		const [name, setName] = useStateString();
		const [modelID, setModelID] = useStateNumber();
		const [tabTitles, setTabTitles] = useState<Model.Base[]>([]);
		const [tabContents, setTabContents] = useState<ReactNode[]>([]);
		const [states, setStates] = useState<Node[]>([]);
		const [events, setEvents] = useState<Node[]>([]);
		const [properties, setProperties] = useState<Node[]>([]);
		const [onlyOneEventPerFrame, setOnlyOneEventPerFrame] = useStateBool();
		const [canBeTriggeredAnotherObject, setCanBeTriggeredAnotherObject] = useStateBool();
		const [selectedState, setSelectedState] = useState<Model.MapObjectState | null>(null);
		const [selectedEvent, setSelectedEvent] = useState<Model.MapObjectEvent | null>(null);
		const [graphicsID, setGraphicsID] = useState(-1);
		const [graphicsIndexX, setGraphicsIndexX] = useStateNumber();
		const [graphicsIndexY, setGraphicsIndexY] = useStateNumber();
		const [rectTileset, setRectTileset] = useState<Rectangle>();
		const [graphicsKind, setGraphicsKind] = useStateNumber();
		const [objectMovingKind, setObjectMovingKind] = useStateNumber();
		const [eventCommandRoute, setEventCommandRoute] = useState<Model.MapObjectCommand | null>(null);
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
		const [eventCommandDetection, setEventCommandDetection] = useState<Model.MapObjectCommand | null>(null);
		const [forcedCurrentIndexTab, setForcedCurrentIndexTab] = useState<number | null>(null);
		const [forcedCurrentSelectedIDState, setForcedCurrentSelectedIDState] = useState<number | null>(null);
		const [forcedCurrentSelectedIndexEvent, setForcedCurrentSelectedIndexEvent] = useState<number | null>(null);
		const [blockingHero, setBlockingHero] = useStateBool();

		const statesRef = useRef({
			name,
			modelID,
			canBeTriggeredAnotherObject,
			onlyOneEventPerFrame,
			states,
			events,
			properties,
		});

		const initialize = () => {
			setFocustFirst(true);
			if (!hideNameID) {
				setName(object.name);
			}
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
			const state = newStates.length > 0 ? (newStates[0].content as Model.MapObjectState) : null;
			handleChangeState(state, newEvents);
			const event = newEvents.length > 0 ? (newEvents[0].content as Model.MapObjectEvent) : null;
			setSelectedEvent(event);
			Project.current!.currentMapObjectStates = newStates;
			Project.current!.currentMapObjectEvents = newEvents;
			Project.current!.currentMapObjectProperties = newProperties;
			Project.current!.currentMapObjectParameters = event?.parameters ?? [];
		};

		const reset = () => {
			setGraphicsID(-1);
			setGraphicsIndexX(0);
			setGraphicsIndexY(0);
			setGraphicsKind(ELEMENT_MAP_KIND.NONE);
			setSelectedState(null);
			setStates([]);
			setProperties([]);
			setEvents([]);
			setTabTitles([]);
			setTabContents([]);
			Project.current!.currentMapObjectProperties = [];
			Project.current!.currentMapObjectParameters = [];
		};

		const getObjectsList = () => [Model.Base.create(-1, t('none')), ...Project.current!.commonEvents.commonObjects];

		const updateReactionsTab = (nodes: Node[], state: Model.MapObjectState | null) => {
			if (state) {
				setTabTitles(nodes.map((node) => node.content));
				setTabContents(
					nodes.map((node) => {
						const event = node.content as Model.MapObjectEvent;
						const reaction = event.reactions.get('' + state.id);
						return reaction ? <TreeCommands key={node.content.id} list={reaction.commands} /> : null;
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
			const state = node && node.content.id !== -1 ? (node.content as Model.MapObjectState) : null;
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
			const event = (node?.content as Model.MapObjectEvent) ?? null;
			setSelectedEvent(event);
			if (event) {
				setBlockingHero(event.reactions?.get?.('' + selectedState?.id)?.blockingHero ?? false);
			}
			setForcedCurrentIndexTab(node ? events.indexOf(node) : -1);
			Project.current!.currentMapObjectParameters = event?.parameters ?? [];
		};

		const handleChangeState = (state: Model.MapObjectState | null, newEvents?: Node[]) => {
			setSelectedState(state);
			if (state) {
				setGraphicsKind(state.graphicsKind);
				setGraphicsIndexX(state.graphicsIndexX);
				setGraphicsIndexY(state.graphicsIndexY);
				setRectTileset(state.rectTileset);
				setGraphicsID(state.graphicsID);
				setObjectMovingKind(state.objectMovingKind);
				setEventCommandRoute(state.eventCommandRoute);
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

		const handleChangeObjectMovingKind = (movingKind: OBJECT_MOVING_KIND) => {
			setObjectMovingKind(movingKind);
			selectedState!.objectMovingKind = movingKind;
			if (movingKind !== OBJECT_MOVING_KIND.ROUTE) {
				selectedState!.eventCommandRoute = null;
				setEventCommandRoute(null);
			}
		};

		const handleClickEditRoute = () => {
			setIsDialogCommandMoveObjectOpen(true);
		};

		const handleAcceptEditRoute = (command: Model.MapObjectCommand) => {
			selectedState!.eventCommandRoute = command;
			setEventCommandRoute(command);
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
			if (isChecked) {
				setIsDialogCommandSendEventOpen(true);
			} else {
				selectedState!.eventCommandDetection = null;
				setEventCommandDetection(null);
			}
		};

		const handleAcceptDetection = (command: Model.MapObjectCommand) => {
			selectedState!.eventCommandDetection = command;
			setEventCommandDetection(command);
		};

		const handleClickDetection = () => {
			setIsDialogCommandSendEventOpen(true);
		};

		const accept = async () => {
			object.name = statesRef.current.name;
			object.commonModelID = statesRef.current.modelID;
			object.canBeTriggeredAnotherObject = statesRef.current.canBeTriggeredAnotherObject;
			object.onlyOneEventPerFrame = statesRef.current.onlyOneEventPerFrame;
			object.states = Node.createListFromNodes(statesRef.current.states);
			object.events = Node.createListFromNodes(statesRef.current.events);
			object.properties = Node.createListFromNodes(statesRef.current.properties);
		};

		useImperativeHandle(ref, () => ({
			initialize,
			reset,
			accept,
		}));

		useEffect(() => {
			statesRef.current = {
				name,
				modelID,
				canBeTriggeredAnotherObject,
				onlyOneEventPerFrame,
				states,
				events,
				properties,
			};
		}, [name, modelID, canBeTriggeredAnotherObject, onlyOneEventPerFrame, states, events, properties]);

		useEffect(() => {
			initialize();
			if (saveOnDestruction) {
				return () => {
					accept();
				};
			}
			// eslint-disable-next-line
		}, []);

		return (
			<>
				<Flex column fillWidth fillHeight spaced>
					<Flex centerV spaced>
						{!hideNameID && (
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
						)}
						<Flex one />
						<Flex centerV spaced>
							{t('model')}:
							<Dropdown
								selectedID={modelID}
								onChange={setModelID}
								options={getObjectsList()}
								displayIDs
							/>
						</Flex>
					</Flex>
					<Flex one spacedLarge>
						<Flex one spaced className={Utils.getClassName({ visibilityHidden: !selectedState })}>
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
							<Flex
								spaced
								className={Utils.getClassName({ visibilityHidden: !selectedState || hideStateValues })}
							>
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
											<Label>{t('type')}</Label>
											<Value>
												<Dropdown
													selectedID={objectMovingKind}
													onChange={handleChangeObjectMovingKind}
													options={Model.Base.OBJECT_MOVING_OPTIONS}
													translateOptions
													fillWidth
												/>
											</Value>
											<td />
											<Value>
												<Button
													disabled={objectMovingKind !== OBJECT_MOVING_KIND.ROUTE}
													onClick={handleClickEditRoute}
												>
													{t('edit.route')}...
												</Button>
											</Value>
											<Label>{t('speed')}</Label>
											<Value>
												<Dropdown
													selectedID={speedID}
													onChange={handleChangeSpeedID}
													options={Project.current!.systems.speeds}
													fillWidth
												/>
											</Value>
											<Label>{t('frequency')}</Label>
											<Value>
												<Dropdown
													selectedID={frequencyID}
													onChange={handleChangeFrequencyID}
													options={Project.current!.systems.frequencies}
													fillWidth
												/>
											</Value>
										</Form>
									</Groupbox>
									<Button>{t('update.transformations')}...</Button>
								</Flex>
							</Flex>
							<Flex
								className={Utils.getClassName({ visibilityHidden: !selectedState || hideStateValues })}
							>
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
					<Flex spacedLarge>
						<Flex one spaced>
							<Checkbox isChecked={onlyOneEventPerFrame} onChange={setOnlyOneEventPerFrame}>
								{t('only.one.event.per.frame')}
							</Checkbox>
							<Checkbox isChecked={canBeTriggeredAnotherObject} onChange={setCanBeTriggeredAnotherObject}>
								{t('can.be.triggered.another.object')}
							</Checkbox>
						</Flex>
						<Flex className={Utils.getClassName({ visibilityHidden: !selectedState || hideStateValues })}>
							<Flex centerV spaced>
								<Checkbox isChecked={!!eventCommandDetection} onChange={handleChangeDetectionCheck}>
									{t('detection')}
								</Checkbox>
								<Button disabled={eventCommandDetection === null} onClick={handleClickDetection}>
									...
								</Button>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<DialogCommandMoveObject
					commandKind={EVENT_COMMAND_KIND.MOVE_OBJECT}
					isOpen={isDialogCommandMoveObjectOpen}
					setIsOpen={setIsDialogCommandMoveObjectOpen}
					list={eventCommandRoute?.command}
					onAccept={handleAcceptEditRoute}
					onReject={() => {}}
				/>
				<DialogCommandSendEvent
					commandKind={EVENT_COMMAND_KIND.SEND_EVENT}
					isOpen={isDialogCommandSendEventOpen}
					setIsOpen={setIsDialogCommandSendEventOpen}
					list={eventCommandDetection?.command}
					onAccept={handleAcceptDetection}
					onReject={() => {}}
				/>
			</>
		);
	}
);

export default PanelMapObject;
