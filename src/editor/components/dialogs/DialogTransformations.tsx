/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
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
	setIsOpen: (b: boolean) => void;
	centerX: DynamicValue;
	centerZ: DynamicValue;
	angleX: DynamicValue;
	angleY: DynamicValue;
	angleZ: DynamicValue;
	scaleX: DynamicValue;
	scaleY: DynamicValue;
	scaleZ: DynamicValue;
	layer?: DynamicValue;
	onAccept?: () => void;
	onLiveChange?: () => void;
};

function DialogTransformations({
	setIsOpen,
	centerX,
	centerZ,
	angleX,
	angleY,
	angleZ,
	scaleX,
	scaleY,
	scaleZ,
	layer,
	onAccept,
	onLiveChange,
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
	const [transformLayer] = useStateDynamicValue();
	const originalValues = useRef<DynamicValue[]>([]);
	const originalLayer = useRef<DynamicValue | null>(null);
	const isInitialized = useRef(false);
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
		if (layer) {
			transformLayer.copy(layer);
		}
		setTrigger((v) => !v);
	};

	const apply = () => {
		centerX.copy(cx);
		centerZ.copy(cz);
		angleX.copy(ax);
		angleY.copy(ay);
		angleZ.copy(az);
		scaleX.copy(sx);
		scaleY.copy(sy);
		scaleZ.copy(sz);
		layer?.copy(transformLayer);
	};

	const handleLiveChange = () => {
		if (!isInitialized.current) {
			return;
		}
		apply();
		onLiveChange?.();
	};

	const handleAccept = () => {
		apply();
		onAccept?.();
		setIsOpen(false);
	};

	const handleClose = () => {
		const [
			originalCenterX,
			originalCenterZ,
			originalAngleX,
			originalAngleY,
			originalAngleZ,
			originalScaleX,
			originalScaleY,
			originalScaleZ,
		] = originalValues.current;
		centerX.copy(originalCenterX);
		centerZ.copy(originalCenterZ);
		angleX.copy(originalAngleX);
		angleY.copy(originalAngleY);
		angleZ.copy(originalAngleZ);
		scaleX.copy(originalScaleX);
		scaleY.copy(originalScaleY);
		scaleZ.copy(originalScaleZ);
		if (layer && originalLayer.current) {
			layer.copy(originalLayer.current);
		}
		onLiveChange?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		originalValues.current = [
			centerX.clone(),
			centerZ.clone(),
			angleX.clone(),
			angleY.clone(),
			angleZ.clone(),
			scaleX.clone(),
			scaleY.clone(),
			scaleZ.clone(),
		];
		originalLayer.current = layer?.clone() ?? null;
		initialize();
		isInitialized.current = true;
	}, []);

	return (
		<Dialog
			title={`${t('update.transformations')}...`}
			isOpen
			footer={<FooterCancelOK onOK={handleAccept} onCancel={handleClose} />}
			onClose={handleClose}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Form>
				<Label>{t('center')} X</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector
							value={cx}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeValue={handleLiveChange}
							onChangeKind={handleLiveChange}
						/>
						%
					</Flex>
				</Value>
				<Label>{t('center')} Z</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector
							value={cz}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeValue={handleLiveChange}
							onChangeKind={handleLiveChange}
						/>
						%
					</Flex>
				</Value>
				<Label>{t('angle')} X</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector
							value={ax}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeValue={handleLiveChange}
							onChangeKind={handleLiveChange}
						/>
						°
					</Flex>
				</Value>
				<Label>{t('angle')} Y</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector
							value={ay}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeValue={handleLiveChange}
							onChangeKind={handleLiveChange}
						/>
						°
					</Flex>
				</Value>
				<Label>{t('angle')} Z</Label>
				<Value>
					<Flex spaced centerV>
						<DynamicValueSelector
							value={az}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeValue={handleLiveChange}
							onChangeKind={handleLiveChange}
						/>
						°
					</Flex>
				</Value>
				<Label>{t('scale')} X</Label>
				<Value>
					<DynamicValueSelector
						value={sx}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
						onChangeValue={handleLiveChange}
						onChangeKind={handleLiveChange}
					/>
				</Value>
				<Label>{t('scale')} Y</Label>
				<Value>
					<DynamicValueSelector
						value={sy}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
						onChangeValue={handleLiveChange}
						onChangeKind={handleLiveChange}
					/>
				</Value>
				<Label>{t('scale')} Z</Label>
				<Value>
					<DynamicValueSelector
						value={sz}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
						onChangeValue={handleLiveChange}
						onChangeKind={handleLiveChange}
					/>
				</Value>
				{layer && (
					<>
						<Label>{t('layer')}</Label>
						<Value>
							<DynamicValueSelector
								value={transformLayer}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								onChangeValue={handleLiveChange}
								onChangeKind={handleLiveChange}
							/>
						</Value>
					</>
				)}
			</Form>
		</Dialog>
	);
}

export default DialogTransformations;
