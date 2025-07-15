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
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogColor({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const color = model as Model.Color;

	const { t } = useTranslation();

	const [pickerColor, setPickerColor] = useState<Color>();
	const [name, setName] = useStateString();
	const [hex, setHex] = useStateString();
	const [red, setRed] = useStateNumber();
	const [green, setGreen] = useStateNumber();
	const [blue, setBlue] = useStateNumber();

	const initialize = () => {
		const pColor = new Color({ r: color.red, g: color.green, b: color.blue });
		setPickerColor(pColor);
		setName(color.name);
		setHex(pColor.toHexString().slice(1));
		setRed(color.red);
		setGreen(color.green);
		setBlue(color.blue);
	};

	const handlePickerColorChange = (newColor: Color) => {
		setPickerColor(newColor);
		setHex(newColor.toHexString().slice(1));
		setRed(newColor.r);
		setGreen(newColor.g);
		setBlue(newColor.b);
	};

	const handleHexChange = (newHex: string) => {
		const newColor = new Color(newHex);
		setPickerColor(newColor);
		setHex(newHex);
		setRed(newColor.r);
		setGreen(newColor.g);
		setBlue(newColor.b);
	};

	const handleRedChange = (newRed: number) => {
		const newColor = new Color({ r: newRed, g: green, b: blue });
		setPickerColor(newColor);
		setHex(newColor.toHexString().slice(1));
		setRed(newRed);
	};

	const handleGreenChange = (newGreen: number) => {
		const newColor = new Color({ r: red, g: newGreen, b: blue });
		setPickerColor(newColor);
		setHex(newColor.toHexString().slice(1));
		setGreen(newGreen);
	};

	const handleBlueChange = (newBlue: number) => {
		const newColor = new Color({ r: red, g: green, b: newBlue });
		setPickerColor(newColor);
		setHex(newColor.toHexString().slice(1));
		setBlue(newBlue);
	};

	const handleAccept = async () => {
		color.name = name;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<>
			<Dialog
				title={`${t('set.color')}...`}
				isOpen={isOpen}
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
							</Form>
						</Flex>
					</Flex>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogColor;
