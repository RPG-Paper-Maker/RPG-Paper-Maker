/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import '../../styles/PanelSpecialElementsSelection.css';
import { HiChevronDown, HiChevronLeft } from 'react-icons/hi';
import TextureSquareSelector from '../TextureSquareSelector';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCurrentAutotileID, setCurrentAutotileTexture, setCurrentWallID } from '../../store';
import { Model, Scene } from '../../Editor';
import { ELEMENT_MAP_KIND, PICTURE_KIND, Utils } from '../../common';
import { Project, Rectangle } from '../../core';

type Props = {
	kind: PICTURE_KIND;
};

function PanelSpecialElementsSelection({ kind }: Props) {
	const dispatch = useDispatch();
	const list =
		kind === PICTURE_KIND.AUTOTILES
			? Project.current!.specialElements.autotiles
			: Project.current!.specialElements.walls;

	const currentAutotileID = useSelector((state: RootState) => state.mapEditor.currentAutotileID);
	const currentWallID = useSelector((state: RootState) => state.mapEditor.currentWallID);

	const canExpand = kind === PICTURE_KIND.AUTOTILES;

	const getChevron = (selected: boolean) => {
		if (canExpand) {
			return selected ? <HiChevronDown /> : <HiChevronLeft />;
		} else {
			return null;
		}
	};

	const handleClick = async (id: number) => {
		switch (Scene.Map.currentSelectedMapElementKind) {
			case ELEMENT_MAP_KIND.AUTOTILE:
				if (id !== currentAutotileID) {
					dispatch(setCurrentAutotileID(id));
					Scene.Map.currentSelectedAutotileID = id;
					Project.current!.settings.mapEditorCurrentAutotileID = id;
					const rectangle = new Rectangle();
					dispatch(setCurrentAutotileTexture(rectangle));
					Scene.Map.currentSelectedAutotileTexture = rectangle;
					Project.current!.settings.mapEditorCurrentAutotileTexture = rectangle;
				}
				break;
			case ELEMENT_MAP_KIND.SPRITE_WALL:
				if (id !== currentWallID) {
					dispatch(setCurrentWallID(id));
					Scene.Map.currentSelectedWallID = id;
					Project.current!.settings.mapEditorCurrentWallID = id;
				}
				break;
			default:
				break;
		}
		Project.current!.settings!.save();
	};

	const currentID = kind === PICTURE_KIND.AUTOTILES ? currentAutotileID : currentWallID;

	const listElements = list
		? list.map((element) => {
				const picture = Project.current!.pictures.getByID(kind, element.pictureID);
				const selected = currentID === element.id;
				return (
					<div
						className={Utils.getClassName([[selected, 'selected']], ['panel-special-element'])}
						key={element.id}
						onClick={() => handleClick(element.id)}
					>
						<div className='title'>
							<div className='picture-container'>
								<img src={picture.getPath()} alt={'icon'} />
							</div>
							<div className='flex-one'>{element.toStringNameID()}</div>
							{getChevron(selected)}
						</div>
						{canExpand && selected && (
							<div className='content'>
								<TextureSquareSelector
									texture={picture.getPath()}
									divideWidth={(element as Model.Autotile).isAnimated ? 8 : 2}
									divideHeight={3}
									canChangeSize={false}
								/>
							</div>
						)}
					</div>
				);
		  })
		: [];

	return <div className='panel-special-elements'>{listElements}</div>;
}

export default PanelSpecialElementsSelection;
