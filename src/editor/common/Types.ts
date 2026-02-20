/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSX, ReactNode } from 'react';
import { KEY, SPECIAL_KEY } from './Enum';

export type KeyValue = {
	k?: unknown;
	v?: unknown;
};

export type MenuItemType = {
	title: ReactNode | string;
	icon?: JSX.Element;
	disabled?: boolean;
	onClick?: (...args: unknown[]) => Promise<void>;
	shortcut?: (SPECIAL_KEY | KEY)[];
	children?: MenuItemType[];
};

export type JSONType = Record<string, unknown>;

export type JSONMappingKeyValue = {
	k: number;
	v: JSONType;
};

export type JSONMapping = {
	k: number[];
	v: JSONType;
};

export type ITERATOR = { i: number };

export interface initializeAcceptRef {
	initialize: () => void;
	accept: () => boolean;
}

export type PluginsManifestType = {
	name: string;
	files?: string[];
	folders?: PluginsManifestType[];
};
