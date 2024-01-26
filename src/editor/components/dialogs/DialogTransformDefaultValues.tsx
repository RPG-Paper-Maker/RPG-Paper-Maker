/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import { Project } from '../../core';
import { ACTION_KIND } from '../../common';
import InputNumber from '../InputNumber';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	getMinX: () => number | undefined;
	getMaxX: () => number | undefined;
	getMinY: () => number | undefined;
	getMaxY: () => number | undefined;
	getMinZ: () => number | undefined;
	getMaxZ: () => number | undefined;
	isDecimal: boolean;
	units: string;
	kind: ACTION_KIND;
	kindText: string;
};

function DialogTransformDefaultValues({
	needOpen,
	setNeedOpen,
	getMinX,
	getMaxX,
	getMinY,
	getMaxY,
	getMinZ,
	getMaxZ,
	isDecimal,
	units,
	kind,
	kindText,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const defaultX =
		kind === ACTION_KIND.ROTATE
			? Project.current!.settings.mapEditorDefaultRotateX
			: Project.current!.settings.mapEditorDefaultScaleX;
	const defaultY =
		kind === ACTION_KIND.ROTATE
			? Project.current!.settings.mapEditorDefaultRotateY
			: Project.current!.settings.mapEditorDefaultScaleY;
	const defaultZ =
		kind === ACTION_KIND.ROTATE
			? Project.current!.settings.mapEditorDefaultRotateZ
			: Project.current!.settings.mapEditorDefaultScaleZ;

	const [x, setX] = useState(defaultX);
	const [y, setY] = useState(defaultY);
	const [z, setZ] = useState(defaultZ);

	const reset = () => {
		setX(defaultX);
		setY(defaultY);
		setZ(defaultZ);
	};

	const handleAccept = async () => {
		if (kind === ACTION_KIND.ROTATE) {
			Project.current!.settings.mapEditorDefaultRotateX = x;
			Project.current!.settings.mapEditorDefaultRotateY = y;
			Project.current!.settings.mapEditorDefaultRotateZ = z;
		} else {
			Project.current!.settings.mapEditorDefaultScaleX = x;
			Project.current!.settings.mapEditorDefaultScaleY = y;
			Project.current!.settings.mapEditorDefaultScaleZ = z;
		}
		await Project.current!.settings.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (needOpen) {
			setNeedOpen(false);
			reset();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	return (
		<Dialog
			title={`Set default ${kindText}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<div className='flex flex-column gap-small'>
				<div className='flex gap-medium'>
					X:
					<InputNumber min={getMinX()} max={getMaxX()} value={x} onChange={setX} decimals={isDecimal} />
					{units}
				</div>
				<div className='flex gap-medium'>
					Y:
					<InputNumber min={getMinY()} max={getMaxY()} value={y} onChange={setY} decimals={isDecimal} />
					{units}
				</div>
				<div className='flex gap-medium'>
					Z:
					<InputNumber min={getMinZ()} max={getMaxZ()} value={z} onChange={setZ} decimals={isDecimal} />
					{units}
				</div>
			</div>
		</Dialog>
	);
}

export default DialogTransformDefaultValues;
