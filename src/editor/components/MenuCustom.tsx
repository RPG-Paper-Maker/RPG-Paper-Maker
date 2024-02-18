/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import '../styles/Menu.css';
import { KEY, MenuItemType, SPECIAL_KEY } from '../common';
import MenuItem from './MenuItem';
import MenuSub from './MenuSub';
import Menu from './Menu';

type Props = {
	items: MenuItemType[];
	horizontal?: boolean;
	isActivable?: boolean;
	activeIndex?: number;
	setActiveIndex?: (v: number) => void;
	allowKeyboard?: boolean;
};

function MenuCustom({
	items,
	horizontal = false,
	isActivable = false,
	activeIndex = 0,
	setActiveIndex,
	allowKeyboard = true,
}: Props) {
	const getMenu = (list: any[]) =>
		list.map((item: any, index: number) => {
			if (item.children) {
				return (
					<MenuSub key={index} title={item.title} icon={item.icon} shortcut={item.shortcut}>
						{getMenu(item.children)}
					</MenuSub>
				);
			}
			return (
				<MenuItem
					key={index}
					icon={item.icon}
					disabled={item.disabled}
					shortcut={item.shortcut}
					onClick={item.onClick}
				>
					{item.title}
				</MenuItem>
			);
		});

	const checkItemKeyDownShortcut = async (
		itemList: MenuItemType[],
		statesSpecialKeys: Map<SPECIAL_KEY, boolean>,
		key: KEY | SPECIAL_KEY,
		specialKeys: SPECIAL_KEY[],
		event: KeyboardEvent
	) => {
		for (const item of itemList) {
			const { shortcut, disabled, onClick, children } = item;
			if (shortcut && onClick) {
				// Check all special keys
				let valid = true;
				for (const specialKey of specialKeys) {
					if (!statesSpecialKeys.get(specialKey) !== (shortcut.indexOf(specialKey) === -1)) {
						if (children) {
							if (await checkItemKeyDownShortcut(children, statesSpecialKeys, key, specialKeys, event)) {
								return true;
							}
						}
						valid = false;
						break;
					}
				}
				if (!valid) {
					continue;
				}
				// Check key if not a specialKey
				if (specialKeys.indexOf(key as SPECIAL_KEY) === -1 && shortcut.indexOf(key) !== -1) {
					event.preventDefault();
					if (disabled) {
						return false;
					} else {
						await onClick();
						return true;
					}
				}
			} else {
				if (children) {
					if (await checkItemKeyDownShortcut(children, statesSpecialKeys, key, specialKeys, event)) {
						return true;
					}
				}
			}
		}
		return false;
	};

	const translateKey = (key: string) => {
		switch (key) {
			case 'CONTROL':
				return SPECIAL_KEY.CTRL;
			case 'ARROWUP':
				return KEY.UP;
			case 'ARROWDOWN':
				return KEY.DOWN;
			default:
				return key;
		}
	};

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (allowKeyboard) {
			const statesSpecialKeys: Map<SPECIAL_KEY, boolean> = new Map();
			statesSpecialKeys.set(SPECIAL_KEY.CTRL, event.ctrlKey);
			statesSpecialKeys.set(SPECIAL_KEY.ALT, event.altKey);
			statesSpecialKeys.set(SPECIAL_KEY.SHIFT, event.shiftKey);
			const key = translateKey(event.key.toUpperCase());
			const specialKeys = Object.values(SPECIAL_KEY);
			return !(await checkItemKeyDownShortcut(
				items,
				statesSpecialKeys,
				key as KEY | SPECIAL_KEY,
				specialKeys,
				event
			));
		}
		return true;
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
		// eslint-disable-next-line
	});

	return (
		<Menu
			horizontal={horizontal}
			isActivable={isActivable}
			activeIndex={activeIndex}
			setActiveIndex={setActiveIndex}
		>
			{getMenu(items)}
		</Menu>
	);
}

export default MenuCustom;
