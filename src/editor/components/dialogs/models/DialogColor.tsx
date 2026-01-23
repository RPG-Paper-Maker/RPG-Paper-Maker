/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import ColorPicker, { Color } from '@rc-component/color-picker';
import '@rc-component/color-picker/assets/index.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputNumber from '../../InputNumber';
import InputText from '../../InputText';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogColor({ setIsOpen, model, onAccept, onReject }: Props) {
	const color = model as Model.Color;

	const { t } = useTranslation();

	const [pickerColor, setPickerColor] = useState<Color>();
	const [name, setName] = useStateString();
	const [hex, setHex] = useStateString();
	const [red, setRed] = useStateNumber();
	const [green, setGreen] = useStateNumber();
	const [blue, setBlue] = useStateNumber();
	const [alpha, setAlpha] = useStateNumber();

	const updateHex = (pColor: Color) => {
		setHex(pColor.toHexString().slice(1));
	};

	const initialize = () => {
		const pColor = new Color({ r: color.red, g: color.green, b: color.blue, a: color.alpha });
		setPickerColor(pColor);
		setName(color.name);
		updateHex(pColor);
		setRed(color.red);
		setGreen(color.green);
		setBlue(color.blue);
		setAlpha(color.alpha * 100);
	};

	const handlePickerColorChange = (newColor: Color) => {
		setPickerColor(newColor);
		updateHex(newColor);
		setRed(newColor.r);
		setGreen(newColor.g);
		setBlue(newColor.b);
		setAlpha(newColor.a * 100);
	};

	const handleHexChange = (newHex: string) => {
		const newColor = new Color(newHex);
		setPickerColor(newColor);
		setHex(newHex);
		setRed(newColor.r);
		setGreen(newColor.g);
		setBlue(newColor.b);
		setAlpha(newColor.a * 100);
	};

	const handleRedChange = (newRed: number) => {
		const newColor = new Color({ r: newRed, g: green, b: blue, a: alpha / 100 });
		setPickerColor(newColor);
		updateHex(newColor);
		setRed(newRed);
	};

	const handleGreenChange = (newGreen: number) => {
		const newColor = new Color({ r: red, g: newGreen, b: blue, a: alpha / 100 });
		setPickerColor(newColor);
		updateHex(newColor);
		setGreen(newGreen);
	};

	const handleBlueChange = (newBlue: number) => {
		const newColor = new Color({ r: red, g: green, b: newBlue, a: alpha / 100 });
		setPickerColor(newColor);
		updateHex(newColor);
		setBlue(newBlue);
	};

	const handleAlphaChange = (newAlpha: number) => {
		const newColor = new Color({ r: red, g: green, b: blue, a: newAlpha / 100 });
		setPickerColor(newColor);
		updateHex(newColor);
		setAlpha(newAlpha);
	};

	const handleAccept = async () => {
		color.name = name;
		color.red = red;
		color.green = green;
		color.blue = blue;
		color.alpha = alpha / 100;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('set.color')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					<div>{t('name')}:</div>
					<InputText value={name} onChange={setName} />
				</Flex>
				<Flex spacedLarge>
					<ColorPicker value={pickerColor} onChange={handlePickerColorChange} />
					<Flex column>
						<Form>
							<Label>{t('HEX')}</Label>
							<Value>
								<Flex spaced centerV>
									#<InputText value={hex} onChange={handleHexChange} />
								</Flex>
							</Value>
							<Label>R</Label>
							<Value>
								<InputNumber value={red} onChange={handleRedChange} min={0} max={255} />
							</Value>
							<Label>G</Label>
							<Value>
								<InputNumber value={green} onChange={handleGreenChange} min={0} max={255} />
							</Value>
							<Label>B</Label>
							<Value>
								<InputNumber value={blue} onChange={handleBlueChange} min={0} max={255} />
							</Value>
							<Label>Alpha</Label>
							<Value>
								<Flex spaced centerV>
									<InputNumber value={alpha} onChange={handleAlphaChange} min={0} max={100} />%
								</Flex>
							</Value>
						</Form>
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogColor;
