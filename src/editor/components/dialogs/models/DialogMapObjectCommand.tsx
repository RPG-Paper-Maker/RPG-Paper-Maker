/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import DialogCommands from '../commands/DialogCommands';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
};

function DialogMapObjectCommand({ isOpen, setIsOpen, model, onAccept }: Props) {
	const { t } = useTranslation();

	return <DialogCommands isOpen={isOpen} setIsOpen={setIsOpen} />;
}

export default DialogMapObjectCommand;
