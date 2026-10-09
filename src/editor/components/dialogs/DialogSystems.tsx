/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAcceptRef } from '../../common';
import { Project } from '../../core/Project';
import { SimulationHudBridge, SimulationSession } from '../../core/simulation';
import { EngineSettings } from '../../data';
import { Data, Model, Scene } from '../../Editor';
import { RootState, setIsSystemsDialogOpen, setNeedsReloadMap, setSystemsCommandPreviewOpen } from '../../store';
import ObjectCommandTestOverlay from '../ObjectCommandTestOverlay';
import type { PlayCommandInfo } from '../panels/PanelMapObject';
import PanelBattleSystem from '../panels/systems/PanelBattleSystem';
import PanelCommonReactions from '../panels/systems/PanelCommonReactions';
import PanelEventsStates from '../panels/systems/PanelEventsStates';
import PanelMainMenu from '../panels/systems/PanelMainMenu';
import PanelModels from '../panels/systems/PanelModels';
import PanelSystem from '../panels/systems/PanelSystem';
import PanelTitleScreenGameOver from '../panels/systems/PanelTitleScreenGameOver';
import Tab from '../Tab';
import Dialog from './Dialog';
import DialogObjectCommandTest from './DialogObjectCommandTest';
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
	const [currentTab, setCurrentTab] = useState(initialTabIndex ?? Project.current!.settings.lastTabIndexSystems);
	const [playCommandRequest, setPlayCommandRequest] = useState<{
		info: PlayCommandInfo;
		object: Model.CommonObject;
	} | null>(null);
	const [simulation, setSimulation] = useState<{ session: SimulationSession; hud: SimulationHudBridge } | null>(null);
	const [preview, setPreview] = useState<{ session: SimulationSession; hud: SimulationHudBridge } | null>(null);
	const simulationRef = useRef<SimulationSession | null>(null);
	const previewRef = useRef<SimulationSession | null>(null);
	const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const previewRequestRef = useRef(0);
	const simulationRequestRef = useRef(0);
	const wasPreviewLayoutRef = useRef(false);
	const mapLoaded = useSelector((state: RootState) => state.mapEditor.loaded);
	const currentMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	const needsReloadMap = useSelector((state: RootState) => state.triggers.needsReloadMap);
	const livePreview = useSelector((state: RootState) => state.settings.livePreview);
	const hasCurrentMap =
		mapLoaded &&
		!!currentMapTag &&
		Scene.Map.current?.id === currentMapTag.id &&
		!!document.getElementById('canvas-map-editor');
	const isCommandTab = currentTab === SYSTEMS_TAB.COMMON_REACTIONS || currentTab === SYSTEMS_TAB.MODELS;
	const isPreviewLayout = hasCurrentMap && isCommandTab;
	const previewCommonReactions = hasCurrentMap && currentTab === SYSTEMS_TAB.COMMON_REACTIONS;
	const previewModels = hasCurrentMap && currentTab === SYSTEMS_TAB.MODELS;

	const cancelPendingPreview = () => {
		previewRequestRef.current++;
		if (previewTimeoutRef.current !== null) {
			clearTimeout(previewTimeoutRef.current);
			previewTimeoutRef.current = null;
		}
	};

	const stopPreview = () => {
		cancelPendingPreview();
		previewRef.current?.stop();
		previewRef.current = null;
		setPreview(null);
	};

	const stopSimulation = () => {
		simulationRef.current?.stop();
		simulationRef.current = null;
		setSimulation(null);
	};

	const stopCommandTesting = () => {
		simulationRequestRef.current++;
		stopPreview();
		stopSimulation();
		setPlayCommandRequest(null);
	};

	const getTestConfig = async () => {
		const tests = new Data.ObjectCommandTests();
		await tests.load();
		const configs = tests.configs ?? [];
		if (configs.length === 0) {
			const config = new Model.ObjectCommandTestConfig();
			config.applyDefault();
			return config;
		}
		const index = Math.max(
			0,
			Math.min(Project.current!.settings.lastTabIndexObjectCommandTest, configs.length - 1),
		);
		return configs[index];
	};

	const startCommandPreview = async (
		info: PlayCommandInfo,
		object: Model.CommonObject,
		overrideCommand?: Model.MapObjectCommand,
	) => {
		const request = previewRequestRef.current;
		const map = Scene.Map.current;
		if (!map || !isPreviewLayout || simulationRef.current || !EngineSettings.current?.livePreview) return;
		const config = await getTestConfig();
		if (request !== previewRequestRef.current || Scene.Map.current !== map || simulationRef.current) return;
		const hud = new SimulationHudBridge();
		const session = SimulationSession.start({
			map,
			object,
			reaction: info.reaction,
			stateID: info.stateID,
			targetNode: info.node,
			config,
			hud,
			singleCommand: true,
			overrideCommand,
			insertNewCommand: info.isNewCommand,
		});
		session.update(0);
		previewRef.current = session;
		setPreview({ session, hud });
	};

	const handleSelectCommand = (info: PlayCommandInfo | null, object: Model.CommonObject) => {
		cancelPendingPreview();
		if (livePreview && info) {
			void startCommandPreview(info, object);
		} else {
			stopPreview();
		}
	};

	const handleLivePreviewCommand = (
		info: PlayCommandInfo,
		object: Model.CommonObject,
		command: Model.MapObjectCommand | null,
	) => {
		cancelPendingPreview();
		if (livePreview && command) {
			previewTimeoutRef.current = setTimeout(() => void startCommandPreview(info, object, command), 120);
		} else {
			stopPreview();
		}
	};

	const startSimulation = async (info: PlayCommandInfo, object: Model.CommonObject) => {
		const request = ++simulationRequestRef.current;
		stopPreview();
		const map = Scene.Map.current;
		const config = await getTestConfig();
		if (request !== simulationRequestRef.current || !map || Scene.Map.current !== map || !isPreviewLayout) return;
		stopSimulation();
		const hud = new SimulationHudBridge();
		const session = SimulationSession.start({
			map,
			object,
			reaction: info.reaction,
			stateID: info.stateID,
			targetNode: info.node,
			config,
			hud,
		});
		simulationRef.current = session;
		setSimulation({ session, hud });
	};

	const handlePlayCommand = (info: PlayCommandInfo, object: Model.CommonObject) => {
		if (info.openOptions) {
			setPlayCommandRequest({ info, object });
		} else {
			void startSimulation(info, object);
		}
	};

	const handleCurrentIndexChanged = (index: number) => {
		stopCommandTesting();
		setCurrentTab(index);
		Project.current!.settings.lastTabIndexSystems = index;
	};

	const handleSave = async () => {
		stopCommandTesting();
		const shouldSavePictures = panelSystemRef.current?.accept();
		panelBattleSystemRef.current?.accept();
		panelTitleScreenGameOverRef.current?.accept();
		panelMainMenuRef.current?.accept();
		panelEventsStatesRef.current?.accept();
		panelCommonReactionsRef.current?.accept();
		panelModelsRef.current?.accept();
		await Project.current!.systems.save();
		if (shouldSavePictures) {
			await Project.current!.pictures.save();
		}
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
		stopCommandTesting();
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
			simulationRequestRef.current++;
			cancelPendingPreview();
			previewRef.current?.stop();
			simulationRef.current?.stop();
			dispatch(setSystemsCommandPreviewOpen(false));
			dispatch(setIsSystemsDialogOpen(false));
		};
	}, []);

	useLayoutEffect(() => {
		dispatch(setSystemsCommandPreviewOpen(isPreviewLayout && simulation === null));
		const dialog = document.querySelector('.dialogSystemsManager') as HTMLElement | null;
		if (dialog && (isPreviewLayout || wasPreviewLayoutRef.current)) {
			const rect = dialog.getBoundingClientRect();
			dialog.style.left = isPreviewLayout
				? `${Math.max(0, window.innerWidth - 10 - rect.width)}px`
				: `${Math.max(0, (window.innerWidth - rect.width) / 2)}px`;
			dialog.style.top =
				isPreviewLayout && window.innerWidth <= 1000
					? '0px'
					: `${Math.max(0, (window.innerHeight - rect.height) / 2)}px`;
		}
		wasPreviewLayoutRef.current = isPreviewLayout;
	}, [dispatch, isPreviewLayout, simulation]);

	useEffect(() => {
		if (!isPreviewLayout) stopCommandTesting();
	}, [isPreviewLayout]);

	useEffect(() => {
		if (!isPreviewLayout) return;
		const previousPreviewOnly = Scene.Map.previewOnly;
		Scene.Map.previewOnly = true;
		return () => {
			Scene.Map.previewOnly = previousPreviewOnly;
		};
	}, [isPreviewLayout]);

	useEffect(() => {
		stopCommandTesting();
	}, [currentMapTag, needsReloadMap]);

	useEffect(() => {
		if (!livePreview) stopPreview();
	}, [livePreview]);

	return (
		<>
			<Dialog
				title={`${t('systems.manager')}...`}
				isOpen
				className={`dialogSystemsManager${isPreviewLayout ? ' dialogSystemsCommandPreview' : ''}`}
				movable={!isPreviewLayout}
				allowMapInteraction={isPreviewLayout}
				footer={
					<FooterCancelSaveClose onCancel={handleReject} onSave={handleSave} onSaveAndClose={handleAccept} />
				}
				onClose={handleReject}
				initialWidth={
					isPreviewLayout
						? window.innerWidth <= 1000
							? '100%'
							: window.innerWidth <= 1300
								? '66.6667%'
								: '50%'
						: window.innerWidth <= 1000
							? '100%'
							: '1000px'
				}
				initialHeight={
					isPreviewLayout ? (window.innerWidth <= 1000 ? '66.6667vh' : '100%') : 'calc(100% - 50px)'
				}
				initialPlacement={
					isPreviewLayout && window.innerWidth <= 1000 ? 'top' : isPreviewLayout ? 'right' : 'center'
				}
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
						<PanelEventsStates key={4} ref={panelEventsStatesRef} />,
						<PanelCommonReactions
							key={5}
							ref={panelCommonReactionsRef}
							onPlayCommand={previewCommonReactions ? handlePlayCommand : undefined}
							onSelectCommand={previewCommonReactions ? handleSelectCommand : undefined}
							onLivePreviewCommand={previewCommonReactions ? handleLivePreviewCommand : undefined}
							onReactionChanged={stopPreview}
						/>,
						<PanelModels
							key={6}
							ref={panelModelsRef}
							onPlayCommand={previewModels ? handlePlayCommand : undefined}
							onSelectCommand={previewModels ? handleSelectCommand : undefined}
							onLivePreviewCommand={previewModels ? handleLivePreviewCommand : undefined}
							onModelChanged={stopPreview}
						/>,
					]}
					defaultIndex={initialTabIndex ?? Project.current!.settings.lastTabIndexSystems}
					onCurrentIndexChanged={handleCurrentIndexChanged}
					padding
					scrollableContent
					lazyLoadingContent
					hideScroll
				/>
			</Dialog>
			{playCommandRequest && (
				<DialogObjectCommandTest
					setIsOpen={(open) => {
						if (!open) setPlayCommandRequest(null);
					}}
					onAccept={() => {
						const request = playCommandRequest;
						setPlayCommandRequest(null);
						void startSimulation(request.info, request.object);
					}}
				/>
			)}
			{(simulation || preview) &&
				document.getElementById('canvas-map-editor')?.parentElement &&
				createPortal(
					<ObjectCommandTestOverlay
						session={(simulation || preview)!.session}
						hud={(simulation || preview)!.hud}
						onStop={simulation ? stopSimulation : stopPreview}
						preview={!simulation}
					/>,
					document.getElementById('canvas-map-editor')!.parentElement!,
				)}
		</>
	);
}

export default DialogSystems;
