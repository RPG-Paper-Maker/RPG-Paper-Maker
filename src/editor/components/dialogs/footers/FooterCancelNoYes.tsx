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

type Props = {
	onCancel: () => void;
	onNo: () => void;
	onYes: () => void;
};

function FooterCancelNoYes({ onCancel, onNo, onYes }: Props) {
	return (
		<div className='footer-buttons'>
			<Button onClick={onCancel}>Cancel</Button>
			<Button onClick={onNo}>No</Button>
			<Button buttonType={BUTTON_TYPE.PRIMARY} onClick={onYes}>
				Yes
			</Button>
		</div>
	);
}

export default FooterCancelNoYes;
