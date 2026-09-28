/* RPG Paper Maker Copyright (C) 2017-2026 Wano */

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../common';
import { DynamicValue } from '../../core/DynamicValue';
import useStateBool from '../../hooks/useStateBool';
import useStateDynamicValue from '../../hooks/useStateDynamicValue';
import PanelTransformations, { TransformationValues } from '../panels/PanelTransformations';
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
	opacity: DynamicValue;
	layer?: DynamicValue;
	onAccept?: () => void;
	onLiveChange?: () => void;
};

function DialogTransformations({ setIsOpen, layer, onAccept, onLiveChange, ...source }: Props) {
	const { t } = useTranslation();
	const [cx] = useStateDynamicValue();
	const [cz] = useStateDynamicValue();
	const [ax] = useStateDynamicValue();
	const [ay] = useStateDynamicValue();
	const [az] = useStateDynamicValue();
	const [sx] = useStateDynamicValue();
	const [sy] = useStateDynamicValue();
	const [sz] = useStateDynamicValue();
	const [op] = useStateDynamicValue();
	const [transformLayer] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();
	const isInitialized = useRef(false);
	const originalValues = useRef<DynamicValue[]>([]);
	const originalLayer = useRef<DynamicValue | null>(null);
	const values = {
		centerX: cx,
		centerZ: cz,
		angleX: ax,
		angleY: ay,
		angleZ: az,
		scaleX: sx,
		scaleY: sy,
		scaleZ: sz,
		opacity: op,
	} satisfies TransformationValues;
	const sourceValues = [
		source.centerX,
		source.centerZ,
		source.angleX,
		source.angleY,
		source.angleZ,
		source.scaleX,
		source.scaleY,
		source.scaleZ,
		source.opacity,
	];
	const apply = () => {
		Object.values(values).forEach((value, index) => sourceValues[index].copy(value));
		layer?.copy(transformLayer);
	};
	const handleLiveChange = () => {
		if (!isInitialized.current) return;
		apply();
		onLiveChange?.();
	};
	const handleClose = () => {
		originalValues.current.forEach((value, index) => sourceValues[index].copy(value));
		if (layer && originalLayer.current) layer.copy(originalLayer.current);
		onLiveChange?.();
		setIsOpen(false);
	};
	useLayoutEffect(() => {
		originalValues.current = sourceValues.map((value) => value.clone());
		Object.values(values).forEach((value, index) => value.copy(sourceValues[index]));
		originalLayer.current = layer?.clone() ?? null;
		if (layer) transformLayer.copy(layer);
		setTrigger((value) => !value);
		isInitialized.current = true;
	}, []);
	return (
		<Dialog
			title={`${t('update.transformations')}...`}
			isOpen
			footer={
				<FooterCancelOK
					onOK={() => {
						apply();
						onAccept?.();
						setIsOpen(false);
					}}
					onCancel={handleClose}
				/>
			}
			onClose={handleClose}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<PanelTransformations
				values={values}
				layer={layer ? transformLayer : undefined}
				onChange={handleLiveChange}
			/>
		</Dialog>
	);
}

export default DialogTransformations;
