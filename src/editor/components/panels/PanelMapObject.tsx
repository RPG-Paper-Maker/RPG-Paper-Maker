/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLink, FaPen, FaUndo } from 'react-icons/fa';
import { EVENT_COMMAND_KIND, OBJECT_MOVING_KIND, STATE_OVERRIDE_GROUP, Utils } from '../../common';
import { ModelInheritance, ResolvedObject } from '../../core/ModelInheritance';
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
import { InheritanceText, OverrideIndicator } from '../InheritanceBadge';
import InputText from '../InputText';
import Tab from '../Tab';
import Tree, { TREES_MIN_HEIGHT, TREES_MIN_WIDTH } from '../Tree';
import TreeCommands from '../TreeCommands';

export interface PanelMapObjectRef {
	initialize: () => void;
	reset: () => void;
	accept: () => void;
	getEditedObject: () => Model.CommonObject;
}

export type PlayCommandInfo = {
	node: Node;
	reaction: Model.MapObjectReaction;
	stateID: number;
	openOptions: boolean;
	isNewCommand?: boolean;
};

type Props = {
	object: Model.CommonObject;
	initialEventIndex?: number;
	initialStateID?: number;
	hideNameID?: boolean;
	hideStateValues?: boolean;
	isModel?: boolean;
	saveOnDestruction?: boolean;
	saveOnUpdate?: boolean;
	onPlayCommand?: (info: PlayCommandInfo) => void;
	onSelectCommand?: (info: PlayCommandInfo | null) => void;
	onLivePreviewCommand?: (info: PlayCommandInfo, command: Model.MapObjectCommand | null) => void;
	onUpdateStateGraphics?: (state: Model.MapObjectState) => void;
};

