/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { Model } from '../Editor';
import { ArrayUtils, Utils } from '../common';
import '../styles/Tab.css';
import Button from './Button';
import ContextMenu from './ContextMenu';
import Flex from './Flex';

type Props = {
	titles: Model.Base[];
	setTitles?: (titles: Model.Base[]) => void;
	contents?: ReactNode[];
	setContents?: (contents: ReactNode[]) => void;
	defaultIndex?: number;
	closable?: boolean;
	hideScroll?: boolean;
	onCurrentIndexChanged?: (index: number, model: Model.Base | undefined, isClick: boolean) => void;
	forcedCurrentIndex?: number | null;
	setForcedCurrentIndex?: (forced: number | null) => void;
	padding?: boolean;
	scrollableContent?: boolean;
	lazyLoadingContent?: boolean;
	minHeightContent?: string;
	disabled?: boolean;
	noScrollToSelectedElement?: boolean;
};

function Tab({
	titles,
	setTitles,
	contents = [],
	setContents,
	defaultIndex = 0,
	closable = false,
	hideScroll = false,
	onCurrentIndexChanged,
	forcedCurrentIndex,
	setForcedCurrentIndex,
	padding = false,
	scrollableContent = false,
	lazyLoadingContent = false,
	minHeightContent,
	disabled = false,
	noScrollToSelectedElement = false,
}: Props) {
	const { t } = useTranslation();

	const [currentIndex, setCurrentIndex] = useState(defaultIndex);
	const [nextIndex, setNextIndex] = useState(defaultIndex); // Needed to make scrolling work properly on direct click...
	const [openedTabs, setOpenedTabs] = useState<number[]>([]);

	const selectedElementRef = useRef<HTMLDivElement>(null);

	const scrollToSelectedElement = () => {
		if (!noScrollToSelectedElement && selectedElementRef.current) {
			selectedElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
		}
	};

	const handleClickClose = (e: React.MouseEvent<SVGElement, MouseEvent>, title: Model.Base) => {
		e.stopPropagation();
		if (disabled) {
			return;
		}
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
		if (disabled) {
			return;
		}
		setNextIndex(index);
	};

	const handleCloseAll = async () => {
		setTitles?.([]);
		setContents?.([]);
		setCurrentIndex(-1);
		if (onCurrentIndexChanged) {
			onCurrentIndexChanged(-1, undefined, true);
		}
	};

	const handleClickLeftButton = () => {
		if (disabled) {
			return;
		}
		handleClickItem(currentIndex === 0 ? 0 : currentIndex - 1);
	};

	const handleClickRightButton = () => {
		if (disabled) {
			return;
		}
		handleClickItem(currentIndex === titles.length - 1 ? titles.length - 1 : currentIndex + 1);
	};

	useLayoutEffect(() => {
		if (forcedCurrentIndex !== undefined && forcedCurrentIndex !== null && setForcedCurrentIndex) {
			setCurrentIndex(forcedCurrentIndex);
			if (onCurrentIndexChanged) {
				onCurrentIndexChanged(forcedCurrentIndex, titles[forcedCurrentIndex], false);
			}
			setForcedCurrentIndex(null);
		}
	}, [forcedCurrentIndex, setForcedCurrentIndex]);

	useEffect(() => {
		if (nextIndex !== -1) {
			setCurrentIndex(nextIndex);
			if (onCurrentIndexChanged) {
				onCurrentIndexChanged(nextIndex, titles[nextIndex], true);
			}
			setNextIndex(-1);
		}
	}, [nextIndex, setNextIndex]);

	useEffect(() => {
		scrollToSelectedElement();
		if (!openedTabs.includes(currentIndex)) {
			setOpenedTabs([...openedTabs, currentIndex]);
		}
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
					className={Utils.getClassName({ selected: selected && !disabled, disabled }, 'tabItem')}
					onClick={() => handleClickItem(index)}
				>
					{title.getName()}
					{closable && <RxCross2 onClick={(e) => handleClickClose(e, title)} />}
				</div>
			);
		});

	const getContents = () =>
		lazyLoadingContent
			? contents
					.map((content, index) => (
						<Flex column one key={index} style={{ display: currentIndex === index ? 'flex' : 'none' }}>
							{content}
						</Flex>
					))
					.filter((content, index) => openedTabs.includes(index))
			: contents[currentIndex];

	return (
		<div className='tab'>
			<div className='tabTitles'>
				<div className={hideScroll ? 'flex' : 'scrollArea'}>
					<ContextMenu
						items={[
							{
								title: t('close.all'),
								disabled: titles.length === 0,
								onClick: handleCloseAll,
							},
						]}
						isFocused={false}
						setIsFocused={() => {}}
						column={false}
					>
						{getTitles()}
					</ContextMenu>
				</div>
				{!hideScroll && (
					<>
						<Button
							small
							icon={<FaCaretLeft />}
							onClick={handleClickLeftButton}
							disabled={disabled || currentIndex === 0}
						/>
						<Button
							small
							icon={<FaCaretRight />}
							onClick={handleClickRightButton}
							disabled={disabled || currentIndex === titles.length - 1}
						/>
					</>
				)}
			</div>
			<div
				className={Utils.getClassName(
					{ padding, scrollable: scrollableContent, zeroHeight: scrollableContent },
					'tabContent',
				)}
				style={minHeightContent ? { minHeight: minHeightContent } : undefined}
			>
				{getContents()}
			</div>
		</div>
	);
}

export default Tab;
