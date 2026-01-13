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
import { EVENT_COMMAND_KIND, OBJECT_MOVING_KIND, Utils } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Rectangle } from '../../core/Rectangle';
import { Model } from '../../Editor';
import useStateBool from '../../hooks/useStateBool';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import Button from '../Button';
import Checkbox from '../Checkbox';
import DialogCommandMoveObject from '../dialogs/commands/DialogCommandMoveObject';
import DialogCommandSendEvent from '../dialogs/commands/DialogCommandSendEvent';
import DialogTransformations from '../dialogs/DialogTransformations';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import GraphicsSelector, { GraphicsSelectorOptions } from '../GraphicsSelector';
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
	saveOnUpdate?: boolean;
};

const PanelMapObject = forwardRef(
	(
		{ object, hideNameID = false, hideStateValues = false, saveOnDestruction = false, saveOnUpdate = false }: Props,
		ref,
	) => {
		const { t } = useTranslation();

		const [focusFirst, setFocustFirst] = useState(false);
		const [isDialogCommandMoveObjectOpen, setIsDialogCommandMoveObjectOpen] = useState(false);
		const [isDialogCommandSendEventOpen, setIsDialogCommandSendEventOpen] = useState(false);
		const [isDialogTransformationsOpen, setIsDialogTransformationsOpen] = useState(false);
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
		const [graphicOptions, setGraphicOptions] = useState<GraphicsSelectorOptions>({
			graphicsID: -1,
			graphicsIndexX: 0,
			graphicsIndexY: 0,
			graphicsKind: 0,
		});
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
			const event = newEvents.length > 0 ? newEvents[0] : null;
			handleSelectedItemEvent(event);
			setForcedCurrentIndexTab(event ? newEvents.indexOf(event) : -1);
			Project.current!.currentMapObjectStates = newStates;
			Project.current!.currentMapObjectEvents = newEvents;
			Project.current!.currentMapObjectProperties = newProperties;
		};

		const reset = () => {
			setGraphicOptions({
				graphicsID: -1,
				graphicsIndexX: 0,
				graphicsIndexY: 0,
				graphicsKind: 0,
			});
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

		const handleChangeModelID = (id: number) => {
			setModelID(id);
			if (saveOnUpdate) {
				object.commonModelID = id;
			}
		};

		const handleChangeOnlyOneEventPerFrame = (b: boolean) => {
			setOnlyOneEventPerFrame(b);
			if (saveOnUpdate) {
				object.onlyOneEventPerFrame = b;
			}
		};

		const handleChangeCanBeTriggeredAnotherObject = (b: boolean) => {
			setCanBeTriggeredAnotherObject(b);
			if (saveOnUpdate) {
				object.canBeTriggeredAnotherObject = b;
			}
		};

		const handleUpdateStates = () => {
			if (saveOnUpdate) {
				object.states = Node.createListFromNodes(statesRef.current.states);
			}
		};

		const handlePasteState = (node: Node, originalCopyNode: Node) => {
			const state = node.content as Model.MapObjectState;
			for (const n of events) {
				const event = n.content as Model.MapObjectEvent;
				const copiedReaction = event.reactions.get('' + originalCopyNode.content.id)?.clone();
				event.reactions.set(
					'' + state.id,
					copiedReaction ?? (Model.MapObjectReaction.createDefault() as Model.MapObjectReaction),
				);
			}
		};

		const handleUpdateProperties = () => {
			if (saveOnUpdate) {
				object.properties = Node.createListFromNodes(statesRef.current.properties);
			}
		};

		const handleUpdateEvents = () => {
			if (saveOnUpdate) {
				object.events = Node.createListFromNodes(statesRef.current.events);
			}
		};

		const updateReactionsTab = (nodes: Node[], state: Model.MapObjectState | null) => {
			if (state) {
				setTabTitles(nodes.map((node) => node.content));
				setTabContents(
					nodes.map((node) => {
						const event = node.content as Model.MapObjectEvent;
						const reaction = event.reactions.get('' + state.id);
						return reaction ? (
							<TreeCommands
								key={node.content.id}
								list={reaction.commands}
								onListUpdated={handleUpdateEvents}
							/>
						) : null;
					}),
				);
			}
		};

		const handleChangeBlockingHero = (b: boolean) => {
			setBlockingHero(b);
			if (selectedEvent && selectedState) {
				const reaction = selectedEvent.reactions.get('' + selectedState.id);
				if (reaction) {
					reaction.blockingHero = b;
					handleUpdateEvents();
				}
			}
		};

		const handleCurrentIndexTabChanged = (index: number, model: Model.Base | undefined, isClick: boolean) => {
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
				handleUpdateEvents();
			}
		};

		const handleEventListUpdated = () => {
			updateReactionsTab(events, selectedState);
			handleUpdateEvents();
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
				setGraphicOptions({
					graphicsID: state.graphicsID,
					graphicsIndexX: state.graphicsIndexX,
					graphicsIndexY: state.graphicsIndexY,
					graphicsKind: state.graphicsKind,
					rectTileset: state.rectTileset,
				});
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
			setGraphicOptions({
				...graphicOptions,
				graphicsKind: kind,
			});
			selectedState!.graphicsKind = kind;
			handleUpdateStates();
		};

		const handleUpdateGraphics = (id: number, rect: Rectangle, isTileset: boolean, kind: number) => {
			if (selectedState === null) {
				return;
			}
			selectedState!.graphicsKind = kind;
			selectedState!.graphicsID = id;
			selectedState!.graphicsIndexX = isTileset ? 0 : rect.x;
			selectedState!.graphicsIndexY = isTileset ? 0 : rect.y;
			selectedState!.rectTileset = isTileset ? rect.clone() : undefined;
			setGraphicOptions({
				graphicsKind: kind,
				graphicsID: id,
				graphicsIndexX: selectedState!.graphicsIndexX,
				graphicsIndexY: selectedState!.graphicsIndexY,
				rectTileset: selectedState!.rectTileset,
			});
			handleUpdateStates();
		};

		const handleChangeObjectMovingKind = (movingKind: OBJECT_MOVING_KIND) => {
			setObjectMovingKind(movingKind);
			selectedState!.objectMovingKind = movingKind;
			if (movingKind !== OBJECT_MOVING_KIND.ROUTE) {
				selectedState!.eventCommandRoute = null;
				setEventCommandRoute(null);
			}
			handleUpdateStates();
		};

		const handleClickEditRoute = () => {
			setIsDialogCommandMoveObjectOpen(true);
		};

		const handleAcceptEditRoute = (command: Model.MapObjectCommand) => {
			selectedState!.eventCommandRoute = command;
			setEventCommandRoute(command);
			handleUpdateStates();
		};

		const handleChangeSpeedID = (speedID: number) => {
			setSpeedID(speedID);
			selectedState!.speedID = speedID;
			handleUpdateStates();
		};

		const handleChangeFrequencyID = (frequencyID: number) => {
			setFrequencyID(frequencyID);
			selectedState!.frequencyID = frequencyID;
			handleUpdateStates();
		};

		const handleChangeMoveAnimation = (moveAnimation: boolean) => {
			setMoveAnimation(moveAnimation);
			selectedState!.moveAnimation = moveAnimation;
			handleUpdateStates();
		};

		const handleChangeStopAnimation = (stopAnimation: boolean) => {
			setStopAnimation(stopAnimation);
			selectedState!.stopAnimation = stopAnimation;
			handleUpdateStates();
		};

		const handleChangeClimbAnimation = (climbAnimation: boolean) => {
			setClimbAnimation(climbAnimation);
			selectedState!.climbAnimation = climbAnimation;
			handleUpdateStates();
		};

		const handleChangeDirectionFix = (directionFix: boolean) => {
			setDirectionFix(directionFix);
			selectedState!.directionFix = directionFix;
			handleUpdateStates();
		};

		const handleChangeThrough = (through: boolean) => {
			setThrough(through);
			selectedState!.through = through;
			handleUpdateStates();
		};

		const handleChangeSetWithCamera = (setWithCamera: boolean) => {
			setSetWithCamera(setWithCamera);
			selectedState!.setWithCamera = setWithCamera;
			handleUpdateStates();
		};

		const handleChangePixelOffset = (pixelOffset: boolean) => {
			setPixelOffset(pixelOffset);
			selectedState!.pixelOffset = pixelOffset;
			handleUpdateStates();
		};

		const handleChangeKeepPosition = (keepPosition: boolean) => {
			setKeepPosition(keepPosition);
			selectedState!.keepPosition = keepPosition;
			handleUpdateStates();
		};

		const handleChangeDetectionCheck = (isChecked: boolean) => {
			if (isChecked) {
				setIsDialogCommandSendEventOpen(true);
			} else {
				selectedState!.eventCommandDetection = null;
				setEventCommandDetection(null);
				handleUpdateStates();
			}
		};

		const handleAcceptDetection = (command: Model.MapObjectCommand) => {
			selectedState!.eventCommandDetection = command;
			setEventCommandDetection(command);
			handleUpdateStates();
		};

		const handleClickDetection = () => {
			setIsDialogCommandSendEventOpen(true);
		};

		const handleClickUpdateTransformations = () => {
			setIsDialogTransformationsOpen(true);
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
					accept().catch(console.error);
				};
			}
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
								onChange={handleChangeModelID}
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
											onListUpdated={handleUpdateStates}
											onPasteItem={handlePasteState}
											forcedCurrentSelectedItemID={forcedCurrentSelectedIDState}
											setForcedCurrentSelectedItemID={setForcedCurrentSelectedIDState}
											cannotUpdateListSize
											canBeEmpty
										/>
									</Flex>
								</Flex>
								<Flex column one spaced>
									{t('properties')}:
									<Flex one zeroHeight>
										<Tree
											list={properties}
											constructorType={Model.MapObjectProperty}
											onListUpdated={handleUpdateProperties}
											cannotUpdateListSize
											canBeEmpty
										/>
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
										cannotUpdateListSize
										canBeEmpty
									/>
								</Flex>
							</Flex>
							<Flex
								spaced
								className={Utils.getClassName({ visibilityHidden: !selectedState || hideStateValues })}
							>
								<GraphicsSelector
									sceneID='dialog-map-object'
									options={graphicOptions}
									onChangeGraphicsKind={handleChangeGraphicsKind}
									onUpdateGraphics={handleUpdateGraphics}
									hidden={!selectedState || hideStateValues}
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
									<Button onClick={handleClickUpdateTransformations}>
										{t('update.transformations')}...
									</Button>
								</Flex>
							</Flex>
							<Flex
								className={Utils.getClassName({ visibilityHidden: !selectedState || hideStateValues })}
							>
								<Groupbox title={t('options')} fillWidth canExpand initialClose>
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
							<Checkbox isChecked={onlyOneEventPerFrame} onChange={handleChangeOnlyOneEventPerFrame}>
								{t('only.one.event.per.frame')}
							</Checkbox>
							<Checkbox
								isChecked={canBeTriggeredAnotherObject}
								onChange={handleChangeCanBeTriggeredAnotherObject}
							>
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
				{isDialogCommandMoveObjectOpen && (
					<DialogCommandMoveObject
						commandKind={EVENT_COMMAND_KIND.MOVE_OBJECT}
						setIsOpen={setIsDialogCommandMoveObjectOpen}
						list={eventCommandRoute?.command}
						onAccept={handleAcceptEditRoute}
						onReject={() => {}}
					/>
				)}
				{isDialogCommandSendEventOpen && (
					<DialogCommandSendEvent
						commandKind={EVENT_COMMAND_KIND.SEND_EVENT}
						setIsOpen={setIsDialogCommandSendEventOpen}
						list={eventCommandDetection?.command}
						onAccept={handleAcceptDetection}
						onReject={() => {}}
					/>
				)}
				{isDialogTransformationsOpen && selectedState && (
					<DialogTransformations
						setIsOpen={setIsDialogTransformationsOpen}
						centerX={selectedState.centerX}
						centerZ={selectedState.centerZ}
						angleX={selectedState.angleX}
						angleY={selectedState.angleY}
						angleZ={selectedState.angleZ}
						scaleX={selectedState.scaleX}
						scaleY={selectedState.scaleY}
						scaleZ={selectedState.scaleZ}
						onAccept={handleUpdateStates}
					/>
				)}
			</>
		);
	},
);

PanelMapObject.displayName = 'PanelMapObject';

export default PanelMapObject;
