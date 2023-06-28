/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { RxCross2 } from 'react-icons/rx';
import '../styles/Dialog.css';

type Props = {
	children: React.ReactNode;
	title: string;
	isOpen: boolean;
	footer: React.ReactNode;
	onClose?: () => void;
};

function Dialog({ children, title, isOpen, footer, onClose }: Props) {
	const [isClickedIn, setIsClickedIn] = useState(false); // Prevent mouse down on div + mouse up out to close

	const handleMouseDown = () => {
		setIsClickedIn(true);
	};

	const handleClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (!isClickedIn) {
			if (onClose) {
				onClose();
			}
		} else {
			setIsClickedIn(false);
		}
	};

	const handleStopPropagation = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		e.stopPropagation();
	};

	const root = document.getElementById('root');
	if (!root) {
		return null;
	}

	return ReactDOM.createPortal(
		<>
			{isOpen && (
				<div className='dialog-overlay' onClick={handleClose}>
					<div className='dialog' onMouseDown={handleMouseDown} onClick={handleStopPropagation}>
						<div className='dialog-title'>
							<div className='flex-one'>{title}</div>
							<RxCross2 className='dialog-close' onClick={onClose} />
						</div>
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
