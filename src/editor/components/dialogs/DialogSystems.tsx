/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { initializeAcceptRef } from '../../common';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { setIsSystemsDialogOpen, setNeedsReloadMap } from '../../store';
import PanelBattleSystem from '../panels/systems/PanelBattleSystem';
import PanelCommonReactions from '../panels/systems/PanelCommonReactions';
import PanelEventsStates from '../panels/systems/PanelEventsStates';
import PanelMainMenu from '../panels/systems/PanelMainMenu';
import PanelModels from '../panels/systems/PanelModels';
import PanelSystem from '../panels/systems/PanelSystem';
import PanelTitleScreenGameOver from '../panels/systems/PanelTitleScreenGameOver';
import Tab from '../Tab';
import Dialog from './Dialog';
import FooterCancelSaveClose from './footers/FooterCancelSaveClose';

export enum SYSTEMS_TAB {
	SYSTEM,
	BATTLE_SYSTEM,
	TITLE_SCREEN_GAME_OVER,
	MAIN_MENU,
	EVENTS_STATES,
	COMMON_REACTIONS,
	MODELS,
}

type Props = {
	setIsOpen: (b: boolean) => void;
	initialTabIndex?: SYSTEMS_TAB;
};

function DialogSystems({ setIsOpen, initialTabIndex }: Props) {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const panelSystemRef = useRef<initializeAcceptRef>(null);
	const panelBattleSystemRef = useRef<initializeAcceptRef>(null);
	const panelTitleScreenGameOverRef = useRef<initializeAcceptRef>(null);
	const panelMainMenuRef = useRef<initializeAcceptRef>(null);
	const panelEventsStatesRef = useRef<initializeAcceptRef>(null);
	const panelCommonReactionsRef = useRef<initializeAcceptRef>(null);
	const panelModelsRef = useRef<initializeAcceptRef>(null);

	const handleCurrentIndexChanged = (index: number) => {
		Project.current!.settings.lastTabIndexSystems = index;
	};

	const handleSave = async () => {
		panelSystemRef.current?.accept();
		panelBattleSystemRef.current?.accept();
		panelTitleScreenGameOverRef.current?.accept();
		panelMainMenuRef.current?.accept();
		panelEventsStatesRef.current?.accept();
		panelCommonReactionsRef.current?.accept();
		panelModelsRef.current?.accept();
		await Project.current!.systems.save();
		Project.SQUARE_SIZE = Project.current!.systems.SQUARE_SIZE;
		await Project.current!.battleSystem.save();
		await Project.current!.titleScreenGameOver.save();
		await Project.current!.commonEvents.save();
		await Project.current!.settings.save();
		dispatch(setNeedsReloadMap());
	};

	const handleAccept = async () => {
		await handleSave();
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.systems.load();
		await Project.current!.battleSystem.load();
		await Project.current!.titleScreenGameOver.load();
		await Project.current!.commonEvents.load();
		await Project.current!.settings.save();
		setIsOpen(false);
	};

	useEffect(() => {
		dispatch(setIsSystemsDialogOpen(true));
		return () => {
			dispatch(setIsSystemsDialogOpen(false));
		};
	}, []);

	return (
		<Dialog
			title={`${t('systems.manager')}...`}
			isOpen
			footer={<FooterCancelSaveClose onCancel={handleReject} onSave={handleSave} onSaveAndClose={handleAccept} />}
			onClose={handleReject}
			initialWidth='1000px'
			initialHeight='calc(100% - 50px)'
		>
			<Tab
				titles={Model.Base.mapListIndex([
					t('system'),
					t('battle.system'),
					t('title.screen.game.over'),
					t('main.menu'),
					t('events.states'),
					t('common.reactions'),
					t('models'),
				])}
				contents={[
					<PanelSystem key={0} ref={panelSystemRef} />,
					<PanelBattleSystem key={1} ref={panelBattleSystemRef} />,
					<PanelTitleScreenGameOver key={2} ref={panelTitleScreenGameOverRef} />,
					<PanelMainMenu key={3} ref={panelMainMenuRef} />,
					<PanelEventsStates key={4} ref={panelMainMenuRef} />,
					<PanelCommonReactions key={5} ref={panelCommonReactionsRef} />,
					<PanelModels key={6} ref={panelModelsRef} />,
				]}
				defaultIndex={initialTabIndex ?? Project.current!.settings.lastTabIndexSystems}
				onCurrentIndexChanged={handleCurrentIndexChanged}
				padding
				scrollableContent
				lazyLoadingContent
				hideScroll
			/>
		</Dialog>
	);
}

export default DialogSystems;
