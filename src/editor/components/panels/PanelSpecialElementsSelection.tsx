/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect } from 'react';
import '../../styles/PanelSpecialElementsSelection.css';
import { HiChevronDown, HiChevronLeft } from 'react-icons/hi';
import TextureSquareSelector from '../TextureSquareSelector';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCurrentSpecialElementID } from '../../store';
import { Model, Scene } from '../../Editor';
import { PictureKind, Utils } from '../../common';
import { Project } from '../../core';

type Props = {
	kind: PictureKind;
};

function PanelSpecialElementsSelection({ kind }: Props) {
	const dispatch = useDispatch();
	const list =
		kind === PictureKind.Autotiles
			? Project.current!.specialElements.autotiles
			: Project.current!.specialElements.walls;

	const currentSpecialElementID = useSelector((state: RootState) => state.mapEditor.currentSpecialElementID);

	const canExpand = kind === PictureKind.Autotiles;

	const getChevron = (selected: boolean) => {
		if (canExpand) {
			return selected ? <HiChevronDown /> : <HiChevronLeft />;
		} else {
			return null;
		}
	};

	const handleClick = (id: number) => {
		dispatch(setCurrentSpecialElementID(id));
		Scene.Map.currentSelectedSpecialElementID = id;
	};

	const listElements = list
		? list.map((element) => {
				const picture = Project.current!.pictures.getByID(kind, element.pictureID);
				const selected = currentSpecialElementID === element.id;
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

	useEffect(() => {
		const id = list?.at(0)?.id || -1;
		dispatch(setCurrentSpecialElementID(id));
		Scene.Map.currentSelectedSpecialElementID = id;
	}, []);

	return <div className='panel-special-elements'>{listElements}</div>;
}

export default PanelSpecialElementsSelection;
