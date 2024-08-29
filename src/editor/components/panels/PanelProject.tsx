/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuFolders } from 'react-icons/lu';
import { MdOutlineWallpaper } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Utils } from '../../common';
import { Node, Project } from '../../core';
import { Manager, Model } from '../../Editor';
import {
	RootState,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentMountainHeightPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainID,
	setCurrentMountainWidthPixels,
	setCurrentMountainWidthSquares,
	setCurrentObject3DID,
	setCurrentTilesetFloorTexture,
	setCurrentTilesetSpriteTexture,
	setCurrentTreeMapTag,
	setCurrentWallID,
	setProjectMenuIndex,
} from '../../store';
import Flex from '../Flex';
import Loader from '../Loader';
import MapEditor from '../MapEditor';
import MapEditorMenuBar from '../MapEditorMenuBar';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
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
			Model.Base.create(id, Node.getNameByID(Project.current!.treeMaps.tree, id))
		);

	const getDefaultTabContents = () => Project.current!.treeMaps.tabs.map(() => null);

	const updateProjectMenuIndex = async (index: number) => {
		dispatch(setProjectMenuIndex(index));
		Project.current!.settings.projectMenuIndex = index;
		await Project.current!.settings.save();
	};

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

	const handleTabCurrentIndexChanged = async (index: number, model: Model.Base, isClick: boolean) => {
		if (!openLoading && !isClick) {
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
	}, []);

	// When first opening the project with all data loaded
	useEffect(() => {
		if (!openLoading) {
			setMapsTabsTitles(getDefaultTabTitles());
			setMapsTabsContents(getDefaultTabContents());
			setMapForcedCurrentSelectedItemID(Project.current!.treeMaps.currentMap);
			dispatch(setProjectMenuIndex(Project.current!.settings.projectMenuIndex));
			dispatch(setCurrentTilesetFloorTexture(Project.current!.settings.mapEditorCurrentTilesetFloorTexture));
			dispatch(setCurrentTilesetSpriteTexture(Project.current!.settings.mapEditorCurrentTilesetSpriteTexture));
			dispatch(setCurrentAutotileID(Project.current!.settings.mapEditorCurrentAutotileID));
			dispatch(setCurrentAutotileTexture(Project.current!.settings.mapEditorCurrentAutotileTexture));
			dispatch(setCurrentWallID(Project.current!.settings.mapEditorCurrentWallID));
			dispatch(setCurrentMountainID(Project.current!.settings.mapEditorCurrentMountainID));
			dispatch(setCurrentMountainWidthSquares(Project.current!.settings.mapEditorCurrentMountainWidthSquares));
			dispatch(setCurrentMountainWidthPixels(Project.current!.settings.mapEditorCurrentMountainWidthPixels));
			dispatch(setCurrentMountainHeightSquares(Project.current!.settings.mapEditorCurrentMountainHeightSquares));
			dispatch(setCurrentMountainHeightPixels(Project.current!.settings.mapEditorCurrentMountainHeightPixels));
			dispatch(setCurrentObject3DID(Project.current!.settings.mapEditorCurrentObject3DID));
		}
		// eslint-disable-next-line
	}, [openLoading]);

	useEffect(() => {
		if (!openLoading) {
			Project.current!.treeMaps.tabs = mapsTabsTitles.map((model) => model.id);
			Project.current!.treeMaps.save().catch(console.error);
		}
		// eslint-disable-next-line
	}, [mapsTabsTitles]);

	return (
		<>
			<Loader large isLoading={openLoading} isHidding={openLoading} />
			<Splitter
				vertical={false}
				defaultLeftSize={266}
				className='flex flex-one'
				mobileHideFirst={projectMenuIndex === 2}
			>
				<Flex column one className='bg-darker scrollable'>
					{!openLoading && (
						<>
							<div className='mobile-hidden'>
								<Menu
									horizontal
									isActivable
									activeIndex={projectMenuIndex}
									setActiveIndex={updateProjectMenuIndex}
								>
									<MenuItem icon={<LuFolders />}></MenuItem>
									<MenuItem icon={<MdOutlineWallpaper />}></MenuItem>
								</Menu>
							</div>
							<Flex one className={Utils.getClassName({ hidden: projectMenuIndex !== 0 })}>
								<TreeMaps
									onSelectedItem={handleSelectedMapItem}
									forcedCurrentSelectedItemID={mapForcedCurrentSelectedItemID}
									setForcedCurrentSelectedItemID={setMapForcedCurrentSelectedItemID}
									mapsTabsTitles={mapsTabsTitles}
									setMapsTabsTitles={setMapsTabsTitles}
									mapsTabsContents={mapsTabsContents}
									setMapsTabsContents={setMapsTabsContents}
								/>
							</Flex>
							<PanelTextures visible={projectMenuIndex === 1} />
						</>
					)}
				</Flex>
				<Flex column one className={'map-editor-bar ' + (projectMenuIndex !== 2 ? 'mobile-hidden' : '')}>
					<div className='mobile-hidden'>
						<Tab
							titles={mapsTabsTitles}
							setTitles={setMapsTabsTitles}
							contents={mapsTabsContents}
							setContents={setMapsTabsContents}
							defaultIndex={-1}
							onCurrentIndexChanged={handleTabCurrentIndexChanged}
							forcedCurrentIndex={mapTabForcedCurrentIndex}
							setForcedCurrentIndex={setMapTabForcedCurrentIndex}
							isClosable
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
