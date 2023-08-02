/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Picture2D } from '../../core/Picture2D';
import MapEditor from '../MapEditor';
import MapEditorMenuBar from '../MapEditorMenuBar';
import Splitter from '../Splitter';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import { LuFolders } from 'react-icons/lu';
import { MdOutlineWallpaper } from 'react-icons/md';
import Tab from '../Tab';
import Previewer3D from '../Previewer3D';
import { Utils } from '../../common/Utils';
import Tree from '../Tree';
import { Model } from '../../Editor';
import { Node } from '../../core/Node';
import { TreeMapTag } from '../../models';
import { RootState, setCurrentMapID } from '../../store';

function PanelProject() {
	const refCanvas = useRef<HTMLCanvasElement>(null);
	const refTilesetPreviewDiv = useRef<HTMLDivElement>(null);
	const refTileset = useRef<HTMLDivElement>(null);
	const refPreviewer = useRef<HTMLDivElement>(null);
	const [picture, setPicture] = useState<HTMLImageElement | null>(null);
	const [pictureCursor, setPictureCursor] = useState<HTMLImageElement | null>(null);
	const [projectMenuIndex, setProjectMenuIndex] = useState(1);
	const [mapsTabsTitles, setMapsTabsTitles] = useState<Model.Base[]>([]);
	const [mapsTabsContents, setMapsTabsContents] = useState<ReactNode[]>([]);
	const [mapForcedCurrentSelectedItemID, setMapForcedCurrentSelectedItemID] = useState<number | null>(null);
	const [mapTabForcedCurrentIndex, setMapTabForcedCurrentIndex] = useState<number | null>(null);

	const dispatch = useDispatch();

	const currentMapID = useSelector((state: RootState) => state.projects.currentMapID);

	const mapNodes = [
		new Node(new Model.TreeMapTag(-1, 'Maps'), [
			new Node(new Model.TreeMapTag(-2, 'Introduction'), [new Node(new Model.TreeMapTag(1, 'Starting map'))]),
			new Node(new Model.TreeMapTag(-3, 'Battle maps'), [new Node(new Model.TreeMapTag(2, 'Default battle'))]),
		]),
	];

	const initialize = async () => {
		let newPicture = await Picture2D.loadImage('./assets/textures/plains-woods.png');
		setPicture(newPicture);
		newPicture = await Picture2D.loadImage('./assets/textures/tileset-cursor.png');
		setPictureCursor(newPicture);
	};

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

	useEffect(() => {
		if (projectMenuIndex === 1) {
			if (refCanvas.current && picture && pictureCursor) {
				const ctx = refCanvas.current.getContext('2d');
				if (ctx) {
					refCanvas.current!.width = picture.width * 2;
					refCanvas.current!.height = picture.height * 2;
					ctx.clearRect(0, 0, refCanvas.current.offsetWidth, refCanvas.current.offsetHeight);
					ctx.lineWidth = 1;
					ctx.imageSmoothingEnabled = false;
					ctx.drawImage(picture, 0, 0, picture.width * 2, picture.height * 2);
					ctx.drawImage(pictureCursor, 0, 0, pictureCursor.width, pictureCursor.height);
				}
			}
			if (refTilesetPreviewDiv.current && refTileset.current && refPreviewer.current) {
				const height =
					refTilesetPreviewDiv.current.getBoundingClientRect().height -
					refPreviewer.current.getBoundingClientRect().height -
					10;
				refTileset.current.style.height = `${height}px`;
			}
		}
	});

	useEffect(() => {
		initialize().catch(console.error);
		// eslint-disable-next-line
	}, []);

	return (
		<Splitter vertical={false} size={266} className='flex flex-one'>
			<div className='bg-darker flex-column flex-one'>
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
				<div
					ref={refTilesetPreviewDiv}
					className={Utils.getClassName(
						[[projectMenuIndex !== 1, 'hidden']],
						['flex-column', 'flex-one', 'gap-small']
					)}
				>
					<div ref={refTileset} className='scrollable'>
						<canvas ref={refCanvas}></canvas>
					</div>
					<div ref={refPreviewer} className='flex' style={{ maxWidth: '266px' }}>
						<Previewer3D id='texture-previewer' />
					</div>
				</div>
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
	);
}

export default PanelProject;
