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
	const ref = useRef<HTMLDivElement>(null);

	const handleMouseDown = (e: any) => {
		setIsFocused(true);
		switch (e.button) {
			case 0:
				setIsOpen(false);
				break;
			case 2:
				setIsOpen(true);
				if (ref.current) {
					ref.current.style.left = `${e.pageX}px`;
					ref.current.style.top = `${e.pageY}px`;
				}
				break;
		}
	};

	const handleMouseDownOutside = (e: any) => {
		if (e.button === 0 && isOpen && ref.current && !ref.current.contains(e.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleMouseDownOutside);
		return () => {
			document.removeEventListener('mousedown', handleMouseDownOutside);
		};
	}, [isOpen]);

	return (
		<div className='flex-one' onMouseDown={handleMouseDown}>
			{children}
			<div ref={ref} className={Utils.getClassName([[!isOpen, 'hidden']], ['fixed', 'hight-z-index'])}>
				<MenuCustom horizontal={false} items={items} allowKeyboard={isFocused} />
			</div>
		</div>
	);
}

export default ContextMenu;
