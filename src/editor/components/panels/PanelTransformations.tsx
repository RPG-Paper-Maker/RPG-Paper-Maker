/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../common';
import { DynamicValue } from '../../core/DynamicValue';
import Checkbox from '../Checkbox';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';

export type TransformationValues = {
	centerX: DynamicValue;
	centerZ: DynamicValue;
	angleX: DynamicValue;
	angleY: DynamicValue;
	angleZ: DynamicValue;
	scaleX: DynamicValue;
	scaleY: DynamicValue;
	scaleZ: DynamicValue;
	opacity: DynamicValue;
};

type AdditionalField = { label: string; value: DynamicValue };
type Props = {
	values: TransformationValues;
	checked?: boolean[];
	onChangeChecked?: (index: number, value: boolean) => void;
	onChange?: () => void;
	layer?: DynamicValue;
	additionalFields?: AdditionalField[];
};

function PanelTransformations({ values, checked, onChangeChecked, onChange, layer, additionalFields = [] }: Props) {
	const { t } = useTranslation();
	const renderValue = (label: string, value: DynamicValue, index?: number, suffix?: string) => (
		<Fragment key={label}>
			<Label>
				{index === undefined ? (
					label
				) : (
					<Checkbox isChecked={checked![index]} onChange={(isChecked) => onChangeChecked?.(index, isChecked)}>
						{label}
					</Checkbox>
				)}
			</Label>
			<Value>
				<Flex spaced centerV>
					<DynamicValueSelector
						value={value}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
						onChangeValue={onChange}
						onChangeKind={onChange}
					/>
					{suffix}
				</Flex>
			</Value>
		</Fragment>
	);

	return (
		<Form>
			{renderValue(`${t('center')} X`, values.centerX, checked ? 0 : undefined, '%')}
			{renderValue(`${t('center')} Z`, values.centerZ, checked ? 1 : undefined, '%')}
			{renderValue(`${t('angle')} X`, values.angleX, checked ? 2 : undefined, '°')}
			{renderValue(`${t('angle')} Y`, values.angleY, checked ? 3 : undefined, '°')}
			{renderValue(`${t('angle')} Z`, values.angleZ, checked ? 4 : undefined, '°')}
			{renderValue(`${t('scale')} X`, values.scaleX, checked ? 5 : undefined)}
			{renderValue(`${t('scale')} Y`, values.scaleY, checked ? 6 : undefined)}
			{renderValue(`${t('scale')} Z`, values.scaleZ, checked ? 7 : undefined)}
			{layer && (
				<>
					<Label>{t('layer')}</Label>
					<Value>
						<DynamicValueSelector
							value={layer}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							onChangeValue={onChange}
							onChangeKind={onChange}
						/>
					</Value>
				</>
			)}
			{renderValue(t('opacity'), values.opacity, checked ? 8 : undefined)}
			{additionalFields[0] &&
				renderValue(additionalFields[0].label, additionalFields[0].value, checked ? 9 : undefined)}
			{additionalFields[1] &&
				renderValue(additionalFields[1].label, additionalFields[1].value, checked ? 10 : undefined)}
			{additionalFields[2] &&
				renderValue(additionalFields[2].label, additionalFields[2].value, checked ? 11 : undefined)}
			{additionalFields[3] &&
				renderValue(additionalFields[3].label, additionalFields[3].value, checked ? 12 : undefined)}
		</Form>
	);
}

export default PanelTransformations;
