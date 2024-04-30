/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useRef, useState } from 'react';
import '../styles/Menu.css';
import { MenuItemType, Utils } from '../common';
import MenuCustom from './MenuCustom';

type Props = {
	children: ReactNode;
	items?: MenuItemType[];
};

function ContextMenu({ children, items = [] }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [timerID, setTimerID] = useState<NodeJS.Timeout | undefined>();
	const ref = useRef<HTMLDivElement>(null);

	const openContext = (x: number, y: number) => {
		setIsOpen(true);
		if (ref.current) {
			x -= Utils.getViewportLeft();
			y -= Utils.getViewportTop();
			ref.current.style.left = `${x}px`;
			ref.current.style.top = `${y}px`;
		}
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setIsFocused(true);
		setTimeout(() => {
			// Small wait to let selected item time for onClick method to be triggered before hidding
			switch (e.button) {
				case 0:
					setIsOpen(false);
					break;
				case 2:
					openContext(e.pageX, e.pageY);
					break;
			}
		}, 200);
	};

	const handleMouseDownOutside = (e: MouseEvent) => {
		console.log(e.button);
		if (e.button === 0 && isOpen && ref.current && !ref.current.contains(e.target as Node)) {
			setIsOpen(false);
		}
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
		const id = setTimeout(() => {
			openContext(e.touches[0].pageX, e.touches[0].pageY);
		}, 500);
		setTimerID(id);
	};

	// Function to handle touch end event
	const handleTouchEnd = () => {
		// Clear the timer when touch ends
		clearTimeout(timerID);
		setTimerID(undefined);
	};

	useEffect(() => {
		if (isOpen) {
			console.log('ISOPEN');
			document.addEventListener('mousedown', handleMouseDownOutside);
			return () => {
				document.removeEventListener('mousedown', handleMouseDownOutside);
			};
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<div
			className='flex-one'
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{children}
			<div ref={ref} className={Utils.getClassName([[!isOpen, 'hidden']], ['fixed', 'hight-z-index'])}>
				<MenuCustom horizontal={false} items={items} allowKeyboard={isFocused} />
			</div>
		</div>
	);
}

export default ContextMenu;
