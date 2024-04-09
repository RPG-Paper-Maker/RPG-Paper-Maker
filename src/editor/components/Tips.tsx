/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useState } from 'react';
import '../styles/Tips.css';
import { RxCross2 } from 'react-icons/rx';
import { FaInfoCircle } from 'react-icons/fa';

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
