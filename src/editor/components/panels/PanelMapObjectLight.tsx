/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import ColorPicker, { Color } from '../ColorPicker';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, MAP_OBJECT_LIGHT_KIND } from '../../common';
import { Base, MapObjectLight } from '../../models';
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import InputNumber from '../InputNumber';
import TooltipInformation from '../TooltipInformation';

type Props = {
	light: MapObjectLight;
	sunlight?: boolean;
	onChange?: () => void;
	onColorChange?: () => void;
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
	'castShadow',
] as const;

type MapObjectLightField = (typeof MAP_OBJECT_LIGHT_FIELDS)[number];

/**
 * A spot light is saved as a target point (in pixels, relative to the object). The dialog
 * shows it as a direction and a tilt instead: the target is the light's offset plus one unit
 * of length along that direction, so nothing changes in the saved data.
 */
const AIM_LENGTH = 16;
const AIM_FIELDS = ['targetX', 'targetY', 'targetZ'] as const;

const toDegrees = (radians: number) => (radians * 180) / Math.PI;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const readOffset = (light: MapObjectLight): [number, number, number] => [
	light.x.getFixNumberValue(),
	light.y.getFixNumberValue(),
	light.z.getFixNumberValue(),
];

/** Direction and tilt can only be edited when the offset and the target are plain numbers. */
const hasFixedAim = (light: MapObjectLight) =>
	[light.x, light.y, light.z, light.targetX, light.targetY, light.targetZ].every((value) => value.isFixNumberValue());

/** Direction: 0 = north (-Z), 90 = east (+X), 180 = south, 270 = west. Tilt: degrees below level. */
const getAim = (light: MapObjectLight) => {
	const [x, y, z] = readOffset(light);
	const vx = light.targetX.getFixNumberValue() - x;
	const vy = light.targetY.getFixNumberValue() - y;
	const vz = light.targetZ.getFixNumberValue() - z;
	const horizontal = Math.hypot(vx, vz);
	const direction = horizontal < 1e-6 ? 0 : (Math.round(toDegrees(Math.atan2(vx, -vz))) + 360) % 360;
	const tilt = Math.round(toDegrees(Math.atan2(-vy, horizontal)));
	return { direction, tilt };
};

const setTarget = (light: MapObjectLight, offset: [number, number, number], vector: [number, number, number]) => {
	const round = (value: number) => Math.round(value * 10000) / 10000;
	light.targetX.updateToDefaultNumber(round(offset[0] + vector[0]), true);
	light.targetY.updateToDefaultNumber(round(offset[1] + vector[1]), true);
	light.targetZ.updateToDefaultNumber(round(offset[2] + vector[2]), true);
};

const setAim = (light: MapObjectLight, direction: number, tilt: number) => {
	const d = toRadians(direction);
	const t = toRadians(tilt);
	setTarget(light, readOffset(light), [
		AIM_LENGTH * Math.cos(t) * Math.sin(d),
		-AIM_LENGTH * Math.sin(t),
		-AIM_LENGTH * Math.cos(t) * Math.cos(d),
	]);
};

