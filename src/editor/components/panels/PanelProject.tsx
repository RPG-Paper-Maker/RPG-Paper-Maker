/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapEditor from '../MapEditor';
import MapEditorMenuBar from '../MapEditorMenuBar';
import Splitter from '../Splitter';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import { LuFolders } from 'react-icons/lu';
import { MdOutlineWallpaper } from 'react-icons/md';
import Tab from '../Tab';
import { Utils } from '../../common/Utils';
import Tree from '../Tree';
import { Model } from '../../Editor';
import { Node } from '../../core/Node';
import { TreeMapTag } from '../../models';
import { RootState, setCurrentMapID } from '../../store';
import PanelTextures from './PanelTextures';
import Loader from '../Loader';

function PanelProject() {
	const [projectMenuIndex, setProjectMenuIndex] = useState(1);
	const [mapsTabsTitles, setMapsTabsTitles] = useState<Model.Base[]>([]);
	const [mapsTabsContents, setMapsTabsContents] = useState<ReactNode[]>([]);
	const [mapForcedCurrentSelectedItemID, setMapForcedCurrentSelectedItemID] = useState<number | null>(null);
	const [mapTabForcedCurrentIndex, setMapTabForcedCurrentIndex] = useState<number | null>(null);

	const dispatch = useDispatch();

	const currentMapID = useSelector((state: RootState) => state.mapEditor.currentID);
	const openLoading = useSelector((state: RootState) => state.projects.openLoading);

	const mapNodes = [
		new Node(new Model.TreeMapTag(-1, 'Maps'), [
			new Node(new Model.TreeMapTag(-2, 'Introduction'), [new Node(new Model.TreeMapTag(1, 'Starting map'))]),
			new Node(new Model.TreeMapTag(-3, 'Battle maps'), [new Node(new Model.TreeMapTag(2, 'Default battle'))]),
		]),
	];

	const handleSelectedMapItem = (node: Node | null, isClick: boolean) => {
		if (node && !(node.content as TreeMapTag).isFolder()) {
			let title = node.getPath();
			title = title.substring(5, title.length);
			if (!mapsTabsTitles.find((model) => model.id === node.content.id)) {
				const newListTitles = [...mapsTabsTitles];
				newListTitles.push(new Model.Base(node.content.id, title));
				setMapsTabsTitles(newListTitles);
				setMapsTabsContents([...mapsTabsContents, null]);
				setMapTabForcedCurrentIndex(newListTitles.findIndex((model) => model.id === node.content.id));
			} else {
				setMapTabForcedCurrentIndex(mapsTabsTitles.findIndex((model) => model.id === node.content.id));
			}

			dispatch(setCurrentMapID(node.content.id));
		} else {
			setMapTabForcedCurrentIndex(-1);
			dispatch(setCurrentMapID(-1));
		}
	};

	const handleTabCurrentIndexChanged = (index: number, model: Model.Base, isClick: boolean) => {
		if (isClick) {
			if (index !== -1 && model) {
				setMapForcedCurrentSelectedItemID(model.id);
				dispatch(setCurrentMapID(model.id));
			} else {
				setMapForcedCurrentSelectedItemID(-1);
				dispatch(setCurrentMapID(-1));
			}
		}
	};

	return (
		<>
			<Loader large isLoading={openLoading} isHidding={openLoading} />
			<Splitter vertical={false} defaultLeftSize={266} className='flex flex-one'>
				<div className='bg-darker flex-column flex-one scrollable'>
					<Menu horizontal isActivable activeIndex={projectMenuIndex} setActiveIndex={setProjectMenuIndex}>
						<MenuItem icon={<LuFolders />}></MenuItem>
						<MenuItem icon={<MdOutlineWallpaper />}></MenuItem>
					</Menu>
					<div className={Utils.getClassName([[projectMenuIndex !== 0, 'hidden']], ['flex', 'flex-one'])}>
						<Tree
							list={mapNodes}
							defaultSelectedID={1}
							onSelectedItem={handleSelectedMapItem}
							forcedCurrentSelectedItemID={mapForcedCurrentSelectedItemID}
							setForcedCurrentSelectedItemID={setMapForcedCurrentSelectedItemID}
						/>
					</div>
					<PanelTextures visible={projectMenuIndex === 1} />
				</div>
				<div className='flex-column flex-one map-editor-bar'>
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
					<div className={Utils.getClassName([[currentMapID < 0, 'hidden']], ['flex-column flex-one'])}>
						<MapEditorMenuBar />
						<MapEditor />
					</div>
					{currentMapID <= 0 && (
						<div className='flex-one flex-center-vertically flex-center-horizontally'>Select a map...</div>
					)}
				</div>
			</Splitter>
		</>
	);
}

export default PanelProject;
