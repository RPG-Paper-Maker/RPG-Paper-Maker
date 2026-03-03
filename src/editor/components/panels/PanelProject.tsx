/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Utils } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Manager, Model } from '../../Editor';
import {
	RootState,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentMountainHeightPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainID,
	setCurrentMountainAllSides,
	setCurrentMountainTopFloorIsAutotile,
	setCurrentMountainTopFloorTilesetRect,
	setCurrentMountainTopFloorAutotileID,
	setCurrentMountainTopFloorAutotileRect,
	setCurrentMountainWidthPixelsBot,
	setCurrentMountainWidthPixelsLeft,
	setCurrentMountainWidthPixelsRight,
	setCurrentMountainWidthPixelsTop,
	setCurrentMountainWidthSquaresBot,
	setCurrentMountainWidthSquaresLeft,
	setCurrentMountainWidthSquaresRight,
	setCurrentMountainWidthSquaresTop,
	setCurrentObject3DID,
	setCurrentTilesetFloorSpriteTexture,
	setCurrentTreeMapTag,
	setCurrentWallID,
	setProjectMenuIndex,
} from '../../store';
import Flex from '../Flex';
import Loader from '../Loader';
import MapEditor from '../MapEditor';
import MapEditorMenuBar from '../MapEditorMenuBar';
import Splitter from '../Splitter';
import Tab from '../Tab';
import TreeMaps from '../TreeMaps';
import PanelTextures from './PanelTextures';

