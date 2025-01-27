/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { Node, Serializable } from '../core';
import { MapElement } from '../Editor';
import { BINDING, KEY, SPECIAL_KEY } from './Enum';

export type KeyValue = {
	k?: unknown;
	v?: unknown;
};

export type BindingType = [
	string,
	string,
	unknown,
	BINDING,
	(typeof Serializable | null)?,
	((json: JSONType) => typeof Serializable | typeof MapElement.Base)?
];

export type MenuItemType = {
	title: ReactNode | string;
	icon?: JSX.Element;
	disabled?: boolean;
	onClick?: (...args: unknown[]) => Promise<void>;
	shortcut?: (SPECIAL_KEY | KEY)[];
	children?: MenuItemType[];
};

export type CopiedItemsType = {
	values: Node[];
	constructorClass: typeof Serializable;
	pathProject: string;
};

export type ExtendedWindow = Window &
	typeof globalThis & {
		rpgPaperMakerProjectLocation: string;
		documentsFolder: string;
		ipcRenderer: {
			invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
			on: (channel: string, callback: (event: unknown, ...args: unknown[]) => void) => void;
		};
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
