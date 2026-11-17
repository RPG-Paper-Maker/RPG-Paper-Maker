/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @deprecated Screen tone legacy mode (pre-3.2.30 projects), to remove. */

import { EVENT_COMMAND_KIND, JSONType, Utils } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Model } from '../Editor';
import { MapObjectCommandType } from '../models';
import { isZero } from './LegacyMoveCamera';

type ScreenToneValues = {
	tone: DynamicValue[];
	isAddingColor: boolean;
	time: DynamicValue;
	end: number;
};

const parseScreenTone = (list: MapObjectCommandType[]): ScreenToneValues => {
	const iterator = Utils.generateIterator();
	const tone = [0, 1, 2, 3].map(() => DynamicValue.createCommand(list, iterator));
	const isAddingColor = Utils.initializeBoolCommand(list, iterator);
	if (isAddingColor) {
		iterator.i++;
		DynamicValue.createCommand(list, iterator);
	}
	iterator.i++;
	const time = DynamicValue.createCommand(list, iterator);
	return { tone, isAddingColor, time, end: iterator.i };
};

const isZeroJSON = (json?: JSONType) => {
	if (!json) {
		return true;
	}
	const value = new DynamicValue();
	value.read(json);
	return isZero(value);
};

/**
 *  Check if a change screen tone command behaves differently since version 3.2.30.
 */
export const isScreenToneChanged = (list: MapObjectCommandType[]): boolean => {
	const values = parseScreenTone(list);
	return values.isAddingColor || !values.tone.every(isZero) || !isZero(values.time);
};

/**
 *  Check if a map screen tone (map infos JSON) behaves differently since version 3.2.30.
 */
export const isMapScreenToneChanged = (json: JSONType): boolean =>
	!['screenToneRed', 'screenToneGreen', 'screenToneBlue', 'screenToneGrey'].every((key) =>
		isZeroJSON(json[key] as JSONType | undefined),
	);

/**
 *  Set the legacy flag on a change screen tone command list.
 */
export const setScreenToneLegacy = (list: MapObjectCommandType[]) => {
	list.length = parseScreenTone(list).end;
	list.push(1);
};

export const isLegacyScreenTone = (command: Model.MapObjectCommand): boolean =>
	command.kind === EVENT_COMMAND_KIND.CHANGE_SCREEN_TONE &&
	Utils.numToBool(command.command[parseScreenTone(command.command).end] as number);
