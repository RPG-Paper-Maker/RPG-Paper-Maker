/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../common';
import { DynamicValue } from '../../core/DynamicValue';
import useStateBool from '../../hooks/useStateBool';
import useStateDynamicValue from '../../hooks/useStateDynamicValue';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	centerX: DynamicValue;
	centerZ: DynamicValue;
	angleX: DynamicValue;
	angleY: DynamicValue;
	angleZ: DynamicValue;
	scaleX: DynamicValue;
	scaleY: DynamicValue;
	scaleZ: DynamicValue;
	onAccept?: () => void;
};

function DialogTransformations({
	isOpen,
	setIsOpen,
	centerX,
	centerZ,
	angleX,
	angleY,
	angleZ,
	scaleX,
	scaleY,
	scaleZ,
	onAccept,
}: Props) {
	const { t } = useTranslation();

	const [cx] = useStateDynamicValue();
	const [cz] = useStateDynamicValue();
	const [ax] = useStateDynamicValue();
	const [ay] = useStateDynamicValue();
	const [az] = useStateDynamicValue();
	const [sx] = useStateDynamicValue();
	const [sy] = useStateDynamicValue();
	const [sz] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		cx.copy(centerX);
		cz.copy(centerZ);
		ax.copy(angleX);
		ay.copy(angleY);
		az.copy(angleZ);
		sx.copy(scaleX);
		sy.copy(scaleY);
		sz.copy(scaleZ);
		setTrigger((v) => !v);
	};

	const handleAccept = () => {
		centerX.copy(cx);
		centerZ.copy(cz);
		angleX.copy(ax);
		angleY.copy(ay);
		angleZ.copy(az);
		scaleX.copy(sx);
		scaleY.copy(sy);
		scaleZ.copy(sz);
		onAccept?.();
		setIsOpen(false);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('update.transformations')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onOK={handleAccept} onCancel={handleClose} />}
			onClose={handleClose}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Form>
				<Label>{t('center')} X</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector value={cx} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />%
					</Flex>
				</Value>
				<Label>{t('center')} Z</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector value={cz} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />%
					</Flex>
				</Value>
				<Label>{t('angle')} X</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector value={ax} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />°
					</Flex>
				</Value>
				<Label>{t('angle')} Y</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector value={ay} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />°
					</Flex>
				</Value>
				<Label>{t('angle')} Z</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector value={az} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />°
					</Flex>
				</Value>
				<Label>{t('scale')} X</Label>
				<Value>
					<DynamicValueSelector value={sx} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
				</Value>
				<Label>{t('scale')} Y</Label>
				<Value>
					<DynamicValueSelector value={sy} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
				</Value>
				<Label>{t('scale')} Z</Label>
				<Value>
					<DynamicValueSelector value={sz} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogTransformations;
