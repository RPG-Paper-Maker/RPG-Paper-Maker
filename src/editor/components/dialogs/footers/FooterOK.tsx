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

type Props = {
	onOK: () => void;
};

function FooterOK({ onOK }: Props) {
	return (
		<div className='footer-buttons'>
			<Button primary onClick={onOK}>
				Ok
			</Button>
		</div>
	);
}

export default FooterOK;
