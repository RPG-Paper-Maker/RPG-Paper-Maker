/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ACTION_KIND } from '../../common';
import { Project } from '../../core/Project';
import Flex from '../Flex';
import InputNumber from '../InputNumber';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
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
	isOpen,
	setIsOpen,
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
	const { t } = useTranslation();

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

	const initialize = () => {
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
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('edit.default.transform.options', { transformOptions: kindText.toLowerCase() })}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spaced>
				<Flex spacedLarge>
					X:
					<InputNumber min={getMinX()} max={getMaxX()} value={x} onChange={setX} decimals={isDecimal} />
					{units}
				</Flex>
				<Flex spacedLarge>
					Y:
					<InputNumber min={getMinY()} max={getMaxY()} value={y} onChange={setY} decimals={isDecimal} />
					{units}
				</Flex>
				<Flex spacedLarge>
					Z:
					<InputNumber min={getMinZ()} max={getMaxZ()} value={z} onChange={setZ} decimals={isDecimal} />
					{units}
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogTransformDefaultValues;