const PanelMapObject = forwardRef(
	(
		{
			object,
			initialEventIndex,
			initialStateID,
			hideNameID = false,
			hideStateValues = false,
			isModel = false,
			saveOnDestruction = false,
			saveOnUpdate = false,
			onPlayCommand,
			onSelectCommand,
			onLivePreviewCommand,
			onUpdateStateGraphics,
		}: Props,
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
		const [tabTitleSuffixes, setTabTitleSuffixes] = useState<ReactNode[]>([]);
		const [states, setStates] = useState<Node[]>([]);
		const [events, setEvents] = useState<Node[]>([]);
		const [properties, setProperties] = useState<Node[]>([]);
		const [onlyOneEventPerFrame, setOnlyOneEventPerFrame] = useStateBool();
		const [onlyOneEventPerFrameOverride, setOnlyOneEventPerFrameOverride] = useStateBool();
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
		const [lights, setLights] = useState<Node[]>([]);
		const [, setRefreshCount] = useState(0);

		const parentRef = useRef<{ id: number; resolved: ResolvedObject | null }>({ id: -1, resolved: null });

		const statesRef = useRef({
			name,
			modelID,
			onlyOneEventPerFrame,
			onlyOneEventPerFrameOverride,
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
			updateParent(object.commonModelID);
			const { newStates, newEvents, newProperties } = syncLists(
				Node.createList(object.states),
				Node.createList(object.events),
				Node.createList(object.properties),
			);
			setStates(newStates);
			const initialState = newStates.find((node) => node.content.id === initialStateID) ?? newStates[0];
			setForcedCurrentSelectedIDState(initialState?.content?.id ?? -1);
			setProperties(newProperties);
			setEvents(newEvents);
			setOnlyOneEventPerFrame(object.onlyOneEventPerFrame);
			setOnlyOneEventPerFrameOverride(object.onlyOneEventPerFrameOverride);
			const state = (initialState?.content as Model.MapObjectState | undefined) ?? null;
			handleChangeState(state, newEvents);
			const event = newEvents[initialEventIndex ?? 0] ?? newEvents[0] ?? null;
			handleSelectedItemEvent(event);
			if (initialEventIndex !== undefined) {
				setForcedCurrentSelectedIndexEvent(event ? newEvents.indexOf(event) : -1);
			}
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
			setTabTitleSuffixes([]);
			Project.current!.currentMapObjectProperties = [];
			Project.current!.currentMapObjectParameters = [];
		};

		const getObjectsList = () => [Model.Base.create(-1, t('none')), ...Project.current!.commonEvents.commonObjects];

		const getDisabledModelIds = (): number[] => {
			const commonObjects = Project.current!.commonEvents.commonObjects;
			const disabledSet = new Set<number>(isModel ? [object.id] : []);
			let changed = true;
			while (changed) {
				changed = false;
				for (const obj of commonObjects) {
					if (!disabledSet.has(obj.id) && disabledSet.has(obj.commonModelID)) {
						disabledSet.add(obj.id);
						changed = true;
					}
				}
			}
			return Array.from(disabledSet);
		};

		const updateParent = (id: number) => {
			parentRef.current = { id, resolved: ModelInheritance.resolveModel(id) };
		};

		const getParent = () => parentRef.current.resolved;

		const getParentID = () => parentRef.current.id;

		const getModelName = (id: number) => ModelInheritance.getModelName(id);

		const refresh = () => setRefreshCount((count) => count + 1);

		const syncNodes = (nodes: Node[], contents: Model.Base[]): Node[] => {
			const nodesByContent = new Map(nodes.map((node) => [node.content, node]));
			return contents.map((content) => nodesByContent.get(content) ?? Node.create(content));
		};

		const syncLists = (stateNodes: Node[], eventNodes: Node[], propertyNodes: Node[]) => {
			const parent = getParent();
			const newStates = syncNodes(
				stateNodes,
				ModelInheritance.syncStates(Node.createListFromNodes(stateNodes), parent),
			);
			const newEvents = syncNodes(
				eventNodes,
				ModelInheritance.syncEvents(
					Node.createListFromNodes(eventNodes),
					parent,
					newStates.map((node) => node.content.id),
				),
			);
			const newProperties = syncNodes(
				propertyNodes,
				ModelInheritance.syncProperties(Node.createListFromNodes(propertyNodes), parent),
			);
			return { newStates, newEvents, newProperties };
		};

		const replaceList = (target: Node[], source: Node[]): Node[] => {
			target.splice(0, target.length, ...source);
			return target;
		};

		const resync = (stateNodes: Node[], eventNodes: Node[], propertyNodes: Node[]) => {
			const synced = syncLists(stateNodes, eventNodes, propertyNodes);
			const newStates = replaceList(states, synced.newStates);
			const newEvents = replaceList(events, synced.newEvents);
			const newProperties = replaceList(properties, synced.newProperties);
			Project.current!.currentMapObjectStates = newStates;
			Project.current!.currentMapObjectEvents = newEvents;
			Project.current!.currentMapObjectProperties = newProperties;
			refresh();
			saveStates(newStates);
			saveEvents(newEvents);
			saveProperties(newProperties);
			const stateNode =
				newStates.find((node) => node.content === selectedState) ??
				newStates.find((node) => node.content.id === selectedState?.id) ??
				newStates[0] ??
				null;
			const state = (stateNode?.content as Model.MapObjectState | undefined) ?? null;
			if (state !== selectedState) {
				setForcedCurrentSelectedIDState(state?.id ?? -1);
			}
			const eventIndex = Math.max(
				0,
				newEvents.findIndex((node) => node.content === selectedEvent),
			);
			const eventNode = newEvents[eventIndex] ?? null;
			const event = (eventNode?.content as Model.MapObjectEvent | undefined) ?? null;
			if (event !== selectedEvent) {
				setSelectedEvent(event);
				setForcedCurrentSelectedIndexEvent(eventNode ? eventIndex : -1);
				Project.current!.currentMapObjectParameters = event?.parameters ?? [];
			}
			setForcedCurrentIndexTab(eventNode ? eventIndex : -1);
			handleChangeState(state, newEvents);
			if (state && event) {
				setBlockingHero(getDisplayedReaction(event, state)?.blockingHero ?? false);
			}
		};

		const handleChangeModelID = (id: number) => {
			const parent = getParent();
			const ownStates = states.filter(
				(node) => !ModelInheritance.isMirrorState(node.content as Model.MapObjectState, parent),
			);
			const ownEvents = events.filter(
				(node) => !ModelInheritance.isMirrorEvent(node.content as Model.MapObjectEvent, parent),
			);
			const ownProperties = properties.filter(
				(node) => !ModelInheritance.isMirrorProperty(node.content as Model.MapObjectProperty, parent),
			);
			setModelID(id);
			updateParent(id);
			if (saveOnUpdate) {
				object.commonModelID = id;
			}
			resync(ownStates, ownEvents, ownProperties);
		};

		const handleChangeOnlyOneEventPerFrame = (b: boolean) => {
			setOnlyOneEventPerFrame(b);
			setOnlyOneEventPerFrameOverride(true);
			if (saveOnUpdate) {
				object.onlyOneEventPerFrame = b;
				object.onlyOneEventPerFrameOverride = true;
			}
		};

		const handleRevertOnlyOneEventPerFrame = () => {
			setOnlyOneEventPerFrameOverride(false);
			if (saveOnUpdate) {
				object.onlyOneEventPerFrameOverride = false;
			}
		};

		const markTouched = (group: STATE_OVERRIDE_GROUP) => {
			selectedState?.addOverride(group);
		};

		const markReactionTouched = (reaction: Model.MapObjectReaction) => {
			reaction.inherit = false;
			handleUpdateEvents();
			refresh();
		};

		const saveStates = (nodes: Node[]) => {
			if (saveOnUpdate) {
				object.states = ModelInheritance.getOwnStatesForSave(Node.createListFromNodes(nodes), getParent());
			}
		};

		const saveEvents = (nodes: Node[]) => {
			if (saveOnUpdate) {
				object.events = ModelInheritance.getOwnEventsForSave(Node.createListFromNodes(nodes), getParent());
			}
		};

		const saveProperties = (nodes: Node[]) => {
			if (saveOnUpdate) {
				object.properties = ModelInheritance.getOwnPropertiesForSave(
					Node.createListFromNodes(nodes),
					getParent(),
				);
			}
		};

		const handleUpdateStates = () => {
			saveStates(statesRef.current.states);
		};

		const handleStatesListUpdated = () => {
			resync(states, events, properties);
		};

		const handleRevertGroup = (group: STATE_OVERRIDE_GROUP) => {
			if (!selectedState) return;
			selectedState.removeOverride(group);
			resync(states, events, properties);
			onUpdateStateGraphics?.(selectedState);
		};

		const handleRevertState = () => {
			if (!selectedState) return;
			selectedState.overrides = [];
			resync(states, events, properties);
			onUpdateStateGraphics?.(selectedState);
		};

		const canDeleteState = (node: Node | null) =>
			node?.content instanceof Model.MapObjectState && !ModelInheritance.isMirrorState(node.content, getParent());

		const canDeleteEvent = (node: Node | null) =>
			node?.content instanceof Model.MapObjectEvent && !ModelInheritance.isMirrorEvent(node.content, getParent());

		const canDeleteProperty = (node: Node | null) =>
			node?.content instanceof Model.MapObjectProperty &&
			!ModelInheritance.isMirrorProperty(node.content, getParent());

		const handlePasteState = (node: Node, originalCopyNode: Node) => {
			const state = node.content as Model.MapObjectState;
			for (const n of events) {
				const event = n.content as Model.MapObjectEvent;
				const copiedReaction = event.reactions?.get('' + originalCopyNode.content.id)?.clone();
				event.reactions.set(
					'' + state.id,
					copiedReaction ?? (Model.MapObjectReaction.createDefault() as Model.MapObjectReaction),
				);
			}
		};

		const handleUpdateProperties = () => {
			resync(states, events, properties);
		};

		const handleUpdateLights = () => {
			if (!selectedState) return;
			selectedState.lights = lights.map((node) => node.content as Model.MapObjectLight);
			markTouched(STATE_OVERRIDE_GROUP.LIGHTS);
			handleUpdateStates();
			onUpdateStateGraphics?.(selectedState);
			refresh();
		};

		const handleLivePreviewLight = (light: Model.Base | null, isNew: boolean) => {
			if (!selectedState) return;
			selectedState.lights = [
				...lights.map((node) => node.content as Model.MapObjectLight),
				...(light && isNew ? [light as Model.MapObjectLight] : []),
			];
			handleUpdateStates();
			onUpdateStateGraphics?.(selectedState);
		};

		const handleUpdateEvents = () => {
			saveEvents(statesRef.current.events);
		};

		const getReactionInfo = (event: Model.MapObjectEvent, state: Model.MapObjectState) => {
			const reaction = event.reactions?.get('' + state.id) ?? null;
			const parentReaction = ModelInheritance.getParentReaction(event, state.id, getParent(), getParentID());
			const isInherited = !!reaction && reaction.inherit && !!parentReaction;
			return { reaction, parentReaction, isInherited };
		};

		const getDisplayedReaction = (event: Model.MapObjectEvent, state: Model.MapObjectState) => {
			const { reaction, parentReaction, isInherited } = getReactionInfo(event, state);
			return isInherited ? parentReaction!.reaction : reaction;
		};

		const handleOverrideReaction = (
			reaction: Model.MapObjectReaction,
			parentReaction: Model.MapObjectReaction,
			eventNodes: Node[],
			state: Model.MapObjectState,
		) => {
			reaction.commands = parentReaction.commands.map((command) => command.clone());
			reaction.blockingHero = parentReaction.blockingHero;
			reaction.inherit = false;
			setBlockingHero(reaction.blockingHero);
			saveEvents(eventNodes);
			updateReactionsTab(eventNodes, state);
			refresh();
		};

		const handleRevertReaction = (
			reaction: Model.MapObjectReaction,
			parentReaction: Model.MapObjectReaction,
			eventNodes: Node[],
			state: Model.MapObjectState,
		) => {
			reaction.commands = [];
			reaction.blockingHero = parentReaction.blockingHero;
			reaction.inherit = true;
			setBlockingHero(parentReaction.blockingHero);
			saveEvents(eventNodes);
			updateReactionsTab(eventNodes, state);
			refresh();
		};

		const getReactionTabSuffix = (
			event: Model.MapObjectEvent,
			state: Model.MapObjectState,
			eventNodes: Node[],
		): ReactNode => {
			const { reaction, parentReaction, isInherited } = getReactionInfo(event, state);
			if (!reaction || !parentReaction) {
				return null;
			}
			const sourceName = getModelName(parentReaction.sourceModelID);
			return isInherited ? (
				<>
					<span className='inheritanceBadge' title={t('from.model', { model: sourceName })}>
						<FaLink />
					</span>
					<span
						className='inheritanceBadge inheritanceAction'
						title={t('override')}
						onClick={(e) => {
							e.stopPropagation();
							handleOverrideReaction(reaction, parentReaction.reaction, eventNodes, state);
						}}
					>
						<FaPen />
					</span>
				</>
			) : (
				<>
					<span
						className='inheritanceBadge inheritanceOverridden'
						title={t('replaces.model.reaction', { model: sourceName })}
					>
						●
					</span>
					<span
						className='inheritanceBadge inheritanceAction'
						title={t('revert.to.model')}
						onClick={(e) => {
							e.stopPropagation();
							handleRevertReaction(reaction, parentReaction.reaction, eventNodes, state);
						}}
					>
						<FaUndo />
					</span>
				</>
			);
		};

		const renderReaction = (
			event: Model.MapObjectEvent,
			state: Model.MapObjectState,
			eventNodes: Node[],
			index: number,
		) => {
			const { reaction, parentReaction, isInherited } = getReactionInfo(event, state);
			if (!reaction) {
				return null;
			}
			const executedReaction = isInherited ? parentReaction!.reaction : reaction;
			const getInfo = (commandNode: Node, openOptions: boolean, isNewCommand?: boolean): PlayCommandInfo => ({
				node: commandNode,
				reaction: executedReaction,
				stateID: state.id,
				openOptions,
				isNewCommand,
			});
			return (
				<Flex key={`${index}-${isInherited}`} column one>
					<TreeCommands
						list={
							isInherited
								? parentReaction!.reaction.commands.map((command) => command.clone())
								: reaction.commands
						}
						disabled={isInherited}
						onListUpdated={() => markReactionTouched(reaction)}
						onPlayCommand={
							onPlayCommand
								? (commandNode: Node, openOptions: boolean) =>
										onPlayCommand(getInfo(commandNode, openOptions))
								: undefined
						}
						onSelectCommand={
							onSelectCommand
								? (commandNode: Node | null) =>
										onSelectCommand(commandNode ? getInfo(commandNode, false) : null)
								: undefined
						}
						onLivePreviewCommand={
							onLivePreviewCommand
								? (commandNode: Node, command: Model.MapObjectCommand | null, isNew: boolean) =>
										onLivePreviewCommand(getInfo(commandNode, false, isNew), command)
								: undefined
						}
					/>
				</Flex>
			);
		};

		const updateReactionsTab = (nodes: Node[], state: Model.MapObjectState | null) => {
			if (state) {
				setTabTitles(nodes.map((node) => node.content));
				setTabTitleSuffixes(
					nodes.map((node) => getReactionTabSuffix(node.content as Model.MapObjectEvent, state, nodes)),
				);
				setTabContents(
					nodes.map((node, index) =>
						renderReaction(node.content as Model.MapObjectEvent, state, nodes, index),
					),
				);
			}
		};

		const handleChangeBlockingHero = (b: boolean) => {
			setBlockingHero(b);
			if (selectedEvent && selectedState) {
				const { reaction, parentReaction, isInherited } = getReactionInfo(selectedEvent, selectedState);
				if (reaction) {
					if (isInherited) {
						handleOverrideReaction(reaction, parentReaction!.reaction, events, selectedState);
					}
					reaction.blockingHero = b;
					setBlockingHero(b);
					markReactionTouched(reaction);
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
				setBlockingHero(
					(selectedEvent ? getDisplayedReaction(selectedEvent, state)?.blockingHero : false) ?? false,
				);
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
				reaction.inherit = true;
				event.reactions.set(id, reaction);
				handleUpdateEvents();
			}
		};

		const handleEventListUpdated = () => {
			resync(states, events, properties);
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
				reaction.inherit = true;
				reactions.set(id, reaction);
			}
		};

		const handleSelectedItemEvent = (node: Node | null) => {
			const event = (node?.content as Model.MapObjectEvent) ?? null;
			setSelectedEvent(event);
			if (event) {
				setBlockingHero(
					(selectedState ? getDisplayedReaction(event, selectedState)?.blockingHero : false) ?? false,
				);
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
				setLights(Node.createList(state.lights ?? []));
				onUpdateStateGraphics?.(state);
			} else {
				setLights([]);
			}
			updateReactionsTab(newEvents ?? events, state);
		};

		const handleChangeGraphicsKind = (kind: number) => {
			setGraphicOptions({
				...graphicOptions,
				graphicsKind: kind,
			});
			selectedState!.graphicsKind = kind;
			markTouched(STATE_OVERRIDE_GROUP.GRAPHICS);
			handleUpdateStates();
			onUpdateStateGraphics?.(selectedState!);
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
			markTouched(STATE_OVERRIDE_GROUP.GRAPHICS);
			setGraphicOptions({
				graphicsKind: kind,
				graphicsID: id,
				graphicsIndexX: selectedState!.graphicsIndexX,
				graphicsIndexY: selectedState!.graphicsIndexY,
				rectTileset: selectedState!.rectTileset,
			});
			handleUpdateStates();
			onUpdateStateGraphics?.(selectedState);
		};

		const handleChangeObjectMovingKind = (movingKind: OBJECT_MOVING_KIND) => {
			setObjectMovingKind(movingKind);
			selectedState!.objectMovingKind = movingKind;
			if (movingKind !== OBJECT_MOVING_KIND.ROUTE) {
				selectedState!.eventCommandRoute = null;
				setEventCommandRoute(null);
			}
			markTouched(STATE_OVERRIDE_GROUP.MOVING);
			handleUpdateStates();
		};

		const handleClickEditRoute = () => {
			setIsDialogCommandMoveObjectOpen(true);
		};

		const handleAcceptEditRoute = (command: Model.MapObjectCommand) => {
			selectedState!.eventCommandRoute = command;
			setEventCommandRoute(command);
			markTouched(STATE_OVERRIDE_GROUP.MOVING);
			handleUpdateStates();
		};

		const handleChangeSpeedID = (speedID: number) => {
			setSpeedID(speedID);
			selectedState!.speedID = speedID;
			markTouched(STATE_OVERRIDE_GROUP.MOVING);
			handleUpdateStates();
		};

		const handleChangeFrequencyID = (frequencyID: number) => {
			setFrequencyID(frequencyID);
			selectedState!.frequencyID = frequencyID;
			markTouched(STATE_OVERRIDE_GROUP.MOVING);
			handleUpdateStates();
		};

		const handleChangeMoveAnimation = (moveAnimation: boolean) => {
			setMoveAnimation(moveAnimation);
			selectedState!.moveAnimation = moveAnimation;
			markTouched(STATE_OVERRIDE_GROUP.OPTIONS);
			handleUpdateStates();
		};

		const handleChangeStopAnimation = (stopAnimation: boolean) => {
			setStopAnimation(stopAnimation);
			selectedState!.stopAnimation = stopAnimation;
			markTouched(STATE_OVERRIDE_GROUP.OPTIONS);
			handleUpdateStates();
			onUpdateStateGraphics?.(selectedState!);
		};

		const handleChangeClimbAnimation = (climbAnimation: boolean) => {
			setClimbAnimation(climbAnimation);
			selectedState!.climbAnimation = climbAnimation;
			markTouched(STATE_OVERRIDE_GROUP.OPTIONS);
			handleUpdateStates();
		};

		const handleChangeDirectionFix = (directionFix: boolean) => {
			setDirectionFix(directionFix);
			selectedState!.directionFix = directionFix;
			markTouched(STATE_OVERRIDE_GROUP.OPTIONS);
			handleUpdateStates();
		};

		const handleChangeThrough = (through: boolean) => {
			setThrough(through);
			selectedState!.through = through;
			markTouched(STATE_OVERRIDE_GROUP.OPTIONS);
			handleUpdateStates();
		};

		const handleChangeSetWithCamera = (setWithCamera: boolean) => {
			setSetWithCamera(setWithCamera);
			selectedState!.setWithCamera = setWithCamera;
			markTouched(STATE_OVERRIDE_GROUP.OPTIONS);
			handleUpdateStates();
			onUpdateStateGraphics?.(selectedState!);
		};

		const handleChangePixelOffset = (pixelOffset: boolean) => {
			setPixelOffset(pixelOffset);
			selectedState!.pixelOffset = pixelOffset;
			markTouched(STATE_OVERRIDE_GROUP.OPTIONS);
			handleUpdateStates();
			onUpdateStateGraphics?.(selectedState!);
		};

		const handleChangeKeepPosition = (keepPosition: boolean) => {
			setKeepPosition(keepPosition);
			selectedState!.keepPosition = keepPosition;
			markTouched(STATE_OVERRIDE_GROUP.OPTIONS);
			handleUpdateStates();
		};

		const handleChangeDetectionCheck = (isChecked: boolean) => {
			if (isChecked) {
				setIsDialogCommandSendEventOpen(true);
			} else {
				selectedState!.eventCommandDetection = null;
				setEventCommandDetection(null);
				markTouched(STATE_OVERRIDE_GROUP.DETECTION);
				handleUpdateStates();
			}
		};

		const handleAcceptDetection = (command: Model.MapObjectCommand) => {
			selectedState!.eventCommandDetection = command;
			setEventCommandDetection(command);
			markTouched(STATE_OVERRIDE_GROUP.DETECTION);
			handleUpdateStates();
		};

		const handleClickDetection = () => {
			setIsDialogCommandSendEventOpen(true);
		};

		const handleClickUpdateTransformations = () => {
			setIsDialogTransformationsOpen(true);
		};

		const handleChangeOptionsOpened = async (isOpen: boolean) => {
			Project.current!.settings.mapObjectOptionsOpened = isOpen;
			await Project.current!.settings.save();
		};

		const handleChangeLightsOpened = async (isOpen: boolean) => {
			Project.current!.settings.mapObjectLightsOpened = isOpen;
			await Project.current!.settings.save();
		};

		const accept = async () => {
			object.name = statesRef.current.name;
			object.commonModelID = statesRef.current.modelID;
			object.onlyOneEventPerFrame = statesRef.current.onlyOneEventPerFrame;
			object.onlyOneEventPerFrameOverride = statesRef.current.onlyOneEventPerFrameOverride;
			const parent = ModelInheritance.resolveModel(statesRef.current.modelID);
			object.states = ModelInheritance.getOwnStatesForSave(
				Node.createListFromNodes(statesRef.current.states),
				parent,
			);
			object.events = ModelInheritance.getOwnEventsForSave(
				Node.createListFromNodes(statesRef.current.events),
				parent,
			);
			object.properties = ModelInheritance.getOwnPropertiesForSave(
				Node.createListFromNodes(statesRef.current.properties),
				parent,
			);
		};

		const getEditedObject = () => {
			const editedObject = object.clone();
			editedObject.name = statesRef.current.name;
			editedObject.commonModelID = statesRef.current.modelID;
			editedObject.onlyOneEventPerFrame = statesRef.current.onlyOneEventPerFrame;
			editedObject.onlyOneEventPerFrameOverride = statesRef.current.onlyOneEventPerFrameOverride;
			editedObject.states = Node.createListFromNodes(statesRef.current.states);
			editedObject.events = Node.createListFromNodes(statesRef.current.events);
			editedObject.properties = Node.createListFromNodes(statesRef.current.properties);
			return editedObject;
		};

		useImperativeHandle(ref, () => ({
			initialize,
			reset,
			accept,
			getEditedObject,
		}));

		useEffect(() => {
			statesRef.current = {
				name,
				modelID,
				onlyOneEventPerFrame,
				onlyOneEventPerFrameOverride,
				states,
				events,
				properties,
			};
		}, [name, modelID, onlyOneEventPerFrame, onlyOneEventPerFrameOverride, states, events, properties]);

		useEffect(() => {
			initialize();
			if (saveOnDestruction) {
				return () => {
					accept().catch(console.error);
				};
			}
		}, []);

		const parent = getParent();
		const parentID = getParentID();
		const selectedParentState = selectedState ? ModelInheritance.findParentState(selectedState, parent) : null;
		const selectedStateSourceName =
			selectedState && selectedParentState
				? getModelName(ModelInheritance.getStateSourceID(selectedState, parent, parentID))
				: '';

		const isGroupInherited = (group: STATE_OVERRIDE_GROUP) =>
			!!selectedParentState && !!selectedState && !selectedState.isOverridden(group);

		const getGroupClassName = (group: STATE_OVERRIDE_GROUP) =>
			Utils.getClassName({ inheritedValues: isGroupInherited(group) });

		const renderGroupIndicator = (group: STATE_OVERRIDE_GROUP) =>
			selectedState && selectedParentState ? (
				<OverrideIndicator
					isOverridden={selectedState.isOverridden(group)}
					sourceName={selectedStateSourceName}
					onRevert={() => handleRevertGroup(group)}
				/>
			) : null;

		const getStateText = (node: Node): ReactNode => {
			if (!parent || !(node.content instanceof Model.MapObjectState)) {
				return undefined;
			}
			const state = node.content as Model.MapObjectState;
			return (
				<InheritanceText
					text={node.toString()}
					origin={ModelInheritance.getStateOrigin(state, parent)}
					sourceName={getModelName(ModelInheritance.getStateSourceID(state, parent, parentID))}
				/>
			);
		};

		const getEventText = (node: Node): ReactNode => {
			if (!parent || !(node.content instanceof Model.MapObjectEvent)) {
				return undefined;
			}
			const event = node.content as Model.MapObjectEvent;
			return (
				<InheritanceText
					text={node.toString()}
					origin={ModelInheritance.getEventOrigin(event, parent)}
					sourceName={getModelName(ModelInheritance.getEventSourceID(event, parent, parentID))}
				/>
			);
		};

		const getPropertyText = (node: Node): ReactNode => {
			if (!(node.content instanceof Model.MapObjectProperty)) {
				return undefined;
			}
			const property = node.content as Model.MapObjectProperty;
			if (!parent) {
				return property.toStringWithInitialValue();
			}
			return (
				<InheritanceText
					text={property.toStringWithInitialValue()}
					origin={ModelInheritance.getPropertyOrigin(property, parent)}
					sourceName={getModelName(ModelInheritance.getPropertySourceID(property, parent, parentID))}
				/>
			);
		};

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
								disabledIds={getDisabledModelIds()}
								displayIDs
							/>
						</Flex>
					</Flex>
					<Flex columnMobile one spacedLarge>
						<Flex one spaced className={Utils.getClassName({ visibilityHidden: !selectedState })}>
							<Flex column one spaced>
								<Tab
									titles={tabTitles}
									setTitles={setTabTitles}
									titleSuffixes={tabTitleSuffixes}
									contents={tabContents}
									setContents={setTabContents}
									forcedCurrentIndex={forcedCurrentIndexTab}
									setForcedCurrentIndex={setForcedCurrentIndexTab}
									onCurrentIndexChanged={handleCurrentIndexTabChanged}
								/>
								<Checkbox
									className={Utils.getClassName({
										inheritedValues:
											!!selectedEvent &&
											!!selectedState &&
											getReactionInfo(selectedEvent, selectedState).isInherited,
									})}
									isChecked={blockingHero}
									onChange={handleChangeBlockingHero}
									title={t('tooltip.block.hero.during.reaction')}
								>
									{t('block.hero.during.reaction')}
								</Checkbox>
							</Flex>
						</Flex>
						<Flex column spaced>
							<Flex columnMobile one spacedLarge>
								<Flex column one spaced>
									<Flex centerV spaced>
										{t('states')}:
										<Flex one />
										{selectedState && selectedParentState && (
											<Button
												small
												icon={<FaUndo />}
												disabled={selectedState.overrides.length === 0}
												onClick={handleRevertState}
												title={t('revert.all.to.model')}
											/>
										)}
									</Flex>
									<Flex one zeroHeight>
										<Tree
											constructorType={Model.MapObjectState}
											list={states}
											getText={getStateText}
											canDelete={canDeleteState}
											onSelectedItem={handleSelectedItemState}
											onCreateItem={handleCreateState}
											onListUpdated={handleStatesListUpdated}
											onPasteItem={handlePasteState}
											forcedCurrentSelectedItemID={forcedCurrentSelectedIDState}
											setForcedCurrentSelectedItemID={setForcedCurrentSelectedIDState}
											noFirstSelection={initialStateID !== undefined}
											minWidth={TREES_MIN_WIDTH}
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
											getText={getPropertyText}
											canDelete={canDeleteProperty}
											minWidth={TREES_MIN_WIDTH}
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
										getText={getEventText}
										canDelete={canDeleteEvent}
										onSelectedItem={handleSelectedItemEvent}
										onListUpdated={handleEventListUpdated}
										onCreateItem={handleCreateEvent}
										forcedCurrentSelectedItemIndex={forcedCurrentSelectedIndexEvent}
										setForcedCurrentSelectedItemIndex={setForcedCurrentSelectedIndexEvent}
										noFirstSelection={initialEventIndex !== undefined}
										doNotGenerateIDOnPaste
										byIndex
										cannotUpdateListSize
										canBeEmpty
									/>
								</Flex>
							</Flex>
							{!hideStateValues && selectedState && (
								<Flex spaced>
									<Flex column spaced>
										<Flex one className={getGroupClassName(STATE_OVERRIDE_GROUP.GRAPHICS)}>
											<GraphicsSelector
												sceneID='dialog-map-object'
												options={graphicOptions}
												titleSuffix={renderGroupIndicator(STATE_OVERRIDE_GROUP.GRAPHICS)}
												onChangeGraphicsKind={handleChangeGraphicsKind}
												onUpdateGraphics={handleUpdateGraphics}
											/>
										</Flex>
									</Flex>
									<Flex column one spaced>
										<Groupbox
											title={
												<Flex centerV spaced>
													{t('moving')}
													{renderGroupIndicator(STATE_OVERRIDE_GROUP.MOVING)}
												</Flex>
											}
										>
											<div className={getGroupClassName(STATE_OVERRIDE_GROUP.MOVING)}>
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
											</div>
										</Groupbox>
										<Flex centerV spaced>
											<Button
												fillWidth
												className={getGroupClassName(STATE_OVERRIDE_GROUP.TRANSFORM)}
												onClick={handleClickUpdateTransformations}
											>
												{t('update.transformations')}...
											</Button>
											{renderGroupIndicator(STATE_OVERRIDE_GROUP.TRANSFORM)}
										</Flex>
									</Flex>
								</Flex>
							)}
							{!hideStateValues && selectedState && (
								<Flex column spaced>
									<Groupbox
										canExpand
										initialClose={!Project.current!.settings.mapObjectLightsOpened}
										onChangeOpen={handleChangeLightsOpened}
										title={
											<Flex spaced>
												Lights
												{lights.length === 0 ? (
													<span className='lightStatusEmpty'>(none)</span>
												) : (
													<span>({lights.length})</span>
												)}
												{renderGroupIndicator(STATE_OVERRIDE_GROUP.LIGHTS)}
											</Flex>
										}
									>
										<Flex one className={getGroupClassName(STATE_OVERRIDE_GROUP.LIGHTS)}>
											<Tree
												list={lights}
												constructorType={Model.MapObjectLight}
												onListUpdated={handleUpdateLights}
												onDialogModelLivePreview={handleLivePreviewLight}
												minHeight={TREES_MIN_HEIGHT / 2}
												applyDefault
												canBeEmpty
											/>
										</Flex>
									</Groupbox>
									<Groupbox
										title={
											<Flex centerV spaced>
												{t('options')}
												{renderGroupIndicator(STATE_OVERRIDE_GROUP.OPTIONS)}
											</Flex>
										}
										canExpand
										initialClose={!Project.current!.settings.mapObjectOptionsOpened}
										onChangeOpen={handleChangeOptionsOpened}
									>
										<Flex spacedLarge className={getGroupClassName(STATE_OVERRIDE_GROUP.OPTIONS)}>
											<Flex column>
												<Checkbox
													isChecked={moveAnimation}
													onChange={handleChangeMoveAnimation}
												>
													{t('move.animation')}
												</Checkbox>
												<Checkbox
													isChecked={stopAnimation}
													onChange={handleChangeStopAnimation}
												>
													{t('stop.animation')}
												</Checkbox>
												<Checkbox
													isChecked={climbAnimation}
													onChange={handleChangeClimbAnimation}
												>
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
												<Checkbox
													isChecked={setWithCamera}
													onChange={handleChangeSetWithCamera}
												>
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
							)}
						</Flex>
					</Flex>
					<Flex spacedLarge>
						<Flex columnMobile one spaced>
							<Flex centerV spaced>
								<Checkbox
									className={Utils.getClassName({
										inheritedValues: !!parent && !onlyOneEventPerFrameOverride,
									})}
									isChecked={
										parent && !onlyOneEventPerFrameOverride
											? parent.onlyOneEventPerFrame
											: onlyOneEventPerFrame
									}
									onChange={handleChangeOnlyOneEventPerFrame}
									title={t('tooltip.only.one.event.per.frame')}
								>
									{t('only.one.event.per.frame')}
								</Checkbox>
								{parent && (
									<OverrideIndicator
										isOverridden={onlyOneEventPerFrameOverride}
										sourceName={getModelName(parentID)}
										onRevert={handleRevertOnlyOneEventPerFrame}
									/>
								)}
							</Flex>
						</Flex>
						{!hideStateValues && selectedState && (
							<Flex centerV spaced>
								<Flex centerV spaced className={getGroupClassName(STATE_OVERRIDE_GROUP.DETECTION)}>
									<Checkbox isChecked={!!eventCommandDetection} onChange={handleChangeDetectionCheck}>
										{t('detection')}
									</Checkbox>
									<Button disabled={eventCommandDetection === null} onClick={handleClickDetection}>
										...
									</Button>
								</Flex>
								{renderGroupIndicator(STATE_OVERRIDE_GROUP.DETECTION)}
							</Flex>
						)}
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
						opacity={selectedState.opacity}
						layer={selectedState.layer}
						onAccept={() => {
							markTouched(STATE_OVERRIDE_GROUP.TRANSFORM);
							handleUpdateStates();
						}}
						onLiveChange={() => {
							handleUpdateStates();
							onUpdateStateGraphics?.(selectedState);
						}}
					/>
				)}
			</>
		);
	},
);

PanelMapObject.displayName = 'PanelMapObject';

export default PanelMapObject;
