/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import Button from '../../components/Button';
import '../../styles/Footer.css';

type Props = {
	onYes: () => void;
	onNo: () => void;
};

function FooterOK({ onYes, onNo }: Props) {
	return (
		<div className='footer-buttons'>
			<Button onClick={onNo}>No</Button>
			<Button primary onClick={onYes}>
				Yes
			</Button>
		</div>
	);
}

export default FooterOK;
