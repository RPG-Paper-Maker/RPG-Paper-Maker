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
import { INPUT_TYPE_WIDTH, PICTURE_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import useStateNumber from '../../../hooks/useStateNumber';
import { Animation, AnimationFrame, Base, Picture } from '../../../models';
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

	const titles = useMemo(() => Base.mapListIndex([t('graphics'), t('sound.effects.flashs')]), [t]);

	const isAnimationDisabled = useMemo(
		() => selectedAnimation === null || selectedAnimation.id === -1,
		[selectedAnimation]
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
		/*
		if (frame) {
		}*/
	};

	const handleClickChangeBattler = () => {
		setIsDialogBattlerOpen(true);
	};

	const handleAcceptChangeBattler = (picture: Picture) => {
		setBattlerID(picture.id);
		setIsDialogBattlerOpen(false);
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

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
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
									disabled={isAnimationDisabled || isFrameDisabled}
								/>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Groupbox title={t('options')} disabled={isAnimationDisabled || isFrameDisabled}>
					<Flex column spacedLarge>
						<Button onClick={handleClickChangeBattler} disabled={isAnimationDisabled || isFrameDisabled}>
							{t('change.battler')}...
						</Button>
						<div className='horizontalSeparator' />
						<Flex column spaced>
							<Button onClick={handleClickCopyFrames} disabled={isAnimationDisabled || isFrameDisabled}>
								{t('copy.frames')}...
							</Button>
							<Button onClick={handleClickClearFrames} disabled={isAnimationDisabled || isFrameDisabled}>
								{t('clear.frames')}...
							</Button>
							<Button
								onClick={handleClickCreateTransition}
								disabled={isAnimationDisabled || isFrameDisabled}
							>
								{t('create.transition')}...
							</Button>
							<Button
								onClick={handleClickChangeBattler}
								disabled={isAnimationDisabled || isFrameDisabled}
							>
								{t('apply.texture')}
							</Button>
						</Flex>
						<div className='horizontalSeparator' />
						<Flex column spaced>
							<Button
								onClick={handleClickChangeBattler}
								disabled={isAnimationDisabled || isFrameDisabled}
							>
								{t('play.hit')}...
							</Button>
							<Button
								onClick={handleClickChangeBattler}
								disabled={isAnimationDisabled || isFrameDisabled}
							>
								{t('play.miss')}...
							</Button>
							<Button
								onClick={handleClickChangeBattler}
								disabled={isAnimationDisabled || isFrameDisabled}
							>
								{t('play.crit')}...
							</Button>
						</Flex>
						<div className='horizontalSeparator' />
						<Form>
							<Label disabled={isAnimationDisabled || isFrameDisabled}>{t('rows')}</Label>
							<Value>
								<InputNumber
									value={rows}
									onChange={setRows}
									widthType={INPUT_TYPE_WIDTH.SMALL}
									disabled={isAnimationDisabled || isFrameDisabled}
								/>
							</Value>
							<Label disabled={isAnimationDisabled || isFrameDisabled}>{t('columns')}</Label>
							<Value>
								<InputNumber
									value={columns}
									onChange={setColumns}
									widthType={INPUT_TYPE_WIDTH.SMALL}
									disabled={isAnimationDisabled || isFrameDisabled}
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
								disabled={isAnimationDisabled || isFrameDisabled}
							/>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);

	const getSoundEffectsFlashsContent = () => null;

	return (
		<>
			<Flex spacedLarge fillWidth fillHeight>
				<Groupbox title={t('animations')}>
					<Flex one fillHeight>
						<Tree
							constructorType={Animation}
							list={animations}
							minWidth={TREES_MIN_WIDTH}
							onSelectedItem={handleSelectAnimation}
							onListUpdated={handleListUpdated}
							noScrollOnForce
							scrollable
							showEditName
							isLocalization
							applyDefault
						/>
					</Flex>
				</Groupbox>
				<Flex one column spacedLarge>
					<Flex spaced centerV>
						<Flex disabledLabel={isAnimationDisabled}>{t('picture')}:</Flex>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.ANIMATIONS}
							selectedID={pictureID}
							onChange={handleChangePictureID}
							disabled={isAnimationDisabled}
						/>
						<Flex disabledLabel={isAnimationDisabled}>{t('position')}:</Flex>
						<Dropdown
							selectedID={positionKind}
							onChange={setPositionKind}
							options={Base.ANIMATION_POSITION_OPTIONS}
							disabled={isAnimationDisabled}
							translateOptions
						/>
					</Flex>
					<Flex one>
						<Flex>
							<Groupbox title={t('frames')} fillWidth disabled={isAnimationDisabled}>
								<Tree
									constructorType={AnimationFrame}
									list={frames}
									onListUpdated={handleFramesListUpdated}
									onSelectedItem={handleSelectFrame}
									minWidth={TREES_SMALL_MIN_WIDTH}
									noScrollOnForce
									scrollable
									applyDefault
									disabled={isAnimationDisabled}
									doNotOpenDialog
								/>
							</Groupbox>
						</Flex>
						<Flex one>
							<Tab
								titles={titles}
								contents={[getGraphicsContent(), getSoundEffectsFlashsContent()]}
								disabled={isAnimationDisabled}
								hideScroll
							/>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			{isDialogBattlerOpen && (
				<DialogPictures
					kind={PICTURE_KIND.BATTLERS}
					isOpen
					setIsOpen={setIsDialogBattlerOpen}
					pictureID={battlerID}
					onAccept={handleAcceptChangeBattler}
				/>
			)}
			{isDialogCopyFramesOpen && selectedAnimation && (
				<DialogAnimationCopyFrames isOpen setIsOpen={setIsDialogCopyFramesOpen} animation={selectedAnimation} />
			)}
			{isDialogClearFramesOpen && selectedAnimation && (
				<DialogAnimationClearFrames
					isOpen
					setIsOpen={setIsDialogClearFramesOpen}
					animation={selectedAnimation}
				/>
			)}
			{isDialogCreateTransitionOpen && selectedAnimation && (
				<DialogAnimationCreateTransition
					isOpen
					setIsOpen={setIsDialogcreateTransitionOpen}
					animation={selectedAnimation}
				/>
			)}
		</>
	);
});

export default PanelAnimations;
