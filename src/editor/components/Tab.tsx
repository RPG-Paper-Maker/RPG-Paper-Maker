/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { Model } from '../Editor';
import { ArrayUtils, Utils } from '../common';
import '../styles/Tab.css';
import Button from './Button';

type Props = {
	titles: Model.Base[];
	setTitles?: (titles: Model.Base[]) => void;
	contents: ReactNode[];
	setContents?: (contents: ReactNode[]) => void;
	defaultIndex?: number;
	closable?: boolean;
	hideScroll?: boolean;
	onCurrentIndexChanged?: (index: number, model: Model.Base, isClick: boolean) => void;
	forcedCurrentIndex?: number | null;
	setForcedCurrentIndex?: (forced: number | null) => void;
	padding?: boolean;
};

function Tab({
	titles,
	setTitles,
	contents,
	setContents,
	defaultIndex = 0,
	closable = false,
	hideScroll = false,
	onCurrentIndexChanged,
	forcedCurrentIndex,
	setForcedCurrentIndex,
	padding = false,
}: Props) {
	const [currentIndex, setCurrentIndex] = useState(defaultIndex);
	const [nextIndex, setNextIndex] = useState(defaultIndex); // Needed to make scrolling work properly on direct click...

	const selectedElementRef = useRef<HTMLDivElement>(null);

	const scrollToSelectedElement = () => {
		if (selectedElementRef.current) {
			selectedElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
		}
	};

	const handleClickClose = (e: React.MouseEvent<SVGElement, MouseEvent>, title: Model.Base) => {
		e.stopPropagation();
		const newTitlesList = [...titles];
		const index = newTitlesList.findIndex((model) => model.id === title.id);
		if (index !== -1) {
			ArrayUtils.removeAt(newTitlesList, index);
			setTitles?.(newTitlesList);
			const newContentsList = [...contents];
			ArrayUtils.removeAt(newContentsList, index);
			setContents?.(newContentsList);
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
		setNextIndex(index);
		if (onCurrentIndexChanged) {
			onCurrentIndexChanged(index, titles[index], true);
		}
	};

	const handleClickLeftButton = () => {
		handleClickItem(currentIndex === 0 ? 0 : currentIndex - 1);
	};

	const handleClickRightButton = () => {
		handleClickItem(currentIndex === titles.length - 1 ? titles.length - 1 : currentIndex + 1);
	};

	useEffect(() => {
		if (forcedCurrentIndex !== undefined && forcedCurrentIndex !== null && setForcedCurrentIndex) {
			setCurrentIndex(forcedCurrentIndex);
			if (onCurrentIndexChanged) {
				onCurrentIndexChanged(forcedCurrentIndex, titles[forcedCurrentIndex], false);
			}
			setForcedCurrentIndex(null);
		}
		// eslint-disable-next-line
	}, [forcedCurrentIndex, setForcedCurrentIndex]);

	useEffect(() => {
		if (nextIndex !== -1) {
			setCurrentIndex(nextIndex);
			if (onCurrentIndexChanged) {
				onCurrentIndexChanged(nextIndex, titles[nextIndex], true);
			}
			setNextIndex(-1);
		}
		// eslint-disable-next-line
	}, [nextIndex, setNextIndex]);

	useEffect(() => {
		scrollToSelectedElement();
		// eslint-disable-next-line
	}, [currentIndex]);

	useEffect(() => {
		scrollToSelectedElement();
	}, []);

	const getTitles = () =>
		titles.map((title, index) => {
			const selected = currentIndex === index;
			return (
				<div
					ref={selected ? selectedElementRef : null}
					key={index}
					className={Utils.getClassName({ selected }, 'tabItem')}
					onClick={() => handleClickItem(index)}
				>
					{title.getName()}
					{closable && <RxCross2 onClick={(e) => handleClickClose(e, title)} />}
				</div>
			);
		});

	const getContents = () => [contents[currentIndex]]; // TODO: only hide when it was opened at least once;

	return (
		<div className='tab'>
			<div className='tabTitles'>
				<div className={hideScroll ? 'flex' : 'scroll-area'}>{getTitles()}</div>
				{!hideScroll && (
					<>
						<Button
							small
							icon={<FaCaretLeft />}
							onClick={handleClickLeftButton}
							disabled={currentIndex === 0}
						/>
						<Button
							small
							icon={<FaCaretRight />}
							onClick={handleClickRightButton}
							disabled={currentIndex === titles.length - 1}
						/>
					</>
				)}
			</div>
			<div className={Utils.getClassName({ padding }, 'tabContent')}>{getContents()}</div>
		</div>
	);
}

export default Tab;
