/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import Button from '../../Button';
import '../../../styles/Footer.css';
import { BUTTON_TYPE } from '../../../common';
import { useTranslation } from 'react-i18next';

type Props = {
	onNo: () => void;
	onYes: () => void;
};

function FooterNoYes({ onNo, onYes }: Props) {
	const { t } = useTranslation();

	return (
		<div className='footer-buttons'>
			<Button onClick={onNo}>{t('no')}</Button>
			<Button buttonType={BUTTON_TYPE.PRIMARY} onClick={onYes}>
				{t('yes')}
			</Button>
		</div>
	);
}

export default FooterNoYes;
