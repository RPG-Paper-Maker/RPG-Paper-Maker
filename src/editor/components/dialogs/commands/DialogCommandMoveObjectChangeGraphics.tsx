/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COMMAND_MOVE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, ELEMENT_MAP_KIND, Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Rectangle } from '../../../core/Rectangle';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import GraphicsSelector, { GraphicsSelectorOptions } from '../../GraphicsSelector';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCommandMoveObjectChangeGraphics({ setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const command = model as Model.MapObjectCommandMove;

	const { t } = useTranslation();

	const [graphicOptions, setGraphicOptions] = useState<GraphicsSelectorOptions>({
		graphicsID: -1,
		dynamicID: new DynamicValue(),
		graphicsIndexX: 0,
		graphicsIndexY: 0,
		graphicsKind: 0,
	});
	const [isDontChangeOrientation, setIsDontChangeOrientation] = useStateBool();
	const [isIndexX, setIsIndexX] = useStateBool();
	const [indexXValue] = useStateDynamicValue();
	const [isIndexY, setIsIndexY] = useStateBool();
	const [indexYValue] = useStateDynamicValue();

	const initialize = () => {
		if (isNew) {
			graphicOptions.dynamicID!.isActivated = false;
			graphicOptions.dynamicID!.updateToDefaultNumber();
			indexXValue.updateToDefaultNumber();
			indexYValue.updateToDefaultNumber();
		} else {
			const iterator = Utils.generateIterator();
			iterator.i += 2;
			setIsDontChangeOrientation(Utils.initializeBoolCommand(command.command, iterator));
			let kind = ELEMENT_MAP_KIND.NONE;
			switch (command.command[iterator.i++]) {
				case 1:
					kind = ELEMENT_MAP_KIND.SPRITE_FIX;
					break;
				case 2:
					kind = ELEMENT_MAP_KIND.SPRITE_FACE;
					break;
				case 3:
					kind = ELEMENT_MAP_KIND.OBJECT3D;
					break;
				case 4:
					kind = ELEMENT_MAP_KIND.FLOOR;
					break;
				case 5:
					kind = ELEMENT_MAP_KIND.AUTOTILE;
					break;
			}
			graphicOptions.dynamicID!.updateCommand(command.command, iterator, true);
			const id = graphicOptions.dynamicID!.isActivated ? -1 : (graphicOptions.dynamicID!.value as number);
			if (!graphicOptions.dynamicID!.isActivated) {
				graphicOptions.dynamicID!.updateToDefaultNumber();
			}
			let rect: Rectangle | undefined = undefined;
			const x = Number(command.command[iterator.i++]);
			const y = Number(command.command[iterator.i++]);
			const w = Number(command.command[iterator.i++]);
			const h = Number(command.command[iterator.i++]);
			let hasIndexX = false;
			let hasIndexY = false;
			indexXValue.updateToDefaultNumber(x);
			indexYValue.updateToDefaultNumber(y);
			if (command.command[iterator.i] === 'indices') {
				iterator.i++;
				hasIndexX = Utils.initializeBoolCommand(command.command, iterator);
				if (hasIndexX) {
					indexXValue.updateCommand(command.command, iterator);
				}
				hasIndexY = Utils.initializeBoolCommand(command.command, iterator);
				if (hasIndexY) {
					indexYValue.updateCommand(command.command, iterator);
				}
			}
			setIsIndexX(hasIndexX);
			setIsIndexY(hasIndexY);
			const indexX = x;
			const indexY = y;
			if (
				(kind === ELEMENT_MAP_KIND.FLOOR && id === 0 && !graphicOptions.dynamicID!.isActivated) ||
				kind === ELEMENT_MAP_KIND.AUTOTILE
			) {
				rect = new Rectangle(x, y, w, h);
			}
			setGraphicOptions({
				dynamicID: graphicOptions.dynamicID,
				graphicsKind: kind,
				graphicsID: id,
				rectTileset: rect,
				graphicsIndexX: indexX,
				graphicsIndexY: indexY,
			});
		}
	};

	const handleChangeGraphicsKind = (kind: number) => {
		setGraphicOptions({
			...graphicOptions,
			graphicsKind: kind,
		});
	};

	const handleUpdateGraphics = (id: number, rect: Rectangle, isTileset: boolean, kind: number) => {
		if (!isIndexX) {
			indexXValue.updateToDefaultNumber(isTileset ? 0 : rect.x);
		}
		if (!isIndexY) {
			indexYValue.updateToDefaultNumber(isTileset ? 0 : rect.y);
		}
		setGraphicOptions({
			dynamicID: graphicOptions.dynamicID,
			graphicsID: id,
			graphicsIndexX: isTileset ? 0 : rect.x,
			graphicsIndexY: isTileset ? 0 : rect.y,
			rectTileset: isTileset ? rect.clone() : undefined,
			graphicsKind: kind,
		});
	};

	const handleAccept = async () => {
		const list: MapObjectCommandType[] = [COMMAND_MOVE_KIND.CHANGE_GRAPHICS];
		if (!isNew) {
			list.push(command.command[1]);
		}
		list.push(Utils.boolToNum(isDontChangeOrientation));
		let index = 0;
		switch (graphicOptions.graphicsKind) {
			case ELEMENT_MAP_KIND.SPRITE_FIX:
				index = 1;
				break;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
				index = 2;
				break;
			case ELEMENT_MAP_KIND.OBJECT3D:
				index = 3;
				break;
			case ELEMENT_MAP_KIND.FLOOR:
				index = 4;
				break;
			case ELEMENT_MAP_KIND.AUTOTILE:
				index = 5;
				break;
		}
		list.push(index);
		if (graphicOptions.dynamicID!.isActivated) {
			graphicOptions.dynamicID!.getCommand(list, true);
		} else {
			const value = new DynamicValue();
			value.updateToDefaultNumber(graphicOptions.graphicsID);
			value.getCommand(list, true);
		}
		if (
			graphicOptions.rectTileset &&
			!graphicOptions.dynamicID!.isActivated &&
			(graphicOptions.graphicsID === 0 || graphicOptions.graphicsKind === ELEMENT_MAP_KIND.AUTOTILE)
		) {
			list.push(graphicOptions.rectTileset.x);
			list.push(graphicOptions.rectTileset.y);
			list.push(graphicOptions.rectTileset.width);
			list.push(graphicOptions.rectTileset.height);
		} else {
			list.push(graphicOptions.graphicsIndexX);
			list.push(graphicOptions.graphicsIndexY);
			list.push(1);
			list.push(1);
		}
		const isCharacterSprite =
			graphicOptions.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX ||
			graphicOptions.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE;
		if (isCharacterSprite && (isIndexX || isIndexY)) {
			list.push('indices');
			list.push(Utils.boolToNum(isIndexX));
			if (isIndexX) {
				indexXValue.getCommand(list);
			}
			list.push(Utils.boolToNum(isIndexY));
			if (isIndexY) {
				indexYValue.getCommand(list);
			}
		}
		command.command = list;
		setIsOpen(false);
		onAccept();
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('change.graphics')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			initialWidth='450px'
			initialHeight='350px'
		>
			<Flex column spaced centerH>
				<Flex one centerH fillWidth>
					<GraphicsSelector
						sceneID='dialog-command-move-object'
						options={graphicOptions}
						onChangeGraphicsKind={handleChangeGraphicsKind}
						onUpdateGraphics={handleUpdateGraphics}
					/>
				</Flex>
				<Checkbox isChecked={isDontChangeOrientation} onChange={setIsDontChangeOrientation}>
					{t('dont.change.orientation')}
				</Checkbox>
				{(graphicOptions.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FIX ||
					graphicOptions.graphicsKind === ELEMENT_MAP_KIND.SPRITE_FACE) && (
					<Flex column spaced>
						<Flex spaced centerV>
							<Checkbox isChecked={isIndexX} onChange={setIsIndexX}>
								Index X
							</Checkbox>
							<DynamicValueSelector
								value={indexXValue}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								disabled={!isIndexX}
							/>
						</Flex>
						<Flex spaced centerV>
							<Checkbox isChecked={isIndexY} onChange={setIsIndexY}>
								Index Y
							</Checkbox>
							<DynamicValueSelector
								value={indexYValue}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								disabled={!isIndexY}
							/>
						</Flex>
					</Flex>
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogCommandMoveObjectChangeGraphics;
