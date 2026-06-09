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
import { DYNAMIC_VALUE_OPTIONS_TYPE } from '../../../common';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputText from '../../InputText';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCameraProperty({ setIsOpen, model, onAccept, onReject }: Props) {
	const cameraProperty = model as Model.CameraProperty;

	const { t } = useTranslation();

	const [name, setName] = useStateString();
	const [distance] = useStateDynamicValue();
	const [horizontalAngle] = useStateDynamicValue();
	const [verticalAngle] = useStateDynamicValue();
	const [targetOffsetX] = useStateDynamicValue();
	const [targetOffsetXKind, setTargetOffsetXKind] = useStateNumber();
	const [targetOffsetY] = useStateDynamicValue();
	const [targetOffsetYKind, setTargetOffsetYKind] = useStateNumber();
	const [targetOffsetZ] = useStateDynamicValue();
	const [targetOffsetZKind, setTargetOffsetZKind] = useStateNumber();
	const [fov] = useStateDynamicValue();
	const [near] = useStateDynamicValue();
	const [far] = useStateDynamicValue();
	const [orthographic, setOrthographic] = useStateBool();

	const previewPropertyRef = useRef<Model.CameraProperty | null>(null);

	const getScene = (): Scene.Map | null => Scene.Map.current;

	const preview = (overrides?: {
		offsetXKind?: number;
		offsetYKind?: number;
		offsetZKind?: number;
		orthographic?: boolean;
	}) => {
		const scene = getScene();
		const previewProperty = previewPropertyRef.current;
		if (!scene || !previewProperty) {
			return;
		}
		previewProperty.distance.copy(distance);
		previewProperty.horizontalAngle.copy(horizontalAngle);
		previewProperty.verticalAngle.copy(verticalAngle);
		previewProperty.targetOffsetX.copy(targetOffsetX);
		previewProperty.isSquareTargetOffsetX = (overrides?.offsetXKind ?? targetOffsetXKind) === 0;
		previewProperty.targetOffsetY.copy(targetOffsetY);
		previewProperty.isSquareTargetOffsetY = (overrides?.offsetYKind ?? targetOffsetYKind) === 0;
		previewProperty.targetOffsetZ.copy(targetOffsetZ);
		previewProperty.isSquareTargetOffsetZ = (overrides?.offsetZKind ?? targetOffsetZKind) === 0;
		previewProperty.fov.copy(fov);
		previewProperty.near.copy(near);
		previewProperty.far.copy(far);
		previewProperty.orthographic = overrides?.orthographic ?? orthographic;
		scene.previewCameraProperty(previewProperty);
	};

	const initialize = () => {
		setName(cameraProperty.name);
		distance.copy(cameraProperty.distance);
		horizontalAngle.copy(cameraProperty.horizontalAngle);
		verticalAngle.copy(cameraProperty.verticalAngle);
		targetOffsetX.copy(cameraProperty.targetOffsetX);
		setTargetOffsetXKind(cameraProperty.isSquareTargetOffsetX ? 0 : 1);
		targetOffsetY.copy(cameraProperty.targetOffsetY);
		setTargetOffsetYKind(cameraProperty.isSquareTargetOffsetY ? 0 : 1);
		targetOffsetZ.copy(cameraProperty.targetOffsetZ);
		setTargetOffsetZKind(cameraProperty.isSquareTargetOffsetZ ? 0 : 1);
		fov.copy(cameraProperty.fov);
		near.copy(cameraProperty.near);
		far.copy(cameraProperty.far);
		setOrthographic(cameraProperty.orthographic);
	};

	const handleAccept = async () => {
		cameraProperty.name = name;
		cameraProperty.distance.copy(distance);
		cameraProperty.horizontalAngle.copy(horizontalAngle);
		cameraProperty.verticalAngle.copy(verticalAngle);
		cameraProperty.targetOffsetX.copy(targetOffsetX);
		cameraProperty.isSquareTargetOffsetX = targetOffsetXKind === 0;
		cameraProperty.targetOffsetY.copy(targetOffsetY);
		cameraProperty.isSquareTargetOffsetY = targetOffsetYKind === 0;
		cameraProperty.targetOffsetZ.copy(targetOffsetZ);
		cameraProperty.isSquareTargetOffsetZ = targetOffsetZKind === 0;
		cameraProperty.fov.copy(fov);
		cameraProperty.near.copy(near);
		cameraProperty.far.copy(far);
		cameraProperty.orthographic = orthographic;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		Scene.Map.previewOnly = true;
		previewPropertyRef.current = cameraProperty.clone() as Model.CameraProperty;
		initialize();
		const scene = getScene();
		scene?.startCameraPropertyPreview();
		scene?.previewCameraProperty(cameraProperty);
		return () => {
			getScene()?.stopCameraPropertyPreview();
			Scene.Map.previewOnly = false;
		};
	}, []);

	return (
		<Dialog
			title={`${t('set.camera.properties')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialPlacement='right'
			hideOtherDialogs
		>
			<Flex column spacedLarge>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						<InputText value={name} onChange={setName} />
					</Value>
					<Label>{t('distance')}</Label>
					<Value>
						<DynamicValueSelector
							value={distance}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeKind={() => preview()}
							onChangeValue={() => preview()}
						/>
					</Value>
					<Label>{t('horizontal.angle')}</Label>
					<Value>
						<DynamicValueSelector
							value={horizontalAngle}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeKind={() => preview()}
							onChangeValue={() => preview()}
						/>
					</Value>
					<Label>{t('vertical.angle')}</Label>
					<Value>
						<DynamicValueSelector
							value={verticalAngle}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeKind={() => preview()}
							onChangeValue={() => preview()}
						/>
					</Value>
				</Form>
				<Groupbox title={t('target.offset')}>
					<Form>
						<Label>X</Label>
						<Value>
							<Flex spaced centerV>
								<DynamicValueSelector
									value={targetOffsetX}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									onChangeKind={() => preview()}
									onChangeValue={() => preview()}
								/>
								<Dropdown
									selectedID={targetOffsetXKind}
									onChange={(value: number) => {
										setTargetOffsetXKind(value);
										preview({ offsetXKind: value });
									}}
									options={Model.Base.SQUARES_PIXELS_OPTIONS}
									translateOptions
								/>
							</Flex>
						</Value>
						<Label>Y</Label>
						<Value>
							<Flex spaced centerV>
								<DynamicValueSelector
									value={targetOffsetY}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									onChangeKind={() => preview()}
									onChangeValue={() => preview()}
								/>
								<Dropdown
									selectedID={targetOffsetYKind}
									onChange={(value: number) => {
										setTargetOffsetYKind(value);
										preview({ offsetYKind: value });
									}}
									options={Model.Base.SQUARES_PIXELS_OPTIONS}
									translateOptions
								/>
							</Flex>
						</Value>
						<Label>Z</Label>
						<Value>
							<Flex spaced centerV>
								<DynamicValueSelector
									value={targetOffsetZ}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									onChangeKind={() => preview()}
									onChangeValue={() => preview()}
								/>
								<Dropdown
									selectedID={targetOffsetZKind}
									onChange={(value: number) => {
										setTargetOffsetZKind(value);
										preview({ offsetZKind: value });
									}}
									options={Model.Base.SQUARES_PIXELS_OPTIONS}
									translateOptions
								/>
							</Flex>
						</Value>
					</Form>
				</Groupbox>
				<Form>
					<Label>{t('field.of.view')}</Label>
					<Value>
						<DynamicValueSelector
							value={fov}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeKind={() => preview()}
							onChangeValue={() => preview()}
						/>
					</Value>
					<Label>{t('near')}</Label>
					<Value>
						<DynamicValueSelector
							value={near}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeKind={() => preview()}
							onChangeValue={() => preview()}
						/>
					</Value>
					<Label>{t('far')}</Label>
					<Value>
						<DynamicValueSelector
							value={far}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							onChangeKind={() => preview()}
							onChangeValue={() => preview()}
						/>
					</Value>
				</Form>
				<Checkbox
					isChecked={orthographic}
					onChange={(value: boolean) => {
						setOrthographic(value);
						preview({ orthographic: value });
					}}
				>
					{t('orthographic')}
				</Checkbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCameraProperty;
