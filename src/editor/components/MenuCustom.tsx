/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactElement, useEffect } from 'react';
import { MenuItemType, SPECIAL_KEY } from '../common';
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuSub from './MenuSub';

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
	const getMenu = (list: MenuItemType[]) =>
		list.map((item, index: number) => {
			if (item.children) {
				return (
					<MenuSub
						key={index}
						title={item.title as string}
						icon={item.icon}
						shortcut={item.shortcut}
						onClick={item.onClick}
					>
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
					{item.title as ReactElement}
				</MenuItem>
			);
		});

	const checkItemKeyDownShortcut = async (
		itemList: MenuItemType[],
		statesSpecialKeys: Map<string, boolean>,
		key: string,
		specialKeys: string[],
		event: KeyboardEvent,
	) => {
		for (const item of itemList) {
			const { shortcut, disabled, onClick, children } = item;
			if (shortcut && onClick) {
				const shortcutUpper = shortcut.map((s) => s.toUpperCase());
				// Check all special keys
				let valid = true;
				for (const specialKey of specialKeys) {
					if (!statesSpecialKeys.get(specialKey) !== (shortcutUpper.indexOf(specialKey) === -1)) {
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
				if (specialKeys.indexOf(key as SPECIAL_KEY) === -1 && shortcutUpper.indexOf(key) !== -1) {
					event.preventDefault();
					if (disabled) {
						continue;
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

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (allowKeyboard) {
			const statesSpecialKeys: Map<string, boolean> = new Map();
			statesSpecialKeys.set(SPECIAL_KEY.CTRL.toUpperCase(), event.ctrlKey);
			statesSpecialKeys.set(SPECIAL_KEY.ALT.toUpperCase(), event.altKey);
			statesSpecialKeys.set(SPECIAL_KEY.SHIFT.toUpperCase(), event.shiftKey);
			const specialKeys = Object.values(SPECIAL_KEY).map((k) => k.toUpperCase());
			return !(await checkItemKeyDownShortcut(
				items,
				statesSpecialKeys,
				event.key.toUpperCase(),
				specialKeys,
				event,
			));
		}
		return true;
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [allowKeyboard, items]);

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
