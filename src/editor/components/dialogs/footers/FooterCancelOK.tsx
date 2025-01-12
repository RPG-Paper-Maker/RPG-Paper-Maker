/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import { BUTTON_TYPE } from '../../../common';
import Button from '../../Button';

type Props = {
	onOK: () => void;
	onCancel: () => void;
};

function FooterCancelOK({ onOK, onCancel }: Props) {
	const { t } = useTranslation();

	return (
		<div className='footerButtons'>
			<Button onClick={onCancel}>{t('cancel')}</Button>
			<Button buttonType={BUTTON_TYPE.PRIMARY} onClick={onOK}>
				{t('ok')}
			</Button>
		</div>
	);
}

export default FooterCancelOK;
