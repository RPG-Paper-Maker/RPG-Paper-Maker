/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { ArrayUtils } from '../common/ArrayUtils';
import '../styles/Tab.css';
import { Utils } from '../common/Utils';
import { Model } from '../Editor';

type Props = {
	titles: Model.Base[];
	setTitles: (titles: Model.Base[]) => void;
	contents: ReactNode[];
	setContents: (contents: ReactNode[]) => void;
	isClosable?: boolean;
	onCurrentIndexChanged?: (index: number, model: Model.Base, isClick: boolean) => void;
	forcedCurrentIndex?: number | null;
	setForcedCurrentIndex?: (forced: number | null) => void;
};

function Tab({
	titles,
	setTitles,
	contents,
	setContents,
	isClosable = false,
	onCurrentIndexChanged,
	forcedCurrentIndex,
	setForcedCurrentIndex,
}: Props) {
	const [currentIndex, setCurrentIndex] = useState(-1);

	const handleClickClose = (e: React.MouseEvent<SVGElement, MouseEvent>, title: Model.Base) => {
		e.stopPropagation();
		const newTitlesList = [...titles];
		const index = newTitlesList.findIndex((model) => model.id === title.id);
		if (index !== -1) {
			ArrayUtils.removeAt(newTitlesList, index);
			setTitles(newTitlesList);
			const newContentsList = [...contents];
			ArrayUtils.removeAt(newContentsList, index);
			setContents(newContentsList);
			if (currentIndex >= index) {
				const newIndex = newTitlesList.length - 1;
				setCurrentIndex(newIndex);
				if (onCurrentIndexChanged) {
					onCurrentIndexChanged(newIndex, newTitlesList[newIndex], true);
				}
			}
		}
	};

	const handleClickItem = (index: number) => {
		setCurrentIndex(index);
		if (onCurrentIndexChanged) {
			onCurrentIndexChanged(index, titles[index], true);
		}
	};

	useEffect(() => {
		if (forcedCurrentIndex !== undefined && forcedCurrentIndex !== null && setForcedCurrentIndex) {
			setCurrentIndex(forcedCurrentIndex);
			if (onCurrentIndexChanged) {
				onCurrentIndexChanged(forcedCurrentIndex, titles[forcedCurrentIndex], false);
			}
		}
	}, [forcedCurrentIndex, setForcedCurrentIndex]);

	const getTitles = () =>
		titles.map((title, index) => {
			return (
				<div
					key={title.id}
					className={Utils.getClassName([[currentIndex === index, 'selected']], ['tab-item'])}
					onClick={() => handleClickItem(index)}
				>
					{title.name}
					{isClosable && <RxCross2 onClick={(e) => handleClickClose(e, title)} />}
				</div>
			);
		});

	const getContents = () => [contents[currentIndex]]; // TODO: only hide when it was opened at least once;

	return (
		<div className='tab'>
			<div className='tab-titles'>{getTitles()}</div>
			<div className='tab-content'>{getContents()}</div>
		</div>
	);
}

export default Tab;