function PanelProject() {
	const { t } = useTranslation();

	const [mapsTabsTitles, setMapsTabsTitles] = useState<Model.Base[]>([]);
	const [mapsTabsContents, setMapsTabsContents] = useState<(ReactNode | null)[]>([]);
	const [mapForcedCurrentSelectedItemID, setMapForcedCurrentSelectedItemID] = useState<number | null>(null);
	const [mapTabForcedCurrentIndex, setMapTabForcedCurrentIndex] = useState<number | null>(null);

	const dispatch = useDispatch();

	const currentMapID = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag?.id);
	const openLoading = useSelector((state: RootState) => state.projects.openLoading);
	const projectMenuIndex = useSelector((state: RootState) => state.projects.menuIndex);

	const getDefaultTabTitles = () =>
		Project.current!.treeMaps.tabs.map((id) =>
			Model.Base.create(id, Node.getNameByID(Project.current!.treeMaps.tree, id)),
		);

	const getDefaultTabContents = () => Project.current!.treeMaps.tabs.map(() => null);

	const handleSelectedMapItem = (node: Node | null) => {
		if (!openLoading) {
			if (node && !(node.content as Model.TreeMapTag).isFolder()) {
				const id = node.content.id;
				if (!mapsTabsTitles.find((model) => model.id === id)) {
					const newListTitles = [...mapsTabsTitles];
					newListTitles.push(Model.Base.create(id, node.content.name));
					setMapsTabsTitles(newListTitles);
					setMapsTabsContents([...mapsTabsContents, null]);
					setMapTabForcedCurrentIndex(newListTitles.findIndex((model) => model.id === id));
				} else {
					setMapTabForcedCurrentIndex(mapsTabsTitles.findIndex((model) => model.id === id));
				}
				dispatch(setCurrentTreeMapTag(node.content as Model.TreeMapTag));
			} else {
				setMapTabForcedCurrentIndex(-1);
				dispatch(setCurrentTreeMapTag(null));
			}
		}
	};

	const handleTabCurrentIndexChanged = async (index: number, model: Model.Base | undefined, isClick: boolean) => {
		if (!openLoading) {
			let id = -1;
			if (index !== -1 && model) {
				id = model.id;
			}
			Project.current!.treeMaps.currentMap = id;
			await Project.current!.treeMaps.save();
			if (isClick) {
				setMapForcedCurrentSelectedItemID(id);
			}
		}
	};

	useEffect(() => {
		Manager.GL.mainContext.initialize();
		Manager.GL.layerOneContext.initialize(1);
		Manager.GL.layerTwoContext.initialize(2);
		Manager.GL.layerThreeContext.initialize(3);
		const observer = new ResizeObserver(() => {
			for (const GL of [
				Manager.GL.mainContext,
				Manager.GL.layerOneContext,
				Manager.GL.layerTwoContext,
				Manager.GL.layerThreeContext,
			]) {
				GL.renderer.setPixelRatio(window.devicePixelRatio);
				GL.renderer.setSize(window.innerWidth, window.innerHeight);
			}
		});
		observer.observe(document.body);
		return () => {
			observer.disconnect();
		};
	}, []);

	// When first opening the project with all data loaded
	useEffect(() => {
		if (!openLoading) {
			const titles = getDefaultTabTitles();
			setMapsTabsTitles(titles);
			setMapsTabsContents(getDefaultTabContents());
			setMapForcedCurrentSelectedItemID(Project.current!.treeMaps.currentMap);
			setMapTabForcedCurrentIndex(titles.findIndex((model) => model.id === Project.current!.treeMaps.currentMap));
			dispatch(setProjectMenuIndex(Project.current!.settings.projectMenuIndex));
			dispatch(
				setCurrentTilesetFloorSpriteTexture(
					Project.current!.settings.mapEditorCurrentTilesetFloorSpriteTexture,
				),
			);
			dispatch(setCurrentAutotileID(Project.current!.settings.mapEditorCurrentAutotileID));
			dispatch(setCurrentAutotileTexture(Project.current!.settings.mapEditorCurrentAutotileTexture));
			dispatch(setCurrentWallID(Project.current!.settings.mapEditorCurrentWallID));
			dispatch(setCurrentMountainID(Project.current!.settings.mapEditorCurrentMountainID));
			dispatch(setCurrentMountainWidthSquaresBot(Project.current!.settings.mapEditorCurrentMountainWidthSquaresBot));
			dispatch(setCurrentMountainWidthPixelsBot(Project.current!.settings.mapEditorCurrentMountainWidthPixelsBot));
			dispatch(setCurrentMountainWidthSquaresTop(Project.current!.settings.mapEditorCurrentMountainWidthSquaresTop));
			dispatch(setCurrentMountainWidthPixelsTop(Project.current!.settings.mapEditorCurrentMountainWidthPixelsTop));
			dispatch(setCurrentMountainWidthSquaresLeft(Project.current!.settings.mapEditorCurrentMountainWidthSquaresLeft));
			dispatch(setCurrentMountainWidthPixelsLeft(Project.current!.settings.mapEditorCurrentMountainWidthPixelsLeft));
			dispatch(setCurrentMountainWidthSquaresRight(Project.current!.settings.mapEditorCurrentMountainWidthSquaresRight));
			dispatch(setCurrentMountainWidthPixelsRight(Project.current!.settings.mapEditorCurrentMountainWidthPixelsRight));
			dispatch(setCurrentMountainAllSides(Project.current!.settings.mapEditorCurrentMountainAllSides));
			dispatch(setCurrentMountainHeightSquares(Project.current!.settings.mapEditorCurrentMountainHeightSquares));
			dispatch(setCurrentMountainHeightPixels(Project.current!.settings.mapEditorCurrentMountainHeightPixels));
			dispatch(
				setCurrentMountainTopFloorIsAutotile(
					Project.current!.settings.mapEditorCurrentMountainTopFloorIsAutotile,
				),
			);
			dispatch(
				setCurrentMountainTopFloorTilesetRect(
					Project.current!.settings.mapEditorCurrentMountainTopFloorTilesetRect,
				),
			);
			dispatch(
				setCurrentMountainTopFloorAutotileID(
					Project.current!.settings.mapEditorCurrentMountainTopFloorAutotileID,
				),
			);
			dispatch(
				setCurrentMountainTopFloorAutotileRect(
					Project.current!.settings.mapEditorCurrentMountainTopFloorAutotileRect,
				),
			);
			dispatch(setCurrentObject3DID(Project.current!.settings.mapEditorCurrentObject3DID));
		}
	}, [openLoading]);

	useEffect(() => {
		if (!openLoading) {
			Project.current!.treeMaps.tabs = mapsTabsTitles.map((model) => model.id);
			Project.current!.treeMaps.save().catch(console.error);
		}
	}, [mapsTabsTitles]);

	return (
		<>
			<Loader large isLoading={openLoading} isHidding={openLoading} />
			<Splitter
				vertical={false}
				defaultLeftSize={266}
				className='flex flexOne'
				mobileHideFirst={projectMenuIndex === 2}
			>
				<Flex column one className='bgDarker scrollable'>
					{!openLoading && (
						<PanelTextures
							visible
							extraContent={
								<TreeMaps
									onSelectedItem={handleSelectedMapItem}
									forcedCurrentSelectedItemID={mapForcedCurrentSelectedItemID}
									setForcedCurrentSelectedItemID={setMapForcedCurrentSelectedItemID}
									mapsTabsTitles={mapsTabsTitles}
									setMapsTabsTitles={setMapsTabsTitles}
									mapsTabsContents={mapsTabsContents}
									setMapsTabsContents={setMapsTabsContents}
								/>
							}
						/>
					)}
				</Flex>
				<Flex column one className={'mapEditorBar ' + (projectMenuIndex !== 2 ? 'mobileHidden' : '')}>
					<div className='mobileHidden'>
						<Tab
							titles={mapsTabsTitles}
							setTitles={setMapsTabsTitles}
							contents={mapsTabsContents}
							setContents={setMapsTabsContents}
							defaultIndex={-1}
							onCurrentIndexChanged={handleTabCurrentIndexChanged}
							forcedCurrentIndex={mapTabForcedCurrentIndex}
							setForcedCurrentIndex={setMapTabForcedCurrentIndex}
							closable
						/>
					</div>
					<Flex column one className={Utils.getClassName({ hidden: !currentMapID })}>
						<MapEditorMenuBar />
						<MapEditor />
					</Flex>
					{!currentMapID && <Flex one centerV centerH>{`${t('select.map')}...`}</Flex>}
				</Flex>
			</Splitter>
		</>
	);
}

export default PanelProject;
