/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import InputText from '../InputText';
import { Model } from '../../Editor';
import { OBJECT_MOVING_KIND, Utils } from '../../common';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import Tree from '../Tree';
import Groupbox from '../Groupbox';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Tab from '../Tab';
import GraphicsSelector from '../GraphicsSelector';
import Form from '../Form';
import { Node, Project } from '../../core';
import useStateBool from '../../hooks/useStateBool';
import { EventCommand, MapObjectState } from '../../models';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	object: Model.CommonObject;
	onAccept: () => Promise<void>;
};

function DialogMapObject({ needOpen, setNeedOpen, object, onAccept }: Props) {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
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
	//const [graphicsID, setGraphicsID] = useStateNumber();
	//const [graphicsIndexX, setGraphicsIndexX] = useStateNumber();
	//const [graphicsIndexY, setGraphicsIndexY] = useStateNumber();
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
	const [eventCommandDetection, setEventCommandDetection] = useState<EventCommand | null>(null);
	const [forcedCurrentIndexTab, setForcedCurrentIndexTab] = useState<number | null>(null);
	const [forcedCurrentSelectedIndexEvent, setForcedCurrentSelectedIndexEvent] = useState<number | null>(null);

	const initialize = () => {
		setName(object.name);
		setModelID(object.commonModelID);
		const newStates = Node.createList(object.states);
		const newEvents = Node.createList(object.events);
		const newProperties = Node.createList(object.properties);
		updateReactionsTab(newEvents);
		setStates(newStates);
		setEvents(newEvents);
		setProperties(newProperties);
		setOnlyOneEventPerFrame(object.onlyOneEventPerFrame);
		setCanBeTriggeredAnotherObject(object.canBeTriggeredAnotherObject);
		handleChangeState(object.states.length > 0 ? object.states[0] : null);
		Project.current!.currentMapObjectStates = newStates;
		Project.current!.currentMapObjectEvents = newEvents;
		Project.current!.currentMapObjectProperties = newProperties;
	};

	const getObjectsList = () => [Model.Base.create(-1, t('none')), ...Project.current!.commonEvents.commonObjects];

	const updateReactionsTab = (nodes: Node[]) => {
		setTabTitles(nodes.map((node) => node.content));
		setTabContents(nodes.map((node, index) => <Tree key={index} list={[]}></Tree>));
	};

	const handleCurrentIndexTabChanged = (index: number, model: Model.Base, isClick: boolean) => {
		if (isClick) {
			setForcedCurrentSelectedIndexEvent(index);
		}
	};

	const handleSelectedItemState = (node: Node | null) => {
		handleChangeState(node && node.content.id !== -1 ? (node.content as MapObjectState) : null);
	};

	const handleCreateState = (node: Node) => {
		(node.content as Model.MapObjectState).initialize();
	};

	const handleEventListUpdated = () => {
		updateReactionsTab(events);
	};

	const handleCreateEvent = (node: Node) => {
		const reactions = new Map<number, Model.MapObjectReaction>();
		(node.content as Model.MapObjectEvent).reactions = reactions;
		for (const state of states) {
			const reaction = new Model.MapObjectReaction();
			reaction.commands = [];
			reaction.blockingHero = true;
			reactions.set(state.content.id, reaction);
		}
	};

	const handleSelectedItemEvent = (node: Node | null) => {
		setForcedCurrentIndexTab(node ? events.indexOf(node) : -1);
	};

	const handleChangeState = (state: MapObjectState | null) => {
		setSelectedState(state);
		if (state) {
			//setGraphicsID(state.graphicsID);
			//setGraphicsIndexX(state.graphicsIndexX);
			//setGraphicsIndexY(state.graphicsIndexY);
			setGraphicsKind(state.graphicsKind);
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
	};

	const handleChangeGraphicsKind = (kind: number) => {
		setGraphicsKind(kind);
		selectedState!.graphicsKind = kind;
	};

	const handleChangeObjectMovingKind = (movingKind: number) => {
		setObjectMovingKind(movingKind);
		selectedState!.objectMovingKind = movingKind;
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
		setEventCommandDetection(isChecked ? new EventCommand() : null);
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
		if (needOpen) {
			setNeedOpen(false);
			setFocustFirst(true);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

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
			<div className='flex-column fill-height gap-small'>
				<div className='flex-center-v gap-small'>
					<div className='flex-center-v gap-small'>
						{t('name')}:
						<InputText
							value={name}
							onChange={setName}
							focusFirst={focusFirst}
							setFocustFirst={setFocustFirst}
						/>
						ID: {Utils.formatNumberID(object.id)}
					</div>
					<div className='flex-one' />
					<div className='flex-center-v gap-small'>
						{t('model')}:
						<Dropdown selectedID={modelID} onChange={setModelID} options={getObjectsList()} displayIDs />
					</div>
				</div>
				<div className='flex-one gap-medium'>
					<div
						className={Utils.getClassName(
							[[!selectedState, 'visibility-hidden']],
							['flex-column', 'flex-one', 'gap-small']
						)}
					>
						<div className='flex-one'>
							<Tab
								titles={tabTitles}
								setTitles={setTabTitles}
								contents={tabContents}
								setContents={setTabContents}
								forcedCurrentIndex={forcedCurrentIndexTab}
								setForcedCurrentIndex={setForcedCurrentIndexTab}
								onCurrentIndexChanged={handleCurrentIndexTabChanged}
							/>
						</div>
						<Checkbox isChecked={false}>{t('block.hero.when.reaction')}</Checkbox>
					</div>
					<div className='flex-column gap-small'>
						<div className='flex-one gap-medium'>
							<div className='flex-column flex-one gap-small'>
								{t('states')}:
								<div className='flex-one zero-height'>
									<Tree
										constructorType={Model.MapObjectState}
										list={states}
										onSelectedItem={handleSelectedItemState}
										onCreateItem={handleCreateState}
									/>
								</div>
							</div>
							<div className='flex-column flex-one gap-small'>
								{t('properties')}:
								<div className='flex-one zero-height'>
									<Tree list={properties} constructorType={Model.MapObjectProperty} />
								</div>
							</div>
						</div>
						<div className='flex-column flex-one gap-small'>
							{t('events')}:
							<div className='flex-one zero-height'>
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
							</div>
						</div>
						<div
							className={Utils.getClassName(
								[[!selectedState, 'visibility-hidden']],
								['flex', 'gap-small']
							)}
						>
							<div className='flex-column gap-small'>
								{t('graphics')}:
								<GraphicsSelector />
								<Dropdown
									selectedID={graphicsKind}
									onChange={handleChangeGraphicsKind}
									options={Model.Base.GRAPHICS_OPTIONS}
									translateOptions
								/>
							</div>
							<div className='flex-column flex-one gap-small'>
								<Groupbox title={t('moving')}>
									<Form>
										<td>{t('type')}:</td>
										<td>
											<Dropdown
												selectedID={objectMovingKind}
												onChange={handleChangeObjectMovingKind}
												options={Model.Base.OBJECT_MOVING_OPTIONS}
												translateOptions
											/>
										</td>
										<td></td>
										<td>
											<Button disabled={graphicsKind !== OBJECT_MOVING_KIND.ROUTE}>
												{t('edit.route')}...
											</Button>
										</td>
										<td>{t('speed')}:</td>
										<td>
											<Dropdown
												selectedID={speedID}
												onChange={handleChangeSpeedID}
												options={Model.Base.GRAPHICS_OPTIONS}
												translateOptions
											/>
										</td>
										<td>{t('frequency')}:</td>
										<td>
											<Dropdown
												selectedID={frequencyID}
												onChange={handleChangeFrequencyID}
												options={Model.Base.GRAPHICS_OPTIONS}
												translateOptions
											/>
										</td>
									</Form>
								</Groupbox>
								<Button>{t('edit.transformations')}...</Button>
							</div>
						</div>
						<div className={Utils.getClassName([[!selectedState, 'visibility-hidden']], ['flex'])}>
							<Groupbox title={t('options')}>
								<div className='flex gap-medium'>
									<div className='flex-column'>
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
									</div>
									<div className='flex-column'>
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
									</div>
									<div className='flex-one' />
								</div>
							</Groupbox>
						</div>
					</div>
				</div>
				<div className='flex'>
					<div className='flex-one gap-small'>
						<Checkbox isChecked={onlyOneEventPerFrame} onChange={setOnlyOneEventPerFrame}>
							{t('only.one.event.per.frame')}
						</Checkbox>
						<Checkbox isChecked={canBeTriggeredAnotherObject} onChange={setCanBeTriggeredAnotherObject}>
							{t('can.be.triggered.another.object')}
						</Checkbox>
					</div>
					<div className={Utils.getClassName([[!selectedState, 'visibility-hidden']], ['flex'])}>
						<Checkbox isChecked={!!eventCommandDetection} onChange={handleChangeDetectionCheck}>
							<div className='flex-center-v gap-small'>
								{t('detection')} <Button disabled={eventCommandDetection === null}>...</Button>
							</div>
						</Checkbox>
					</div>
				</div>
			</div>
		</Dialog>
	);
}

export default DialogMapObject;
