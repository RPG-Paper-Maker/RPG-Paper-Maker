/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @deprecated Move camera legacy mode (pre-3.2.30 projects), to remove. */

import { DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, Utils } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Model } from '../Editor';
import { MapObjectCommandType } from '../models';

const OPERATION_EQUALS = 0;
const OPERATION_PLUS = 1;
const OPERATION_MINUS = 2;

type MoveCameraValues = {
	operation: number;
	moveTargetOffset: boolean;
	x: DynamicValue;
	y: DynamicValue;
	z: DynamicValue;
	h: DynamicValue;
	v: DynamicValue;
	end: number;
};

const parseMoveCamera = (list: MapObjectCommandType[]): MoveCameraValues => {
	const iterator = Utils.generateIterator();
	if (Utils.initializeBoolCommand(list, iterator)) {
		DynamicValue.createCommand(list, iterator);
	}
	const operation = list[iterator.i++] as number;
	const moveTargetOffset = Utils.initializeBoolCommand(list, iterator);
	iterator.i++;
	const x = DynamicValue.createCommand(list, iterator);
	iterator.i++;
	const y = DynamicValue.createCommand(list, iterator);
	iterator.i++;
	const z = DynamicValue.createCommand(list, iterator);
	iterator.i++;
	iterator.i++;
	const h = DynamicValue.createCommand(list, iterator);
	const v = DynamicValue.createCommand(list, iterator);
	DynamicValue.createCommand(list, iterator);
	iterator.i++;
	DynamicValue.createCommand(list, iterator);
	return { operation, moveTargetOffset, x, y, z, h, v, end: iterator.i };
};

export const isZero = (value: DynamicValue) =>
	(value.kind === DYNAMIC_VALUE_KIND.NUMBER || value.kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL) &&
	Number(value.value) === 0;

/**
 *  Check if a move camera command behaves differently since version 3.2.30.
 */
export const isMoveCameraChanged = (list: MapObjectCommandType[]): boolean => {
	const values = parseMoveCamera(list);
	if (values.operation === OPERATION_EQUALS) {
		return values.moveTargetOffset || !(isZero(values.x) && isZero(values.y) && isZero(values.z));
	}
	if (values.moveTargetOffset) {
		return false;
	}
	if (values.operation !== OPERATION_PLUS && values.operation !== OPERATION_MINUS) {
		return true;
	}
	return !(isZero(values.x) && isZero(values.y) && isZero(values.z)) && !(isZero(values.h) && isZero(values.v));
};

/**
 *  Set the legacy flag on a move camera command list.
 */
export const setMoveCameraLegacy = (list: MapObjectCommandType[]) => {
	list.length = parseMoveCamera(list).end;
	list.push(1);
};

export const isLegacyMoveCamera = (command: Model.MapObjectCommand): boolean =>
	command.kind === EVENT_COMMAND_KIND.MOVE_CAMERA &&
	Utils.numToBool(command.command[parseMoveCamera(command.command).end] as number);
