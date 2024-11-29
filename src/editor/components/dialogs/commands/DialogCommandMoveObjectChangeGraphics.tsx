/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COMMAND_MOVE_KIND, ELEMENT_MAP_KIND, Utils } from '../../../common';
import { Rectangle } from '../../../core';
import { DynamicValue } from '../../../core/DynamicValue';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import Flex from '../../Flex';
import GraphicsSelector from '../../GraphicsSelector';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCommandMoveObjectChangeGraphics({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const command = model as Model.MapObjectCommandMove;

	const { t } = useTranslation();

	const [graphicsID, setGraphicsID] = useState(-1);
	const [graphicsIDDynamic] = useStateDynamicValue();
	const [graphicsIndexX, setGraphicsIndexX] = useStateNumber();
	const [graphicsIndexY, setGraphicsIndexY] = useStateNumber();
	const [rectTileset, setRectTileset] = useState<Rectangle>();
	const [graphicsKind, setGraphicsKind] = useStateNumber();
	const [isDontChangeOrientation, setIsDontChangeOrientation] = useStateBool();

	const initialize = () => {
		if (isNew) {
			setGraphicsID(-1);
			graphicsIDDynamic.isActivated = false;
			graphicsIDDynamic.updateToDefaultNumber();
			setGraphicsIndexX(0);
			setGraphicsIndexY(0);
			setRectTileset(undefined);
			setGraphicsKind(0);
			setIsDontChangeOrientation(false);
		} else {
			const iterator = Utils.generateIterator();
			iterator.i += 2;
			setIsDontChangeOrientation(Utils.initializeBoolCommand(command.command, iterator));
			let kind = ELEMENT_MAP_KIND.NONE;
			switch (command.command[iterator.i++]) {
				case ELEMENT_MAP_KIND.SPRITE_FIX:
					kind = ELEMENT_MAP_KIND.SPRITE_FIX;
					break;
				case ELEMENT_MAP_KIND.SPRITE_FACE:
					kind = ELEMENT_MAP_KIND.SPRITE_FACE;
					break;
				case ELEMENT_MAP_KIND.OBJECT3D:
					kind = ELEMENT_MAP_KIND.OBJECT3D;
					break;
			}
			setGraphicsKind(kind);
			graphicsIDDynamic.updateCommand(command.command, iterator, true);
			const id = graphicsIDDynamic.isActivated ? -1 : (graphicsIDDynamic.value as number);
			setGraphicsID(id);
			if (!graphicsIDDynamic.isActivated) {
				graphicsIDDynamic.updateToDefaultNumber();
			}
			if (id === 0 && !graphicsIDDynamic.isActivated) {
				const x = Number(command.command[iterator.i++]);
				const y = Number(command.command[iterator.i++]);
				const w = Number(command.command[iterator.i++]);
				const h = Number(command.command[iterator.i++]);
				setRectTileset(new Rectangle(x, y, w, h));
				setGraphicsIndexX(0);
				setGraphicsIndexY(0);
			} else {
				setGraphicsIndexX(Number(command.command[iterator.i++]));
				setGraphicsIndexY(Number(command.command[iterator.i++]));
				setRectTileset(undefined);
			}
		}
	};

	const handleChangeGraphicsKind = (kind: number) => {
		setGraphicsKind(kind);
	};

	const handleUpdateGraphics = (id: number, rect: Rectangle, isTileset: boolean) => {
		setGraphicsID(id);
		setGraphicsIndexX(isTileset ? 0 : rect.x);
		setGraphicsIndexY(isTileset ? 0 : rect.y);
		setRectTileset(isTileset ? rect.clone() : undefined);
	};

	const handleAccept = async () => {
		const list: MapObjectCommandType[] = [COMMAND_MOVE_KIND.CHANGE_GRAPHICS];
		if (!isNew) {
			list.push(command.command[1]);
		}
		list.push(Utils.boolToNum(isDontChangeOrientation));
		let index = 0;
		switch (graphicsKind) {
			case ELEMENT_MAP_KIND.SPRITE_FIX:
				index = 1;
				break;
			case ELEMENT_MAP_KIND.SPRITE_FACE:
				index = 2;
				break;
			case ELEMENT_MAP_KIND.OBJECT3D:
				index = 3;
				break;
		}
		list.push(index);
		if (graphicsIDDynamic.isActivated) {
			graphicsIDDynamic.getCommand(list, true);
		} else {
			const value = new DynamicValue();
			value.updateToDefaultNumber(graphicsID);
			value.getCommand(list, true);
		}
		if (rectTileset && !graphicsIDDynamic.isActivated && graphicsID === 0) {
			list.push(rectTileset.x);
			list.push(rectTileset.y);
			list.push(rectTileset.width);
			list.push(rectTileset.height);
		} else {
			list.push(graphicsIndexX);
			list.push(graphicsIndexY);
			list.push(1);
			list.push(1);
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
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('change.graphics')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spaced centerH>
				<GraphicsSelector
					sceneID='dialog-command-move-object'
					graphicsID={graphicsID}
					dynamicID={graphicsIDDynamic}
					graphicsIndexX={graphicsIndexX}
					graphicsIndexY={graphicsIndexY}
					rectTileset={rectTileset}
					graphicsKind={graphicsKind}
					onChangeGraphicsKind={handleChangeGraphicsKind}
					onUpdateGraphics={handleUpdateGraphics}
				/>
				<Checkbox isChecked={isDontChangeOrientation} onChange={setIsDontChangeOrientation}>
					{t('dont.change.orientation')}
				</Checkbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandMoveObjectChangeGraphics;
