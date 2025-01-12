/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import '../styles/Tips.css';

type Props = {
	children: ReactNode;
	onClose?: () => void;
};

function Tips({ children, onClose }: Props) {
	const [isClosed, setIsClosed] = useState(false);

	const handleClose = () => {
		onClose?.();
		setIsClosed(true);
	};

	return (
		<>
			{!isClosed && (
				<div className='tips'>
					<div className='icon'>
						<FaInfoCircle />
					</div>
					{children}
					<div className='icon' onClick={handleClose}>
						<RxCross2 />
					</div>
				</div>
			)}
		</>
	);
}

export default Tips;
