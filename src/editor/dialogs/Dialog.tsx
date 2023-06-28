/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/Dialog.css';

type Props = {
	children: React.ReactNode;
	title: string;
	isOpen: boolean;
	footer: React.ReactNode;
	onClose?: () => void;
};

function Dialog({ children, title, isOpen, footer, onClose }: Props) {
	const root = document.getElementById('root');
	if (!root) {
		return null;
	}

	return ReactDOM.createPortal(
		<>
			{isOpen && (
				<div className='dialog-overlay' onClick={onClose}>
					<div className='dialog' onClick={(event) => event.stopPropagation()}>
						<div className='dialog-title'>{title}</div>
						<div className='dialog-content'>{children}</div>
						<div className='dialog-footer'>{footer}</div>
					</div>
				</div>
			)}
		</>,
		root
	);
}

export default Dialog;
