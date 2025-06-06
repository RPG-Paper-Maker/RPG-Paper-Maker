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
import { PICTURE_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import useStateNumber from '../../../hooks/useStateNumber';
import { Animation, AnimationFrame, Base } from '../../../models';
import AnimationPreviewer from '../../AnimationPreviewer';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tab from '../../Tab';
import Tree, { TREES_MIN_WIDTH, TREES_SMALL_MIN_WIDTH } from '../../Tree';

const PanelAnimations = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [animations, setAnimations] = useState<Node[]>([]);
	const [pictureID, setPictureID] = useStateNumber();
	const [positionKind, setPositionKind] = useStateNumber();
	const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
	const [frames, setFrames] = useState<Node[]>([]);
	const [selectedFrame, setSelectedFrame] = useState<AnimationFrame | null>(null);
	const [battlerID, setBattlerID] = useState(1);
	const [rows, setRows] = useStateNumber();
	const [columns, setColumns] = useStateNumber();

	const titles = useMemo(() => Base.mapListIndex([t('graphics'), t('sound.effects.flashs')]), []);

	const isAnimationDisabled = useMemo(
		() => selectedAnimation === null || selectedAnimation.id === -1,
		[selectedAnimation]
	);

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
		}
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
								/>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
				<Groupbox title={t('options')}>
					<Flex column spaced>
						<Button>{t('change.battler')}...</Button>
						<Button>{t('change.battler')}...</Button>
					</Flex>
				</Groupbox>
			</Flex>
			<Groupbox title={t('options')}>
				<Flex column spaced>
					<Button>{t('change.battler')}...</Button>
					<Button>{t('change.battler')}...</Button>
					<Button>{t('change.battler')}...</Button>
					<Button>{t('change.battler')}...</Button>
				</Flex>
			</Groupbox>
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
		</>
	);
});

export default PanelAnimations;
