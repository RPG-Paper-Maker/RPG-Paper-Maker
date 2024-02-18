/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, KEY, SPECIAL_KEY } from './Enum';

export type KeyValue = {
	k?: any;
	v?: any;
};

export type BindingType = [string, string, any, BINDING, any?, any?];

export type MenuItemType = {
	title: ReactNode | string;
	icon?: JSX.Element;
	disabled?: boolean;
	onClick?: (...args: any) => Promise<void>;
	shortcut?: (SPECIAL_KEY | KEY)[];
	children?: MenuItemType[];
};
