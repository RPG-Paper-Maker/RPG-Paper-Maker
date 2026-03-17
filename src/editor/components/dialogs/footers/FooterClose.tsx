/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import Button from '../../Button';
import Flex from '../../Flex';

type Props = {
	onClose: () => void;
};

function FooterClose({ onClose }: Props) {
	const { t } = useTranslation();

	return (
		<Flex centerV spaced>
			<Flex one />
			<Button onClick={onClose}>{t('close')}</Button>
		</Flex>
	);
}

export default FooterClose;