function PanelMapObjectLight({
	light,
	sunlight = false,
	onChange,
	onColorChange,
	selectedFields,
	onChangeSelectedField,
}: Props) {
	const { t } = useTranslation();
	const kinds = useMemo(
		() =>
			Base.MAP_OBJECT_LIGHT_SOURCE_OPTIONS.map((source) =>
				Base.create(source.id, t(`light.kind.${MAP_OBJECT_LIGHT_KIND[source.id].toLowerCase()}`)),
			),
		[t],
	);
	const lightKind = light.kind.getFixNumberValue() as MAP_OBJECT_LIGHT_KIND;
	const isPoint = lightKind === MAP_OBJECT_LIGHT_KIND.POINT;
	const isSpot = lightKind === MAP_OBJECT_LIGHT_KIND.SPOT;
	const isDirectional = lightKind === MAP_OBJECT_LIGHT_KIND.DIRECTIONAL;
	const isHemisphere = lightKind === MAP_OBJECT_LIGHT_KIND.HEMISPHERE;
	const hasDistance = isPoint || isSpot;
	// Orientation turns the light around the object: a spot light aims where the object looks, and a
	// point light only moves when it is placed away from the object's center.
	const offsetOnPlane =
		!light.x.isFixNumberValue() ||
		!light.z.isFixNumberValue() ||
		light.x.getFixNumberValue() !== 0 ||
		light.z.getFixNumberValue() !== 0;
	const showOrientation = isSpot || (isPoint && offsetOnPlane);
	const fixedAim = hasFixedAim(light);
	const aim = fixedAim ? getAim(light) : { direction: 0, tilt: 0 };
	const previousOffset = useRef(readOffset(light));
	const colorValue = light.color.kind === DYNAMIC_VALUE_KIND.TEXT ? (light.color.value as string) : '#ffffff';
	const [pickerColor, setPickerColor] = useState(() => new Color(colorValue));
	const isDisabled = (field: MapObjectLightField) => selectedFields !== undefined && !selectedFields[field];

	useEffect(() => {
		setPickerColor((current) =>
			current.toHexString().slice(0, 7).toLowerCase() === colorValue.toLowerCase()
				? current
				: new Color(colorValue),
		);
	}, [colorValue]);

	// Moving the light keeps the direction it points in
	const handleOffsetChange = () => {
		if (isSpot && hasFixedAim(light)) {
			const [px, py, pz] = previousOffset.current;
			const vector: [number, number, number] = [
				light.targetX.getFixNumberValue() - px,
				light.targetY.getFixNumberValue() - py,
				light.targetZ.getFixNumberValue() - pz,
			];
			setTarget(light, readOffset(light), vector);
		}
		previousOffset.current = readOffset(light);
		onChange?.();
	};
	previousOffset.current = readOffset(light);

	const dynamic = (
		field: MapObjectLightField,
		value: typeof light.kind,
		optionsType: DYNAMIC_VALUE_OPTIONS_TYPE,
		min?: number,
		max?: number,
	) => {
		const handler =
			field === 'color'
				? (onColorChange ?? onChange)
				: field === 'x' || field === 'y' || field === 'z'
					? handleOffsetChange
					: onChange;
		return (
			<DynamicValueSelector
				value={value}
				optionsType={optionsType}
				min={min}
				max={max}
				disabled={isDisabled(field)}
				onChangeKind={handler}
				onChangeValue={handler}
			/>
		);
	};
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
	/** A label with its checkbox (when editing a command) and its information tooltip. */
	const labelWithTip = (field: MapObjectLightField, text: string, tooltip: string) => (
		<Label>
			<Flex spaced centerV>
				{label(field, text)}
				<TooltipInformation text={tooltip} />
			</Flex>
		</Label>
	);
	/** Direction and tilt both set the whole target, so they share one checkbox in command mode. */
	const aimLabel = (text: string, tooltip: string) => (
		<Label>
			<Flex spaced centerV>
				{selectedFields ? (
					<Checkbox
						isChecked={selectedFields.targetX && selectedFields.targetY && selectedFields.targetZ}
						onChange={(selected) => {
							for (const field of AIM_FIELDS) {
								onChangeSelectedField?.(field, selected);
							}
						}}
					>
						{text}
					</Checkbox>
				) : (
					text
				)}
				<TooltipInformation text={tooltip} />
			</Flex>
		</Label>
	);
	const offsetTooltip = isDirectional ? t('tooltip.light.offset.directional') : t('tooltip.light.offset');

	return (
		<Flex columnMobile spacedLarge fillHeight fillWidth>
			<ColorPicker
				value={pickerColor}
				disabledAlpha
				disabled={light.color.kind !== DYNAMIC_VALUE_KIND.TEXT || isDisabled('color')}
				onChange={(value) => {
					setPickerColor(value);
					light.color.updateToDefaultText(value.toHexString().slice(0, 7));
					(onColorChange ?? onChange)?.();
				}}
			/>
			<Flex one column scrollable style={{ minWidth: 0, scrollbarGutter: 'stable' }}>
				<Form>
					{labelWithTip('color', t('color'), t('tooltip.light.color'))}
					<Value>{dynamic('color', light.color, DYNAMIC_VALUE_OPTIONS_TYPE.TEXT)}</Value>
					{!sunlight && labelWithTip('kind', t('light.source'), t('tooltip.light.source'))}
					{!sunlight && (
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
								{showOrientation && (
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
					)}
					{!sunlight && isHemisphere && (
						<>
							{labelWithTip('groundColor', t('light.ground.color'), t('tooltip.light.ground.color'))}
							<Value>{dynamic('groundColor', light.groundColor, DYNAMIC_VALUE_OPTIONS_TYPE.TEXT)}</Value>
						</>
					)}
					{labelWithTip('intensity', t('intensity'), t('tooltip.light.intensity'))}
					<Value>{dynamic('intensity', light.intensity, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL, 0)}</Value>
					{labelWithTip(
						'intensityOffset',
						`${t('light.intensity.animation')} ${t('offset')} (%)`,
						t('tooltip.light.flicker.offset'),
					)}
					<Value>
						{dynamic('intensityOffset', light.intensityOffset, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}
					</Value>
					{labelWithTip(
						'intensityTime',
						`${t('light.intensity.animation')} ${t('time')} (ms)`,
						t('tooltip.light.flicker.time'),
					)}
					<Value>{dynamic('intensityTime', light.intensityTime, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER, 0)}</Value>
					{!sunlight && !isHemisphere && (
						<>
							{labelWithTip('x', t('light.offset.x'), offsetTooltip)}
							<Value>{dynamic('x', light.x, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
							{labelWithTip('y', t('light.offset.y'), t('tooltip.light.offset.y'))}
							<Value>{dynamic('y', light.y, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
							{labelWithTip('z', t('light.offset.z'), t('tooltip.light.offset.z'))}
							<Value>{dynamic('z', light.z, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
						</>
					)}
					{!sunlight && !isHemisphere && (
						<>
							{labelWithTip('castShadow', t('light.cast.shadows'), t('tooltip.light.cast.shadows'))}
							<Value>
								<Checkbox
									isChecked={light.castShadow.getFixNumberValue() === 1}
									disabled={isDisabled('castShadow')}
									onChange={(checked) => {
										light.castShadow.updateToDefaultNumber(checked ? 1 : 0);
										onChange?.();
									}}
								/>
							</Value>
						</>
					)}
					{!sunlight && hasDistance && (
						<>
							{labelWithTip('distance', t('range'), t('tooltip.light.range'))}
							<Value>
								{dynamic('distance', light.distance, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL, 0)}
							</Value>
						</>
					)}
					{!sunlight && isSpot && fixedAim && (
						<>
							{aimLabel(`${t('light.direction')} (${t('light.degrees')})`, t('tooltip.light.direction'))}
							<Value>
								<InputNumber
									value={aim.direction}
									min={0}
									max={359}
									suffixPlaceholder='°'
									disabled={isDisabled('targetX')}
									onChange={(value) => {
										setAim(light, value, aim.tilt);
										onChange?.();
									}}
								/>
							</Value>
							{aimLabel(`${t('light.tilt')} (${t('light.degrees')})`, t('tooltip.light.tilt'))}
							<Value>
								<InputNumber
									value={aim.tilt}
									min={-90}
									max={90}
									suffixPlaceholder='°'
									disabled={isDisabled('targetX')}
									onChange={(value) => {
										setAim(light, aim.direction, value);
										onChange?.();
									}}
								/>
							</Value>
						</>
					)}
					{!sunlight && isSpot && !fixedAim && (
						<>
							{labelWithTip('targetX', t('light.target.x'), t('tooltip.light.target.variable'))}
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
						</>
					)}
					{!sunlight && isSpot && (
						<>
							{labelWithTip('angle', t('angle'), t('tooltip.light.angle'))}
							<Value>{dynamic('angle', light.angle, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER, 1, 179)}</Value>
							{labelWithTip('penumbra', t('light.softness'), t('tooltip.light.softness'))}
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
