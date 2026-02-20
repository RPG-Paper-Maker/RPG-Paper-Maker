/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ANIMATION_EFFECT_CONDITION_KIND, INPUT_TYPE_WIDTH, PICTURE_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import useStateBool from '../../../hooks/useStateBool';
import useStateNumber from '../../../hooks/useStateNumber';
import { Animation, AnimationFrame, AnimationFrameEffect, Base, Picture } from '../../../models';
import AnimationPreviewer from '../../AnimationPreviewer';
import AnimationPreviewerTexture from '../../AnimationPreviewerTexture';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Button from '../../Button';
import DialogAnimationClearFrames from '../../dialogs/DialogAnimationClearFrames';
import DialogAnimationCopyFrames from '../../dialogs/DialogAnimationCopyFrames';
import DialogAnimationCreateTransition from '../../dialogs/DialogAnimationCreateTransition';
import DialogPictures from '../../dialogs/DialogPictures';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputNumber from '../../InputNumber';
import Tab from '../../Tab';
import Tree, { TREES_MIN_WIDTH, TREES_SMALL_MIN_WIDTH } from '../../Tree';

const PanelAnimations = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [isDialogBattlerOpen, setIsDialogBattlerOpen] = useState(false);
	const [isDialogCopyFramesOpen, setIsDialogCopyFramesOpen] = useState(false);
	const [isDialogClearFramesOpen, setIsDialogClearFramesOpen] = useState(false);
	const [isDialogCreateTransitionOpen, setIsDialogcreateTransitionOpen] = useState(false);
	const [animations, setAnimations] = useState<Node[]>([]);
	const [pictureID, setPictureID] = useStateNumber();
	const [positionKind, setPositionKind] = useStateNumber();
	const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
	const [frames, setFrames] = useState<Node[]>([]);
	const [selectedFrame, setSelectedFrame] = useState<AnimationFrame | null>(null);
	const [battlerID, setBattlerID] = useState(1);
	const [rows, setRows] = useStateNumber();
	const [columns, setColumns] = useStateNumber();
	const [selectedColumn, setSelectedColumn] = useState(0);
	const [selectedRow, setSelectedRow] = useState(0);
	const [triggerDraw, setTriggerDraw] = useStateBool();
	const [triggerApplyTexture, setTriggerApplyTexture] = useStateBool();
	const [animationFrameEffects, setAnimationFrameEffects] = useState<Node[]>([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [playingType, setPlayingType] = useStateNumber();

	const titles = useMemo(() => Base.mapListIndex([t('graphics'), t('sound.effects.flashs')]), [t]);

	const isAnimationDisabled = useMemo(
		() => selectedAnimation === null || selectedAnimation.id === -1,
		[selectedAnimation],
	);
	const isFrameDisabled = useMemo(() => selectedFrame === null || selectedFrame.id === -1, [selectedFrame]);

	const initialize = () => {
		setAnimations(Node.createList(Project.current!.animations.list, false));
	};

	const handleSelectAnimation = (node: Node | null) => {
		const animation = (node?.content as Animation) ?? null;
		setSelectedAnimation(animation);
		if (animation) {
			setFrames(Node.createList(animation.frames, false));
			setPictureID(animation.pictureID);
			setPositionKind(animation.positionKind);
			setRows(animation.rows);
			setColumns(animation.cols);
			setSelectedColumn(0);
			setSelectedRow(0);
		}
	};

	const handleListUpdated = () => {
		Project.current!.animations.list = Node.createListFromNodes(animations);
	};

	const handleChangePictureID = (id: number) => {
		setPictureID(id);
		selectedAnimation!.pictureID = id;
	};

	const handleFramesListUpdated = () => {
		if (selectedAnimation) {
			selectedAnimation.frames = Node.createListFromNodes(frames);
		}
	};

	const handleSelectFrame = (node: Node | null) => {
		const frame = (node?.content as AnimationFrame) ?? null;
		setSelectedFrame(frame);
		if (frame) {
			setAnimationFrameEffects(Node.createList(frame.effects, false));
		}
	};

	const handleFrameEffectsUpdated = () => {
		if (selectedFrame) {
			selectedFrame.effects = Node.createListFromNodes(animationFrameEffects);
		}
	};

	const handleClickChangeBattler = () => {
		setIsDialogBattlerOpen(true);
	};

	const handleAcceptChangeBattler = (picture: Picture) => {
		setBattlerID(picture.id);
		setIsDialogBattlerOpen(false);
	};

	const handleTriggerDraw = () => {
		setTriggerDraw((v) => !v);
	};

	const handleClickCopyFrames = () => {
		setIsDialogCopyFramesOpen(true);
	};

	const handleClickClearFrames = () => {
		setIsDialogClearFramesOpen(true);
	};

	const handleClickCreateTransition = () => {
		setIsDialogcreateTransitionOpen(true);
	};

	const handleClickApplyTexture = () => {
		setTriggerApplyTexture((v) => !v);
	};

	const handleClickPlayHit = () => {
		setPlayingType(ANIMATION_EFFECT_CONDITION_KIND.HIT);
		setIsPlaying(true);
	};

	const handleClickPlayMiss = () => {
		setPlayingType(ANIMATION_EFFECT_CONDITION_KIND.MISS);
		setIsPlaying(true);
	};

	const handleClickPlayCrit = () => {
		setPlayingType(ANIMATION_EFFECT_CONDITION_KIND.CRITICAL);
		setIsPlaying(true);
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
	}, []);

	const getGraphicsContent = () => (
		<Flex column spaced fillWidth fillHeight>
			<Flex one spaced>
				<Flex one scrollable>
					<Flex one zeroWidth>
						<Flex column one>
							<Flex one zeroHeight>
								<AnimationPreviewer
									animation={selectedAnimation}
									pictureID={pictureID}
									battlerID={battlerID}
									positionKind={positionKind}
									rows={rows}
									columns={columns}
									currentFrame={selectedFrame}
									selectedColumn={selectedColumn}
									selectedRow={selectedRow}
									triggerDraw={triggerDraw}
									triggerApplyTexture={triggerApplyTexture}
									isPlaying={isPlaying}
									setIsPlaying={setIsPlaying}
									playingType={playingType}
									disabled={isAnimationDisabled || isFrameDisabled}
								/>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Groupbox title={t('options')} disabled={isAnimationDisabled || isFrameDisabled || isPlaying}>
					<Flex column spacedLarge>
						<Button
							onClick={handleClickChangeBattler}
							disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
						>
							{t('change.battler')}...
						</Button>
						<div className='horizontalSeparator' />
						<Flex column spaced>
							<Button
								onClick={handleClickCopyFrames}
								disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
							>
								{t('copy.frames')}...
							</Button>
							<Button
								onClick={handleClickClearFrames}
								disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
							>
								{t('clear.frames')}...
							</Button>
							<Button
								onClick={handleClickCreateTransition}
								disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
							>
								{t('create.transition')}...
							</Button>
							<Button
								onClick={handleClickApplyTexture}
								disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
							>
								{t('apply.texture')}
							</Button>
						</Flex>
						<div className='horizontalSeparator' />
						<Flex column spaced>
							<Button
								onClick={handleClickPlayHit}
								disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
							>
								{t('play.hit')}...
							</Button>
							<Button
								onClick={handleClickPlayMiss}
								disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
							>
								{t('play.miss')}...
							</Button>
							<Button
								onClick={handleClickPlayCrit}
								disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
							>
								{t('play.crit')}...
							</Button>
						</Flex>
						<div className='horizontalSeparator' />
						<Form>
							<Label disabled={isAnimationDisabled || isFrameDisabled || isPlaying}>{t('rows')}</Label>
							<Value>
								<InputNumber
									value={rows}
									onChange={setRows}
									widthType={INPUT_TYPE_WIDTH.SMALL}
									disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
								/>
							</Value>
							<Label disabled={isAnimationDisabled || isFrameDisabled || isPlaying}>{t('columns')}</Label>
							<Value>
								<InputNumber
									value={columns}
									onChange={setColumns}
									widthType={INPUT_TYPE_WIDTH.SMALL}
									disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
								/>
							</Value>
						</Form>
					</Flex>
				</Groupbox>
			</Flex>
			<Flex one scrollable>
				<Flex one zeroWidth>
					<Flex column one>
						<Flex one zeroHeight>
							<AnimationPreviewerTexture
								pictureID={pictureID}
								rows={rows}
								columns={columns}
								selectedColumn={selectedColumn}
								setSelectedColumn={setSelectedColumn}
								selectedRow={selectedRow}
								setSelectedRow={setSelectedRow}
								disabled={isAnimationDisabled || isFrameDisabled || isPlaying}
							/>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);

	const getSoundEffectsFlashsContent = () => (
		<Tree
			constructorType={AnimationFrameEffect}
			list={animationFrameEffects}
			minWidth={TREES_MIN_WIDTH}
			onListUpdated={handleFrameEffectsUpdated}
			scrollable
			applyDefault
			byIndex
			cannotUpdateListSize
		/>
	);

	return (
		<>
			<Flex spacedLarge fillWidth fillHeight>
				<Groupbox title={t('animations')} disabled={isPlaying}>
					<Tree
						constructorType={Animation}
						list={animations}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectAnimation}
						onListUpdated={handleListUpdated}
						disabled={isPlaying}
						scrollable
						showEditName
						isLocalization
						applyDefault
						doNotOpenDialog
					/>
				</Groupbox>
				<Flex one column spacedLarge>
					<Flex spaced centerV>
						<Flex disabledLabel={isAnimationDisabled || isPlaying}>{t('picture')}:</Flex>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.ANIMATIONS}
							selectedID={pictureID}
							onChange={handleChangePictureID}
							disabled={isAnimationDisabled || isPlaying}
						/>
						<Flex disabledLabel={isAnimationDisabled || isPlaying}>{t('position')}:</Flex>
						<Dropdown
							selectedID={positionKind}
							onChange={setPositionKind}
							options={Base.ANIMATION_POSITION_OPTIONS}
							disabled={isAnimationDisabled || isPlaying}
							translateOptions
						/>
					</Flex>
					<Flex one>
						<Flex>
							<Groupbox title={t('frames')} fillWidth disabled={isAnimationDisabled || isPlaying}>
								<Tree
									constructorType={AnimationFrame}
									list={frames}
									onListUpdated={handleFramesListUpdated}
									onSelectedItem={handleSelectFrame}
									minWidth={TREES_SMALL_MIN_WIDTH}
									scrollable
									applyDefault
									disabled={isAnimationDisabled || isPlaying}
									doNotOpenDialog
								/>
							</Groupbox>
						</Flex>
						<Flex one>
							<Tab
								titles={titles}
								contents={[getGraphicsContent(), getSoundEffectsFlashsContent()]}
								disabled={isAnimationDisabled || isPlaying}
								hideScroll
							/>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			{isDialogBattlerOpen && (
				<DialogPictures
					kind={PICTURE_KIND.BATTLERS}
					setIsOpen={setIsDialogBattlerOpen}
					pictureID={battlerID}
					onAccept={handleAcceptChangeBattler}
				/>
			)}
			{isDialogCopyFramesOpen && selectedAnimation && (
				<DialogAnimationCopyFrames
					setIsOpen={setIsDialogCopyFramesOpen}
					animation={selectedAnimation}
					onAccept={handleTriggerDraw}
				/>
			)}
			{isDialogClearFramesOpen && selectedAnimation && (
				<DialogAnimationClearFrames
					setIsOpen={setIsDialogClearFramesOpen}
					animation={selectedAnimation}
					onAccept={handleTriggerDraw}
				/>
			)}
			{isDialogCreateTransitionOpen && selectedAnimation && (
				<DialogAnimationCreateTransition
					setIsOpen={setIsDialogcreateTransitionOpen}
					animation={selectedAnimation}
					onAccept={handleTriggerDraw}
				/>
			)}
		</>
	);
});

PanelAnimations.displayName = 'PanelAnimations';

export default PanelAnimations;
