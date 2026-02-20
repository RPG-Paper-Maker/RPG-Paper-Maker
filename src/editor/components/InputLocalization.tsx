/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { LuLanguages } from 'react-icons/lu';
import { INPUT_TYPE_WIDTH } from '../common';
import { Model } from '../Editor';
import Button from './Button';
import DialogLocalization from './dialogs/models/DialogLocalization';
import Flex from './Flex';
import InputText from './InputText';

type Props = {
	localization: Model.Localization;
	widthType?: INPUT_TYPE_WIDTH;
	focusFirst?: boolean;
	setFocustFirst?: (b: boolean) => void;
	disabled?: boolean;
	onUpdate?: () => void;
	onFocus?: () => void;
};

function InputLocalization({
	localization,
	widthType = INPUT_TYPE_WIDTH.NORMAL,
	focusFirst = false,
	setFocustFirst,
	disabled = false,
	onUpdate,
	onFocus,
}: Props) {
	const [isDialogLocalizationOpen, setIsDialogLocalizationOpen] = useState(false);
	const [name, setName] = useState(localization.getName());

	const handleAccept = () => {
		setName(localization?.getName());
		onUpdate?.();
	};

	const handleChange = (n: string) => {
		setName(n);
		localization.updateMainName(n);
		onUpdate?.();
	};

	const handleClick = () => {
		setIsDialogLocalizationOpen(true);
	};

	useEffect(() => {
		setName(localization.getName());
	}, [localization]);

	return (
		<>
			<Flex spaced>
				<InputText
					value={name}
					widthType={widthType}
					onChange={handleChange}
					focusFirst={focusFirst}
					setFocustFirst={setFocustFirst}
					disabled={disabled}
					onFocus={onFocus}
				/>
				<Button icon={<LuLanguages />} disabled={disabled} onClick={handleClick} />
			</Flex>
			{isDialogLocalizationOpen && (
				<DialogLocalization
					setIsOpen={setIsDialogLocalizationOpen}
					model={localization}
					onAccept={handleAccept}
					onReject={() => {}}
				/>
			)}
		</>
	);
}

export default InputLocalization;
