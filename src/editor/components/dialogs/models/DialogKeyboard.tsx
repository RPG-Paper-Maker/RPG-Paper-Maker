/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import useStateString from '../../../hooks/useStateString';
import Button from '../../Button';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputLocalization from '../../InputLocalization';
import InputText from '../../InputText';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import DialogKeyboardEnterShortcuts from './DialogKeyboardEnterShortcuts';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogKeyboard({ setIsOpen, model, onAccept, onReject }: Props) {
	const keyboard = model as Model.Keyboard;

	const { t } = useTranslation();

	const [isDialogEnterShortcutsOpen, setIsDialogEnterShortcutsOpen] = useState(false);
	const [abbreviation, setAbbreviation] = useStateString();
	const [description, setDescription] = useState(keyboard);
	const [shortcuts, setShortcuts] = useState<string[][]>([]);

	const shortcutsText = useMemo(() => Model.Keyboard.toStringShortcuts(shortcuts), [shortcuts]);

	const initialize = () => {
		description.copy(keyboard);
		setAbbreviation(keyboard.abbreviation);
		setDescription(keyboard.clone());
		setShortcuts(keyboard.shortcuts.map((shortcut) => [...shortcut]));
	};

	const handleClickChangeShortcut = () => {
		setIsDialogEnterShortcutsOpen(true);
	};

	const handleAccept = async () => {
		keyboard.copy(description);
		keyboard.abbreviation = abbreviation;
		keyboard.shortcuts = shortcuts;
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
		<>
			<Dialog
				title={`${t('set.keyboard')}...`}
				isOpen
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				initialWidth='400px'
			>
				<Form>
					<Label>{t('abbreviation')} (JavaScript)</Label>
					<Value>
						{keyboard.isEngine ? (
							abbreviation
						) : (
							<InputText value={abbreviation} onChange={setAbbreviation} />
						)}
					</Value>
					<Label>{t('description')}</Label>
					<Value>
						{keyboard.isEngine ? (
							t(description.getName())
						) : (
							<InputLocalization localization={description} />
						)}
					</Value>
					<Label>{t('shortcut')}</Label>
					<Value>
						<Flex spacedLarge centerV>
							<Flex wrap>{shortcutsText}</Flex>
							<Flex one />
							<Button onClick={handleClickChangeShortcut}>{t('change')}...</Button>
						</Flex>
					</Value>
				</Form>
			</Dialog>
			{isDialogEnterShortcutsOpen && (
				<DialogKeyboardEnterShortcuts
					setIsOpen={setIsDialogEnterShortcutsOpen}
					initialShortcuts={shortcuts}
					onAccept={setShortcuts}
				/>
			)}
		</>
	);
}

export default DialogKeyboard;
