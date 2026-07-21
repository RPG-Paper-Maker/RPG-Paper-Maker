/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import ColorPicker, { Color } from '@rc-component/color-picker';
import '@rc-component/color-picker/assets/index.css';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, MAP_OBJECT_LIGHT_KIND } from '../../common';
import { Base, MapObjectLight } from '../../models';
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import TooltipInformation from '../TooltipInformation';

type Props = {
	light: MapObjectLight;
	onChange?: () => void;
	selectedFields?: Record<MapObjectLightField, boolean>;
	onChangeSelectedField?: (field: MapObjectLightField, selected: boolean) => void;
};

const MAP_OBJECT_LIGHT_FIELDS = [
	'kind',
	'followOrientation',
	'color',
	'groundColor',
	'intensity',
	'intensityOffset',
	'intensityTime',
	'x',
	'y',
	'z',
	'distance',
	'angle',
	'penumbra',
	'targetX',
	'targetY',
	'targetZ',
] as const;

type MapObjectLightField = (typeof MAP_OBJECT_LIGHT_FIELDS)[number];

function PanelMapObjectLight({ light, onChange, selectedFields, onChangeSelectedField }: Props) {
	const { t } = useTranslation();
	const kinds = useMemo(
		() =>
			Base.MAP_OBJECT_LIGHT_SOURCE_OPTIONS.map((source) =>
				Base.create(source.id, t(`light.kind.${MAP_OBJECT_LIGHT_KIND[source.id].toLowerCase()}`)),
			),
		[t],
	);
	const lightKind = light.kind.getFixNumberValue() as MAP_OBJECT_LIGHT_KIND;
	const hasDistance = lightKind === MAP_OBJECT_LIGHT_KIND.POINT || lightKind === MAP_OBJECT_LIGHT_KIND.SPOT;
	const colorValue = light.color.kind === DYNAMIC_VALUE_KIND.TEXT ? (light.color.value as string) : '#ffffff';
	const isDisabled = (field: MapObjectLightField) => selectedFields !== undefined && !selectedFields[field];
	const dynamic = (
		field: MapObjectLightField,
		value: typeof light.kind,
		optionsType: DYNAMIC_VALUE_OPTIONS_TYPE,
		min?: number,
		max?: number,
	) => (
		<DynamicValueSelector
			value={value}
			optionsType={optionsType}
			min={min}
			max={max}
			disabled={isDisabled(field)}
			onChangeKind={onChange}
			onChangeValue={onChange}
		/>
	);
	const label = (field: MapObjectLightField, children: ReactNode) =>
		selectedFields ? (
			<Checkbox
				isChecked={selectedFields[field]}
				onChange={(selected) => onChangeSelectedField?.(field, selected)}
			>
				{children}
			</Checkbox>
		) : (
			children
		);

	return (
		<Flex columnMobile spacedLarge fillHeight fillWidth>
			<ColorPicker
				value={new Color(colorValue)}
				disabled={light.color.kind !== DYNAMIC_VALUE_KIND.TEXT || isDisabled('color')}
				onChange={(value) => {
					light.color.updateToDefaultText(value.toHexString());
					onChange?.();
				}}
			/>
			<Flex one column scrollable style={{ minWidth: 0, scrollbarGutter: 'stable' }}>
				<Form>
					<Label>{label('color', t('color'))}</Label>
					<Value>{dynamic('color', light.color, DYNAMIC_VALUE_OPTIONS_TYPE.TEXT)}</Value>
					<Label>
						<Flex spaced centerV>
							{label('kind', t('light.source'))}
							<TooltipInformation text={t('tooltip.light.source')} />
						</Flex>
					</Label>
					<Value>
						<Flex spaced centerV>
							<Dropdown
								selectedID={lightKind}
								onChange={(value: number) => {
									light.kind.updateToDefaultNumber(value);
									if (value === MAP_OBJECT_LIGHT_KIND.SPOT) {
										light.followOrientation.updateToDefaultNumber(1);
									} else if (value === MAP_OBJECT_LIGHT_KIND.POINT) {
										light.followOrientation.updateToDefaultNumber(0);
									}
									onChange?.();
								}}
								options={kinds}
								disabled={isDisabled('kind')}
							/>
							{(lightKind === MAP_OBJECT_LIGHT_KIND.POINT ||
								lightKind === MAP_OBJECT_LIGHT_KIND.SPOT) && (
								<>
									<Checkbox
										isChecked={light.followOrientation.getFixNumberValue() === 1}
										disabled={isDisabled('followOrientation')}
										onChange={(checked) => {
											light.followOrientation.updateToDefaultNumber(checked ? 1 : 0);
											onChange?.();
										}}
									>
										{t('orientation')}
									</Checkbox>
									<TooltipInformation text={t('tooltip.light.orientation')} />
								</>
							)}
						</Flex>
					</Value>
					<Label>
						<Flex spaced centerV>
							{label('intensity', t('intensity'))}
							<TooltipInformation text={t('tooltip.light.intensity')} />
						</Flex>
					</Label>
					<Value>{dynamic('intensity', light.intensity, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL, 0)}</Value>
					<Label>{label('intensityOffset', `${t('light.intensity.animation')} ${t('offset')} (%)`)}</Label>
					<Value>
						{dynamic('intensityOffset', light.intensityOffset, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}
					</Value>
					<Label>{label('intensityTime', `${t('light.intensity.animation')} ${t('time')} (ms)`)}</Label>
					<Value>{dynamic('intensityTime', light.intensityTime, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER, 0)}</Value>
					<Label>
						<Flex spaced centerV>
							{label('x', t('light.offset.x'))}
							<TooltipInformation text={t('tooltip.light.offset')} />
						</Flex>
					</Label>
					<Value>{dynamic('x', light.x, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
					<Label>{label('y', t('light.offset.y'))}</Label>
					<Value>{dynamic('y', light.y, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
					<Label>{label('z', t('light.offset.z'))}</Label>
					<Value>{dynamic('z', light.z, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
					{lightKind === MAP_OBJECT_LIGHT_KIND.HEMISPHERE && (
						<>
							<Label>
								<Flex spaced centerV>
									{label('groundColor', t('light.ground.color'))}
									<TooltipInformation text={t('tooltip.light.ground.color')} />
								</Flex>
							</Label>
							<Value>{dynamic('groundColor', light.groundColor, DYNAMIC_VALUE_OPTIONS_TYPE.TEXT)}</Value>
						</>
					)}
					{hasDistance && (
						<>
							<Label>
								<Flex spaced centerV>
									{label('distance', t('range'))}
									<TooltipInformation text={t('tooltip.light.range')} />
								</Flex>
							</Label>
							<Value>
								{dynamic('distance', light.distance, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL, 0)}
							</Value>
						</>
					)}
					{lightKind === MAP_OBJECT_LIGHT_KIND.SPOT && (
						<>
							<Label>{label('targetX', t('light.target.x'))}</Label>
							<Value>
								{dynamic('targetX', light.targetX, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}
							</Value>
							<Label>{label('targetY', t('light.target.y'))}</Label>
							<Value>
								{dynamic('targetY', light.targetY, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}
							</Value>
							<Label>{label('targetZ', t('light.target.z'))}</Label>
							<Value>
								{dynamic('targetZ', light.targetZ, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}
							</Value>
							<Label>
								<Flex spaced centerV>
									{label('angle', t('angle'))}
									<TooltipInformation text={t('tooltip.light.angle.softness')} />
								</Flex>
							</Label>
							<Value>{dynamic('angle', light.angle, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER, 1, 179)}</Value>
							<Label>{label('penumbra', t('light.softness'))}</Label>
							<Value>
								{dynamic('penumbra', light.penumbra, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL, 0, 1)}
							</Value>
						</>
					)}
				</Form>
				<Flex one />
			</Flex>
		</Flex>
	);
}

export { MAP_OBJECT_LIGHT_FIELDS };
export type { MapObjectLightField };
export default PanelMapObjectLight;
