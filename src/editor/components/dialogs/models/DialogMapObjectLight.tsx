import ColorPicker, { Color } from '@rc-component/color-picker';
import '@rc-component/color-picker/assets/index.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, MAP_OBJECT_LIGHT_KIND } from '../../../common';
import { Base } from '../../../models/Base';
import type { MapObjectLight } from '../../../models/MapObjectLight';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import TooltipInformation from '../../TooltipInformation';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Base;
	onAccept: () => void;
	onReject?: () => void;
	onModelLivePreview?: (model: Base | null) => void;
};

function DialogMapObjectLight({ setIsOpen, model, onAccept, onReject, onModelLivePreview }: Props) {
	const light = model as MapObjectLight;
	const { t } = useTranslation();
	const kinds = useMemo(
		() =>
			Base.MAP_OBJECT_LIGHT_SOURCE_OPTIONS.map((source) =>
				Base.create(source.id, t(`light.kind.${MAP_OBJECT_LIGHT_KIND[source.id].toLowerCase()}`)),
			),
		[t],
	);
	const originalLight = useRef(light.clone() as MapObjectLight);
	const [, setRevision] = useState(0);
	const [kind] = useState(() => light.kind.clone());
	const [color] = useState(() => light.color.clone());
	const [groundColor] = useState(() => light.groundColor.clone());
	const [intensity] = useState(() => light.intensity.clone());
	const [intensityOffset] = useState(() => light.intensityOffset.clone());
	const [intensityTime] = useState(() => light.intensityTime.clone());
	const [x] = useState(() => light.x.clone());
	const [y] = useState(() => light.y.clone());
	const [z] = useState(() => light.z.clone());
	const [distance] = useState(() => light.distance.clone());
	const [angle] = useState(() => light.angle.clone());
	const [penumbra] = useState(() => light.penumbra.clone());
	const [targetX] = useState(() => light.targetX.clone());
	const [targetY] = useState(() => light.targetY.clone());
	const [targetZ] = useState(() => light.targetZ.clone());

	const updateLight = () => {
		light.kind.copy(kind);
		light.color.copy(color);
		light.groundColor.copy(groundColor);
		light.intensity.copy(intensity);
		light.intensityOffset.copy(intensityOffset);
		light.intensityTime.copy(intensityTime);
		light.x.copy(x);
		light.y.copy(y);
		light.z.copy(z);
		light.distance.copy(distance);
		light.angle.copy(angle);
		light.penumbra.copy(penumbra);
		light.targetX.copy(targetX);
		light.targetY.copy(targetY);
		light.targetZ.copy(targetZ);
	};

	const preview = () => {
		updateLight();
		setRevision((value) => value + 1);
		onModelLivePreview?.(light);
	};

	useEffect(() => {
		preview();
	}, []);

	const accept = () => {
		updateLight();
		onAccept();
		setIsOpen(false);
	};

	const reject = () => {
		light.copy(originalLight.current);
		onModelLivePreview?.(null);
		onReject?.();
		setIsOpen(false);
	};

	const lightKind = kind.getFixNumberValue() as MAP_OBJECT_LIGHT_KIND;
	const hasDistance = lightKind === MAP_OBJECT_LIGHT_KIND.POINT || lightKind === MAP_OBJECT_LIGHT_KIND.SPOT;
	const colorValue = color.kind === DYNAMIC_VALUE_KIND.TEXT ? (color.value as string) : '#ffffff';
	const dynamic = (value: typeof kind, optionsType: DYNAMIC_VALUE_OPTIONS_TYPE, min?: number, max?: number) => (
		<DynamicValueSelector
			value={value}
			optionsType={optionsType}
			min={min}
			max={max}
			onChangeKind={preview}
			onChangeValue={preview}
		/>
	);

	return (
		<Dialog
			title={`${t('light')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={reject} onOK={accept} />}
			onClose={reject}
			initialHeight='400px'
		>
			<Flex columnMobile spacedLarge fillHeight fillWidth>
				<ColorPicker
					value={new Color(colorValue)}
					disabled={color.kind !== DYNAMIC_VALUE_KIND.TEXT}
					onChange={(value) => {
						color.updateToDefaultText(value.toHexString());
						preview();
					}}
				/>
				<Flex one column scrollable style={{ minWidth: 0, scrollbarGutter: 'stable' }}>
					<Form>
						<Label>{t('color')}</Label>
						<Value>{dynamic(color, DYNAMIC_VALUE_OPTIONS_TYPE.TEXT)}</Value>
						<Label>
							<Flex spaced centerV>
								{t('light.source')}
								<TooltipInformation text={t('tooltip.light.source')} />
							</Flex>
						</Label>
						<Value>
							<Dropdown
								selectedID={lightKind}
								onChange={(value: number) => {
									kind.updateToDefaultNumber(value);
									preview();
								}}
								options={kinds}
							/>
						</Value>
						<Label>
							<Flex spaced centerV>
								{t('intensity')}
								<TooltipInformation text={t('tooltip.light.intensity')} />
							</Flex>
						</Label>
						<Value>{dynamic(intensity, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL, 0)}</Value>
						<Label>{`${t('light.intensity.animation')} ${t('offset')} (%)`}</Label>
						<Value>{dynamic(intensityOffset, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
						<Label>{`${t('light.intensity.animation')} ${t('time')} (ms)`}</Label>
						<Value>{dynamic(intensityTime, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER, 0)}</Value>
						<Label>
							<Flex spaced centerV>
								{t('light.offset.x')}
								<TooltipInformation text={t('tooltip.light.offset')} />
							</Flex>
						</Label>
						<Value>{dynamic(x, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
						<Label>{t('light.offset.y')}</Label>
						<Value>{dynamic(y, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
						<Label>{t('light.offset.z')}</Label>
						<Value>{dynamic(z, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
						{lightKind === MAP_OBJECT_LIGHT_KIND.HEMISPHERE && (
							<>
								<Label>
									<Flex spaced centerV>
										{t('light.ground.color')}
										<TooltipInformation text={t('tooltip.light.ground.color')} />
									</Flex>
								</Label>
								<Value>{dynamic(groundColor, DYNAMIC_VALUE_OPTIONS_TYPE.TEXT)}</Value>
							</>
						)}
						{hasDistance && (
							<>
								<Label>
									<Flex spaced centerV>
										{t('range')}
										<TooltipInformation text={t('tooltip.light.range')} />
									</Flex>
								</Label>
								<Value>{dynamic(distance, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL, 0)}</Value>
							</>
						)}
						{lightKind === MAP_OBJECT_LIGHT_KIND.SPOT && (
							<>
								<Label>{t('light.target.x')}</Label>
								<Value>{dynamic(targetX, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
								<Label>{t('light.target.y')}</Label>
								<Value>{dynamic(targetY, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
								<Label>{t('light.target.z')}</Label>
								<Value>{dynamic(targetZ, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL)}</Value>
								<Label>
									<Flex spaced centerV>
										{t('angle')}
										<TooltipInformation text={t('tooltip.light.angle.softness')} />
									</Flex>
								</Label>
								<Value>{dynamic(angle, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER, 1, 179)}</Value>
								<Label>{t('light.softness')}</Label>
								<Value>{dynamic(penumbra, DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL, 0, 1)}</Value>
							</>
						)}
					</Form>
					<Flex one />
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogMapObjectLight;
