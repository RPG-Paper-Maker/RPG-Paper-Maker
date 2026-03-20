/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MenuItemType, Utils } from '../common';
import { RootState } from '../store';
import Flex from './Flex';
import MenuCustom from './MenuCustom';

type Props = {
	children: ReactNode;
	items?: MenuItemType[];
	isFocused: boolean;
	setIsFocused: (b: boolean) => void;
	column?: boolean;
	disabled?: boolean;
};

function ContextMenu({ children, items = [], isFocused, setIsFocused, column = true, disabled = false }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [timerID, setTimerID] = useState<NodeJS.Timeout | undefined>();
	const refComplete = useRef<HTMLDivElement>(null);
	const refMenu = useRef<HTMLDivElement>(null);

	const isOpeningNewDialog = useSelector((state: RootState) => state.triggers.isOpeningNewDialog);

	const openContext = (x: number, y: number) => {
		setIsOpen(true);
		if (refMenu.current) {
			x -= Utils.getViewportLeft();
			y -= Utils.getViewportTop();
			refMenu.current.style.left = `${x}px`;
			refMenu.current.style.top = `${y}px`;
		}
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (disabled) {
			return;
		}
		setIsFocused(true);
		switch (e.button) {
			case 0:
				setTimeout(() => {
					// Small wait to let selected item time for onClick method to be triggered before hidding
					setIsOpen(false);
				}, 200);
				break;
			case 2:
				setIsOpen(false);
				setTimeout(() => {
					openContext(e.pageX, e.pageY);
				}, 100);
				break;
		}
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
		if (disabled) {
			return;
		}
		const id = setTimeout(() => {
			openContext(e.touches[0].pageX, e.touches[0].pageY);
		}, 500);
		setTimerID(id);
	};

	const handleTouchMove = () => {
		clearTimeout(timerID);
		setTimerID(undefined);
	};

	// Function to handle touch end event
	const handleTouchEnd = () => {
		// Clear the timer when touch ends
		clearTimeout(timerID);
		setTimerID(undefined);
	};

	useEffect(() => {
		const handleMouseDownOutside = (e: MouseEvent) => {
			const isOutComplete = refComplete.current && !refComplete.current.contains(e.target as Node);
			if (isOutComplete || (e.button === 0 && refMenu.current && !refMenu.current.contains(e.target as Node))) {
				setIsOpen(false);
				if (isOutComplete) {
					setIsFocused(false);
				}
			}
		};

		if (isOpen) {
			const currentDialog = Utils.getViewport();
			currentDialog.addEventListener('mousedown', handleMouseDownOutside as EventListener);
			return () => {
				currentDialog.removeEventListener('mousedown', handleMouseDownOutside as EventListener);
			};
		}
	}, [isOpen]);

	useEffect(() => {
		setIsFocused(false);
	}, [isOpeningNewDialog]);

	useLayoutEffect(() => {
		if (isOpen && refMenu.current) {
			const menu = refMenu.current;
			const rect = menu.getBoundingClientRect();
			const viewport = Utils.getViewport();
			const viewportRect = viewport.getBoundingClientRect();
			if (rect.bottom > viewportRect.bottom) {
				menu.style.top = `${parseFloat(menu.style.top) - (rect.bottom - viewportRect.bottom)}px`;
			}
			if (rect.right > viewportRect.right) {
				menu.style.left = `${parseFloat(menu.style.left) - (rect.right - viewportRect.right)}px`;
			}
		}
	}, [isOpen]);

	return (
		<Flex
			one
			column={column}
			fillWidth
			fillHeight
			ref={refComplete}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			{children}
			<div ref={refMenu} className={Utils.getClassName({ hidden: !isOpen }, 'fixed hightZIndex')}>
				<MenuCustom horizontal={false} items={items} allowKeyboard={isFocused} />
			</div>
		</Flex>
	);
}

export default ContextMenu;
