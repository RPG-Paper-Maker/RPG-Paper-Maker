/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND, SONG_KIND } from '../../../common';
import { Node, Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Tree from '../../Tree';

enum SELECTION_BACKGROUND_TYPE {
	IMAGE,
	VIDEO,
}

const PanelTitleScreenGameOver = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const playTitleMusicSelectorRef = useRef<PlaySongSelectorRef>();
	const playGameOverMusicSelectorRef = useRef<PlaySongSelectorRef>();

	const [selectionTitleScreenBackgroundType, setSelectionTitleScreenBackgroundType] = useStateNumber();
	const [titleBackgroundImageID, setTitleBackgroundImageID] = useStateNumber();
	const [titleBackgroundVideoID, setTitleBackgroundVideoID] = useStateNumber();
	const [titleCommands, setTitleCommands] = useState<Node[]>([]);
	const [settingsConfiguration, setSettingsConfiguration] = useState<Node[]>([]);
	const [selectionGameOverBackgroundType, setSelectionGameOverBackgroundType] = useStateNumber();
	const [gameOverBackgroundImageID, setGameOverBackgroundImageID] = useStateNumber();
	const [gameOverBackgroundVideoID, setGameOverBackgroundVideoID] = useStateNumber();
	const [gameOverCommands, setGameOverCommands] = useState<Node[]>([]);

	const initialize = () => {
		const titleScreenGameOver = Project.current!.titleScreenGameOver;
		setSelectionTitleScreenBackgroundType(
			titleScreenGameOver.isTitleBackgroundImage
				? SELECTION_BACKGROUND_TYPE.IMAGE
				: SELECTION_BACKGROUND_TYPE.VIDEO
		);
		setTitleBackgroundImageID(titleScreenGameOver.titleBackgroundImageID);
		setTitleBackgroundVideoID(titleScreenGameOver.titleBackgroundVideoID);
		playTitleMusicSelectorRef.current!.initialize(titleScreenGameOver.titleMusic);
		setTitleCommands(Node.createList(titleScreenGameOver.titleCommands));
		setSettingsConfiguration(Node.createList(titleScreenGameOver.titleSettings));
		setSelectionGameOverBackgroundType(
			titleScreenGameOver.isGameOverBackgroundImage
				? SELECTION_BACKGROUND_TYPE.IMAGE
				: SELECTION_BACKGROUND_TYPE.VIDEO
		);
		setGameOverBackgroundImageID(titleScreenGameOver.gameOverBackgroundImageID);
		setGameOverBackgroundVideoID(titleScreenGameOver.gameOverBackgroundVideoID);
		playGameOverMusicSelectorRef.current!.initialize(titleScreenGameOver.gameOverMusic);
		setGameOverCommands(Node.createList(titleScreenGameOver.gameOverCommands));
	};

	const accept = () => {
		const titleScreenGameOver = Project.current!.titleScreenGameOver;
		titleScreenGameOver.isTitleBackgroundImage =
			selectionTitleScreenBackgroundType === SELECTION_BACKGROUND_TYPE.IMAGE;
		titleScreenGameOver.titleBackgroundImageID = titleBackgroundImageID;
		titleScreenGameOver.titleBackgroundVideoID = titleBackgroundVideoID;
		playTitleMusicSelectorRef.current!.accept(titleScreenGameOver.titleMusic);
		titleScreenGameOver.titleCommands = Node.createListFromNodes(titleCommands);
		titleScreenGameOver.titleSettings = Node.createListFromNodes(settingsConfiguration);
		titleScreenGameOver.isGameOverBackgroundImage =
			selectionGameOverBackgroundType === SELECTION_BACKGROUND_TYPE.IMAGE;
		titleScreenGameOver.gameOverBackgroundImageID = gameOverBackgroundImageID;
		titleScreenGameOver.gameOverBackgroundVideoID = gameOverBackgroundVideoID;
		playGameOverMusicSelectorRef.current!.accept(titleScreenGameOver.gameOverMusic);
		titleScreenGameOver.gameOverCommands = Node.createListFromNodes(gameOverCommands);
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
				<Groupbox title={t('title.screen')} fillWidth>
					<Flex spacedLarge fillHeight>
						<Flex column spacedLarge>
							<Groupbox title={t('background')}>
								<RadioGroup
									selected={selectionTitleScreenBackgroundType}
									onChange={setSelectionTitleScreenBackgroundType}
								>
									<Form>
										<Label>
											<RadioButton value={SELECTION_BACKGROUND_TYPE.IMAGE}>
												{t('image')}
											</RadioButton>
										</Label>
										<Value>
											<AssetSelector
												selectionType={ASSET_SELECTOR_TYPE.PICTURES}
												kind={PICTURE_KIND.TITLE_SCREENS}
												selectedID={titleBackgroundImageID}
												onChange={setTitleBackgroundImageID}
											/>
										</Value>
										<Label>
											<RadioButton value={SELECTION_BACKGROUND_TYPE.VIDEO}>
												{t('video')}
											</RadioButton>
										</Label>
										<Value>
											<AssetSelector
												selectionType={ASSET_SELECTOR_TYPE.VIDEOS}
												selectedID={titleBackgroundVideoID}
												onChange={setTitleBackgroundVideoID}
											/>
										</Value>
									</Form>
								</RadioGroup>
							</Groupbox>
							<Flex column spaced>
								<div>{t('music')}:</div>
								<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playTitleMusicSelectorRef} />
							</Flex>
						</Flex>
						<Flex one>
							<Groupbox title={t('menu.commands')} fillWidth>
								<Flex one fillHeight>
									<Tree
										constructorType={Model.TitleCommand}
										list={titleCommands}
										noScrollOnForce
										scrollable
										doNotShowID
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('settings.configuration')} fillWidth>
								<Tree
									constructorType={Model.Checkable}
									list={settingsConfiguration}
									cannotAdd
									cannotDelete
									doNotShowID
								/>
							</Groupbox>
						</Flex>
					</Flex>
				</Groupbox>
			</Flex>
			<Flex one>
				<Groupbox title={t('game.over')} fillWidth>
					<Flex spacedLarge fillHeight>
						<Flex column spacedLarge>
							<Groupbox title={t('background')}>
								<RadioGroup
									selected={selectionGameOverBackgroundType}
									onChange={setSelectionGameOverBackgroundType}
								>
									<Form>
										<Label>
											<RadioButton value={SELECTION_BACKGROUND_TYPE.IMAGE}>
												{t('image')}
											</RadioButton>
										</Label>
										<Value>
											<AssetSelector
												selectionType={ASSET_SELECTOR_TYPE.PICTURES}
												kind={PICTURE_KIND.GAME_OVERS}
												selectedID={gameOverBackgroundImageID}
												onChange={setGameOverBackgroundImageID}
											/>
										</Value>
										<Label>
											<RadioButton value={SELECTION_BACKGROUND_TYPE.VIDEO}>
												{t('video')}
											</RadioButton>
										</Label>
										<Value>
											<AssetSelector
												selectionType={ASSET_SELECTOR_TYPE.VIDEOS}
												selectedID={gameOverBackgroundVideoID}
												onChange={setGameOverBackgroundVideoID}
											/>
										</Value>
									</Form>
								</RadioGroup>
							</Groupbox>
							<Flex column spaced>
								<div>{t('music')}:</div>
								<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playGameOverMusicSelectorRef} />
							</Flex>
						</Flex>
						<Flex one>
							<Groupbox title={t('menu.commands')} fillWidth>
								<Flex one fillHeight>
									<Tree
										constructorType={Model.GameOverCommand}
										list={gameOverCommands}
										noScrollOnForce
										scrollable
										doNotShowID
									/>
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);
});

export default PanelTitleScreenGameOver;
