/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrayUtils, COMMAND_MOVE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, Utils } from '../../../common';
import { Node } from '../../../core';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import DialogCommandMoveObjectChangeGraphics from './DialogCommandMoveObjectChangeGraphics';
import DialogCommandMoveObjectChangeSpeedFrequency from './DialogCommandMoveObjectChangeSpeedFrequency';
import DialogCommandMoveObjectJump from './DialogCommandMoveObjectJump';
import DialogCommandWait from './DialogCommandWait';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandMoveObject({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isDialogJumpOpen, setIsDialogJumpOpen] = useState(false);
	const [isDialogChangeSpeedOpen, setIsDialogChangeSpeedOpen] = useState(false);
	const [isDialogChangeFrequencyOpen, setIsDialogChangeFrequencyOpen] = useState(false);
	const [isDialogChangeGraphicsOpen, setIsDialogChangeGraphicsOpen] = useState(false);
	const [isDialogWaitOpen, setIsDialogWaitOpen] = useState(false);
	const [objectID] = useStateDynamicValue();
	const [commands, setCommands] = useState<Node[]>([]);
	const [isIgnoreIfImpossible, setIsIgnoreIfImpossible] = useStateBool();
	const [isWaitEnd, setIsWaitEnd] = useStateBool();
	const [isWithCameraOrientation, setIsWithCameraOrientation] = useStateBool();
	const [squareStepMoveType, setSquareStepMoveType] = useStateNumber();
	const [objectOptionsType, setObjectOptionsType] = useStateNumber();
	const [isPermanent, setIsPermanent] = useStateBool();
	const [forcedCurrentSelectedItemIndex, setForcedCurrentSelectedItemIndex] = useState<number | null>(null);
	const [currentSelectedItemIndex, setCurrentSelectedItemIndex] = useStateNumber();
	const [jump, setJump] = useState<Model.MapObjectCommandMove>(
		Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.JUMP)
	);
	const [speed, setSpeed] = useState<Model.MapObjectCommandMove>(
		Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.CHANGE_SPEED)
	);
	const [frequency, setFrequency] = useState<Model.MapObjectCommandMove>(
		Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.CHANGE_FREQUENCY)
	);
	const [changeGraphics, setChangeGraphics] = useState<Model.MapObjectCommandMove>(
		Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.CHANGE_GRAPHICS)
	);

	const objectsList = Scene.Map.getCurrentMapObjectsList();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			objectID.updateCommand(list, iterator);
			setIsIgnoreIfImpossible(Utils.initializeBoolCommand(list, iterator));
			setIsWaitEnd(Utils.initializeBoolCommand(list, iterator));
			setIsWithCameraOrientation(Utils.initializeBoolCommand(list, iterator));
			const commandsList: Node[] = [];
			while (iterator.i < list.length) {
				const move = new Model.MapObjectCommandMove();
				move.initialize(list, iterator);
				commandsList.push(Node.create(move));
			}
			setCommands(commandsList);
		} else {
			objectID.updateToDefaultDatabase(-1);
			setCommands(Node.createList([], false));
			setIsIgnoreIfImpossible(false);
			setIsWaitEnd(true);
			setIsWithCameraOrientation(false);
		}
		setSquareStepMoveType(0);
		setObjectOptionsType(0);
		setIsPermanent(false);
		setForcedCurrentSelectedItemIndex(0);
		setCurrentSelectedItemIndex(0);
		setIsDialogJumpOpen(false);
	};

	const addCommand = (command: Model.MapObjectCommandMove) => {
		const newIndex = currentSelectedItemIndex === -1 ? commands.length : currentSelectedItemIndex + 1;
		ArrayUtils.insertAt(commands, newIndex, Node.create(command));
		setCommands([...commands]);
		setForcedCurrentSelectedItemIndex(newIndex);
	};

	const addMoveStepSquare = (kind: COMMAND_MOVE_KIND) => {
		const command = Model.MapObjectCommandMove.createMove(kind);
		command.command.push('' + squareStepMoveType);
		addCommand(command);
	};

	const addMoveEmpty = (kind: COMMAND_MOVE_KIND) => {
		const command = Model.MapObjectCommandMove.createMove(kind);
		addCommand(command);
	};

	const addMoveOnOffPermanent = (kind: COMMAND_MOVE_KIND) => {
		const command = Model.MapObjectCommandMove.createMove(kind);
		command.command.push('' + Utils.boolToNum(objectOptionsType === 0));
		command.command.push('' + Utils.boolToNum(isPermanent));
		addCommand(command);
	};

	const handleSelectedItem = (node: Node | null) => {
		setCurrentSelectedItemIndex(node ? commands.indexOf(node) : commands.length - 1);
	};

	const handleClickJump = () => {
		setIsDialogJumpOpen(true);
	};

	const handleAcceptJump = () => {
		ArrayUtils.insertAt(jump.command, 1, '' + squareStepMoveType);
		addCommand(jump);
		setJump(Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.JUMP));
	};

	const handleClickChangeSpeed = () => {
		setIsDialogChangeSpeedOpen(true);
	};

	const handleAcceptChangeSpeed = () => {
		ArrayUtils.insertAt(speed.command, 1, '' + Utils.boolToNum(isPermanent));
		addCommand(speed);
		setSpeed(Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.CHANGE_SPEED));
	};

	const handleClickChangeFrequency = () => {
		setIsDialogChangeFrequencyOpen(true);
	};

	const handleAcceptChangeFrequency = () => {
		ArrayUtils.insertAt(frequency.command, 1, '' + Utils.boolToNum(isPermanent));
		addCommand(frequency);
		setFrequency(Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.CHANGE_FREQUENCY));
	};

	const handleClickChangeGraphics = () => {
		setIsDialogChangeGraphicsOpen(true);
	};

	const handleAcceptChangeGraphics = () => {
		ArrayUtils.insertAt(changeGraphics.command, 1, '' + Utils.boolToNum(isPermanent));
		addCommand(changeGraphics);
		setChangeGraphics(Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.CHANGE_GRAPHICS));
	};

	const handleClickWait = () => {
		setIsDialogWaitOpen(true);
	};

	const handleAcceptWait = (command: Model.MapObjectCommand) => {
		const move = Model.MapObjectCommandMove.createMove(COMMAND_MOVE_KIND.WAIT);
		move.command.push(...(command.command as string[]));
		addCommand(move);
	};

	const handleClickPlaySound = () => {
		// TODO
	};

	const handleClickScript = () => {
		// TODO
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		objectID.getCommand(newList);
		newList.push(Utils.boolToNum(isIgnoreIfImpossible));
		newList.push(Utils.boolToNum(isWaitEnd));
		newList.push(Utils.boolToNum(isWithCameraOrientation));
		for (const node of commands) {
			newList.push(...(node.content as Model.MapObjectCommandMove).command);
		}
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.MOVE_OBJECT, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<>
			<Dialog
				title={`${t('move.object')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				initialWidth='750px'
			>
				<Flex column spacedLarge>
					<Flex spaced>
						<div>{t('object.id')}:</div>
						<DynamicValueSelector
							value={objectID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={objectsList}
						/>
					</Flex>
					<Flex spaced>
						<Flex one fillWidth>
							<Flex column spaced one fillWidth>
								<Flex one zeroHeight>
									<Tree
										list={commands}
										constructorType={Model.MapObjectCommandMove}
										forcedCurrentSelectedItemIndex={forcedCurrentSelectedItemIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentSelectedItemIndex}
										onSelectedItem={handleSelectedItem}
										byIndex
									/>
								</Flex>
								<Checkbox isChecked={isIgnoreIfImpossible} onChange={setIsIgnoreIfImpossible}>
									{t('ignore.if.impossible')}
								</Checkbox>
								<Checkbox isChecked={isWaitEnd} onChange={setIsWaitEnd}>
									{t('wait.end')}
								</Checkbox>
								<Checkbox isChecked={isWithCameraOrientation} onChange={setIsWithCameraOrientation}>
									{t('with.camera.orientation')}
								</Checkbox>
							</Flex>
						</Flex>
						<Groupbox title={t('moves')}>
							<Flex spacedLarge>
								<Flex column spaced>
									<div>{t('step.square.moves')}:</div>
									<Dropdown
										selectedID={squareStepMoveType}
										onChange={setSquareStepMoveType}
										options={Model.Base.SQUARE_STEP_OPTIONS}
										translateOptions
									/>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_NORTH)}>
										{t('1.to.north')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_SOUTH)}>
										{t('1.to.south')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_WEST)}>
										{t('1.to.west')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_EAST)}>
										{t('1.to.east')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_NORTH_WEST)}>
										{t('1.to.north.west')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_NORTH_EAST)}>
										{t('1.to.north.east')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_SOUTH_WEST)}>
										{t('1.to.south-west')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_SOUTH_EAST)}>
										{t('1.to.south-east')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_RANDOM)}>
										{t('1.to.random')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_HERO)}>
										{t('1.to.hero')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_OPPOSITE_HERO)}>
										{t('1.opposite.to.hero')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_FRONT)}>
										{t('1.in.front')}
									</Button>
									<Button onClick={() => addMoveStepSquare(COMMAND_MOVE_KIND.MOVE_BACK)}>
										{t('1.back')}
									</Button>
									<Button onClick={handleClickJump}>{t('jump')}...</Button>
								</Flex>
								<Flex column spaced>
									<div>{t('change.direction')}:</div>
									<Flex fillSmallSpace />
									<Button onClick={() => addMoveEmpty(COMMAND_MOVE_KIND.TURN_NORTH)}>
										{t('turn.north')}
									</Button>
									<Button onClick={() => addMoveEmpty(COMMAND_MOVE_KIND.TURN_SOUTH)}>
										{t('turn.south')}
									</Button>
									<Button onClick={() => addMoveEmpty(COMMAND_MOVE_KIND.TURN_WEST)}>
										{t('turn.west')}
									</Button>
									<Button onClick={() => addMoveEmpty(COMMAND_MOVE_KIND.TURN_EAST)}>
										{t('turn.east')}
									</Button>
									<Button disabled>Turn to North-West</Button>
									<Button disabled>Turn to North-East</Button>
									<Button disabled>Turn to South-West</Button>
									<Button disabled>Turn to South-East</Button>
									<Button disabled>Turn 45° right</Button>
									<Button disabled>Turn 45° left</Button>
									<Button onClick={() => addMoveEmpty(COMMAND_MOVE_KIND.TURN_90_RIGHT)}>
										{t('turn.90.right')}
									</Button>
									<Button onClick={() => addMoveEmpty(COMMAND_MOVE_KIND.TURN_90_LEFT)}>
										{t('turn.90.left')}
									</Button>
									<Button onClick={() => addMoveEmpty(COMMAND_MOVE_KIND.LOOK_AT_HERO)}>
										{t('look.at.hero')}
									</Button>
									<Button onClick={() => addMoveEmpty(COMMAND_MOVE_KIND.LOOK_AT_HERO_OPPOSITE)}>
										{t('look.at.hero.opposite')}
									</Button>
								</Flex>
								<Flex column spaced>
									<div>{t('change.object.options')}:</div>
									<Flex spaced>
										<Dropdown
											selectedID={objectOptionsType}
											onChange={setObjectOptionsType}
											options={Model.Base.ON_OFF_OPTIONS}
										/>
										<Checkbox isChecked={isPermanent} onChange={setIsPermanent}>
											{t('permanent')}
										</Checkbox>
									</Flex>
									<Button onClick={handleClickChangeSpeed}>{t('change.speed')}...</Button>
									<Button onClick={handleClickChangeFrequency}>{t('change.frequency')}...</Button>
									<Button onClick={() => addMoveOnOffPermanent(COMMAND_MOVE_KIND.MOVE_ANIMATION)}>
										{t('move.animation')}
									</Button>
									<Button onClick={() => addMoveOnOffPermanent(COMMAND_MOVE_KIND.STOP_ANIMATION)}>
										{t('stop.animation')}
									</Button>
									<Button onClick={() => addMoveOnOffPermanent(COMMAND_MOVE_KIND.CLIMB_ANIMATION)}>
										{t('climb.animation')}
									</Button>
									<Button onClick={() => addMoveOnOffPermanent(COMMAND_MOVE_KIND.FIX_DIRECTION)}>
										{t('direction.fix')}
									</Button>
									<Button onClick={() => addMoveOnOffPermanent(COMMAND_MOVE_KIND.THROUGH)}>
										{t('through')}
									</Button>
									<Button onClick={() => addMoveOnOffPermanent(COMMAND_MOVE_KIND.SET_WITH_CAMERA)}>
										{t('set.with.camera')}
									</Button>
									<Button onClick={() => addMoveOnOffPermanent(COMMAND_MOVE_KIND.PIXEL_OFFSET)}>
										{t('pixel.offset')}
									</Button>
									<Button onClick={() => addMoveOnOffPermanent(COMMAND_MOVE_KIND.KEEP_POSITION)}>
										{t('keep.position')}
									</Button>
									<Button onClick={handleClickChangeGraphics}>{t('change.graphics')}...</Button>
									<Button onClick={handleClickWait}>{t('wait')}...</Button>
									<Button onClick={handleClickPlaySound}>{t('play.a.sound')}...</Button>
									<Button onClick={handleClickScript}>{t('script')}...</Button>
								</Flex>
							</Flex>
						</Groupbox>
					</Flex>
				</Flex>
			</Dialog>
			<DialogCommandMoveObjectJump
				isOpen={isDialogJumpOpen}
				setIsOpen={setIsDialogJumpOpen}
				model={jump}
				onAccept={handleAcceptJump}
				isNew
			/>
			<DialogCommandMoveObjectChangeSpeedFrequency
				isOpen={isDialogChangeSpeedOpen}
				setIsOpen={setIsDialogChangeSpeedOpen}
				model={speed}
				onAccept={handleAcceptChangeSpeed}
				isNew
			/>
			<DialogCommandMoveObjectChangeSpeedFrequency
				isOpen={isDialogChangeFrequencyOpen}
				setIsOpen={setIsDialogChangeFrequencyOpen}
				model={frequency}
				onAccept={handleAcceptChangeFrequency}
				isNew
			/>
			<DialogCommandMoveObjectChangeGraphics
				isOpen={isDialogChangeGraphicsOpen}
				setIsOpen={setIsDialogChangeGraphicsOpen}
				model={changeGraphics}
				onAccept={handleAcceptChangeGraphics}
				isNew
			/>
			<DialogCommandWait
				isOpen={isDialogWaitOpen}
				setIsOpen={setIsDialogWaitOpen}
				onAccept={handleAcceptWait}
				onReject={() => {}}
			/>
		</>
	);
}

export default DialogCommandMoveObject;
