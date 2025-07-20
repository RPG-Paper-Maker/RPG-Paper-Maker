/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrayUtils, BUTTON_TYPE } from '../../../common';
import Button from '../../Button';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	initialShortcuts: string[][];
	onAccept: (s: string[][]) => void;
};

function DialogKeyboardEnterShortcuts({ setIsOpen, initialShortcuts, onAccept }: Props) {
	const { t } = useTranslation();

	const [shortcuts, setShortcuts] = useState<string[][]>(initialShortcuts.map((shortcut) => [...shortcut]));
	const [currentEntering, setCurrentEntering] = useState<string[]>([]);
	const [pressedKeys] = useState<string[]>([]);

	const handleClickRemoveAll = () => {
		setShortcuts([]);
	};

	const handleCloseShortcut = (index: number) => {
		setShortcuts((v) => [...v.slice(0, index), ...v.slice(index + 1)]);
	};

	const handleAccept = async () => {
		onAccept(shortcuts);
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			e.preventDefault();
			if (!pressedKeys.includes(e.key)) {
				pressedKeys.push(e.key);
			}
			if (!currentEntering.includes(e.key)) {
				setCurrentEntering([...currentEntering, e.key]);
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			e.preventDefault();
			ArrayUtils.removeElement(pressedKeys, e.key);
			if (pressedKeys.length === 0) {
				setShortcuts([...shortcuts, currentEntering]);
				setCurrentEntering([]);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [shortcuts, currentEntering, pressedKeys]);

	return (
		<Dialog
			isOpen
			title={`${t('enter.shortcuts')}...`}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='500px'
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Flex spaced centerV wrap>
					{shortcuts.map((shortcut, index) => (
						<Button key={index} onClose={() => handleCloseShortcut(index)}>
							{shortcut.join(' + ').toUpperCase()}
						</Button>
					))}
					{currentEntering.length > 0 && <Button>{currentEntering.join(' + ').toUpperCase()}</Button>}
					...{currentEntering.length === 0 && `[${t('waiting.for.shortcut').toUpperCase()}]`}
				</Flex>
				<Button
					buttonType={BUTTON_TYPE.PRIMARY}
					onClick={handleClickRemoveAll}
					disabled={shortcuts.length === 0}
				>
					{t('remove.all')}
				</Button>
			</Flex>
		</Dialog>
	);
}

export default DialogKeyboardEnterShortcuts;
