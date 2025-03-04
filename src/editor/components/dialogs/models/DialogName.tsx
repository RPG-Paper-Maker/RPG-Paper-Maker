/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import useStateString from '../../../hooks/useStateString';
import Flex from '../../Flex';
import InputText from '../../InputText';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogName({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [focusFirst, setFocustFirst] = useState(false);
	const [name, setName] = useStateString();

	const initialize = () => {
		setName(model.name);
	};

	const handleAccept = async () => {
		model.name = name;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (isOpen) {
			setFocustFirst(true);
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('edit.name')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex spacedLarge>
				{t('name')}:
				<InputText value={name} onChange={setName} focusFirst={focusFirst} setFocustFirst={setFocustFirst} />
			</Flex>
		</Dialog>
	);
}

export default DialogName;
