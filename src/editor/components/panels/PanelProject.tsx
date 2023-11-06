/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapEditor from '../MapEditor';
import MapEditorMenuBar from '../MapEditorMenuBar';
import Splitter from '../Splitter';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import { LuFolders } from 'react-icons/lu';
import { MdOutlineWallpaper } from 'react-icons/md';
import Tab from '../Tab';
import { Model } from '../../Editor';
import { RootState, setCurrentTreeMapTag, setProjectMenuIndex } from '../../store';
import PanelTextures from './PanelTextures';
import Loader from '../Loader';
import TreeMaps from '../TreeMaps';
import { Node, Project } from '../../core';
import { Utils } from '../../common';

function PanelProject() {
	const [mapsTabsTitles, setMapsTabsTitles] = useState<Model.Base[]>([]);
	const [mapsTabsContents, setMapsTabsContents] = useState<(ReactNode | null)[]>([]);
	const [mapForcedCurrentSelectedItemID, setMapForcedCurrentSelectedItemID] = useState<number | null>(null);
	const [mapTabForcedCurrentIndex, setMapTabForcedCurrentIndex] = useState<number | null>(null);

	const dispatch = useDispatch();

	const currentMapID = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag?.id);
	const openLoading = useSelector((state: RootState) => state.projects.openLoading);
	const triggersTreeMap = useSelector((state: RootState) => state.triggers.treeMap);
	const projectMenuIndex = useSelector((state: RootState) => state.projects.menuIndex);

	const getDefaultTabTitles = () =>
		Project.current!.treeMaps.tabs.map((id) => {
			const node = Node.getNodeByID(Project.current!.treeMaps.tree, id);
			return Model.Base.create(id, node ? node.getPath(false) : 'ERROR: Cannot find path');
		});

	const getDefaultTabContents = () => Project.current!.treeMaps.tabs.map(() => null);

	const updateProjectMenuIndex = async (index: number) => {
		dispatch(setProjectMenuIndex(index));
		Project.current!.settings.projectMenuIndex = index;
		await Project.current!.settings.save();
	};

	const handleSelectedMapItem = (node: Node | null, isClick: boolean) => {
		if (!openLoading) {
			if (node && !(node.content as Model.TreeMapTag).isFolder()) {
				const id = node.content.id;
				const title = node.getPath(false);
				if (!mapsTabsTitles.find((model) => model.id === id)) {
					const newListTitles = [...mapsTabsTitles];
					newListTitles.push(Model.Base.create(id, title));
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
		setMapsTabsTitles(
			mapsTabsTitles.map((model) => {
				const node = Node.getNodeByID(Project.current!.treeMaps.tree, model.id);
				if (node) {
					return Model.Base.create(model.id, node.getPath(false));
				}
				return model;
			})
		);
		// eslint-disable-next-line
	}, [triggersTreeMap]);

	useEffect(() => {
		if (!openLoading) {
			Project.current!.treeMaps.tabs = mapsTabsTitles.map((model) => model.id);
			Project.current!.treeMaps.save().catch(console.error);
		}
	}, [mapsTabsTitles]);

	// When first opening the project with all data loaded
	useEffect(() => {
		if (!openLoading) {
			setMapsTabsTitles(getDefaultTabTitles());
			setMapsTabsContents(getDefaultTabContents());
			setMapForcedCurrentSelectedItemID(Project.current!.treeMaps.currentMap);
			dispatch(setProjectMenuIndex(Project.current!.settings.projectMenuIndex));
		}
	}, [openLoading]);

	return (
		<>
			<Loader large isLoading={openLoading} isHidding={openLoading} />
			<Splitter
				vertical={false}
				defaultLeftSize={266}
				className='flex flex-one'
				mobileHideFirst={projectMenuIndex === 2}
			>
				<div className='bg-darker flex-column flex-one scrollable'>
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
							<div
								className={Utils.getClassName(
									[[projectMenuIndex !== 0, 'hidden']],
									['flex', 'flex-one']
								)}
							>
								<TreeMaps
									onSelectedItem={handleSelectedMapItem}
									forcedCurrentSelectedItemID={mapForcedCurrentSelectedItemID}
									setForcedCurrentSelectedItemID={setMapForcedCurrentSelectedItemID}
								/>
							</div>
							<PanelTextures visible={projectMenuIndex === 1} />
						</>
					)}
				</div>
				<div
					className={'flex-column flex-one map-editor-bar ' + (projectMenuIndex !== 2 ? 'mobile-hidden' : '')}
				>
					<div className='mobile-hidden'>
						<Tab
							titles={mapsTabsTitles}
							setTitles={setMapsTabsTitles}
							contents={mapsTabsContents}
							setContents={setMapsTabsContents}
							onCurrentIndexChanged={handleTabCurrentIndexChanged}
							forcedCurrentIndex={mapTabForcedCurrentIndex}
							setForcedCurrentIndex={setMapTabForcedCurrentIndex}
							isClosable
						/>
					</div>
					<div className={Utils.getClassName([[!currentMapID, 'hidden']], ['flex-column flex-one'])}>
						<MapEditorMenuBar />
						<MapEditor />
					</div>
					{!currentMapID && (
						<div className='flex-one flex-center-vertically flex-center-horizontally'>Select a map...</div>
					)}
				</div>
			</Splitter>
		</>
	);
}

export default PanelProject;
