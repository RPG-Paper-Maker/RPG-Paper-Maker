/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND, SONG_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import Tree from '../../Tree';

const PanelTitleScreenGameOver = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const playTitleMusicSelectorRef = useRef<PlaySongSelectorRef>(null);
	const playGameOverMusicSelectorRef = useRef<PlaySongSelectorRef>(null);

	const [isTitleBackgroundImage, setIsTitleBackgroundImage] = useState<boolean>(true);
	const [isTitleBackgroundVideo, setIsTitleBackgroundVideo] = useState<boolean>(false);
	const [titleBackgroundImageID, setTitleBackgroundImageID] = useStateNumber();
	const [titleBackgroundVideoID, setTitleBackgroundVideoID] = useStateNumber();
	const [titleCommands, setTitleCommands] = useState<Node[]>([]);
	const [settingsConfiguration, setSettingsConfiguration] = useState<Node[]>([]);
	const [isGameOverBackgroundImage, setIsGameOverBackgroundImage] = useState<boolean>(true);
	const [isGameOverBackgroundVideo, setIsGameOverBackgroundVideo] = useState<boolean>(false);
	const [gameOverBackgroundImageID, setGameOverBackgroundImageID] = useStateNumber();
	const [gameOverBackgroundVideoID, setGameOverBackgroundVideoID] = useStateNumber();
	const [gameOverCommands, setGameOverCommands] = useState<Node[]>([]);

	const initialize = () => {
		const titleScreenGameOver = Project.current!.titleScreenGameOver;
		setIsTitleBackgroundImage(titleScreenGameOver.isTitleBackgroundImage);
		setIsTitleBackgroundVideo(titleScreenGameOver.isTitleBackgroundVideo);
		setTitleBackgroundImageID(titleScreenGameOver.titleBackgroundImageID);
		setTitleBackgroundVideoID(titleScreenGameOver.titleBackgroundVideoID);
		playTitleMusicSelectorRef.current!.initialize(titleScreenGameOver.titleMusic);
		setTitleCommands(Node.createList(titleScreenGameOver.titleCommands));
		setSettingsConfiguration(Node.createList(titleScreenGameOver.titleSettings));
		setIsGameOverBackgroundImage(titleScreenGameOver.isGameOverBackgroundImage);
		setIsGameOverBackgroundVideo(titleScreenGameOver.isGameOverBackgroundVideo);
		setGameOverBackgroundImageID(titleScreenGameOver.gameOverBackgroundImageID);
		setGameOverBackgroundVideoID(titleScreenGameOver.gameOverBackgroundVideoID);
		playGameOverMusicSelectorRef.current!.initialize(titleScreenGameOver.gameOverMusic);
		setGameOverCommands(Node.createList(titleScreenGameOver.gameOverCommands));
	};

	const accept = () => {
		const titleScreenGameOver = Project.current!.titleScreenGameOver;
		titleScreenGameOver.isTitleBackgroundImage = isTitleBackgroundImage;
		titleScreenGameOver.isTitleBackgroundVideo = isTitleBackgroundVideo;
		titleScreenGameOver.titleBackgroundImageID = titleBackgroundImageID;
		titleScreenGameOver.titleBackgroundVideoID = titleBackgroundVideoID;
		playTitleMusicSelectorRef.current!.accept(titleScreenGameOver.titleMusic);
		titleScreenGameOver.titleCommands = Node.createListFromNodes(titleCommands);
		titleScreenGameOver.titleSettings = Node.createListFromNodes(settingsConfiguration);
		titleScreenGameOver.isGameOverBackgroundImage = isGameOverBackgroundImage;
		titleScreenGameOver.isGameOverBackgroundVideo = isGameOverBackgroundVideo;
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
	}, []);

	return (
		<Flex column spacedLarge fillWidth fillHeight>
			<Flex columnMobile one>
				<Groupbox title={t('title.screen')} fillWidth>
					<Flex columnMobile spacedLarge fillHeight>
						<Flex column spacedLarge>
							<Groupbox title={t('background')}>
								<Form>
									<Label>
										<Checkbox
											isChecked={isTitleBackgroundImage}
											onChange={setIsTitleBackgroundImage}
										>
											{t('image')}
										</Checkbox>
									</Label>
									<Value>
										<AssetSelector
											selectionType={ASSET_SELECTOR_TYPE.PICTURES}
											kind={PICTURE_KIND.TITLE_SCREENS}
											selectedID={titleBackgroundImageID}
											onChange={setTitleBackgroundImageID}
											disabled={!isTitleBackgroundImage}
										/>
									</Value>
									<Label>
										<Checkbox
											isChecked={isTitleBackgroundVideo}
											onChange={setIsTitleBackgroundVideo}
										>
											{t('video')}
										</Checkbox>
									</Label>
									<Value>
										<AssetSelector
											selectionType={ASSET_SELECTOR_TYPE.VIDEOS}
											selectedID={titleBackgroundVideoID}
											onChange={setTitleBackgroundVideoID}
											disabled={!isTitleBackgroundVideo}
										/>
									</Value>
								</Form>
							</Groupbox>
							<Flex column spaced>
								<div>{t('music')}:</div>
								<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playTitleMusicSelectorRef} />
							</Flex>
						</Flex>
						<Flex one>
							<Groupbox title={t('menu.commands')} fillWidth>
								<Tree
									constructorType={Model.TitleCommand}
									list={titleCommands}
									scrollable
									doNotShowID
								/>
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
			<Flex columnMobile one>
				<Groupbox title={t('game.over')} fillWidth>
					<Flex columnMobile spacedLarge fillHeight>
						<Flex column spacedLarge>
							<Groupbox title={t('background')}>
								<Form>
									<Label>
										<Checkbox
											isChecked={isGameOverBackgroundImage}
											onChange={setIsGameOverBackgroundImage}
										>
											{t('image')}
										</Checkbox>
									</Label>
									<Value>
										<AssetSelector
											selectionType={ASSET_SELECTOR_TYPE.PICTURES}
											kind={PICTURE_KIND.GAME_OVERS}
											selectedID={gameOverBackgroundImageID}
											onChange={setGameOverBackgroundImageID}
											disabled={!isGameOverBackgroundImage}
										/>
									</Value>
									<Label>
										<Checkbox
											isChecked={isGameOverBackgroundVideo}
											onChange={setIsGameOverBackgroundVideo}
										>
											{t('video')}
										</Checkbox>
									</Label>
									<Value>
										<AssetSelector
											selectionType={ASSET_SELECTOR_TYPE.VIDEOS}
											selectedID={gameOverBackgroundVideoID}
											onChange={setGameOverBackgroundVideoID}
											disabled={!isGameOverBackgroundVideo}
										/>
									</Value>
								</Form>
							</Groupbox>
							<Flex column spaced>
								<div>{t('music')}:</div>
								<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playGameOverMusicSelectorRef} />
							</Flex>
						</Flex>
						<Flex one>
							<Groupbox title={t('menu.commands')} fillWidth>
								<Tree
									constructorType={Model.GameOverCommand}
									list={gameOverCommands}
									scrollable
									doNotShowID
								/>
							</Groupbox>
						</Flex>
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);
});

PanelTitleScreenGameOver.displayName = 'PanelTitleScreenGameOver';

export default PanelTitleScreenGameOver;
