/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RxCross2 } from 'react-icons/rx';
import { Utils } from '../common/Utils';
import '../styles/Dialog.css';

type Props = {
	children: React.ReactNode;
	title: string;
	isOpen: boolean;
	isDisabled?: boolean;
	footer: React.ReactNode;
	onClose: () => void;
};

function Dialog({ children, title, isOpen, isDisabled = false, footer, onClose }: Props) {
	const [isClickedIn, setIsClickedIn] = useState(false); // Prevent mouse down on div + mouse up out to close
	const [isDragging, setIsDragging] = useState(false);
	const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
	const [isMoved, setIsMoved] = useState(false);
	const dialogRef = useRef<HTMLDivElement>(null);

	const updatePosition = (x: number, y: number) => {
		if (dialogRef.current) {
			const min = 0;
			const rect = dialogRef.current.getBoundingClientRect();
			const maxX = window.innerWidth - rect.width;
			const maxY = window.innerHeight - rect.height;
			x = Math.min(maxX, Math.max(min, x));
			y = Math.min(maxY, Math.max(min, y));
			dialogRef.current.style.left = `${x}px`;
			dialogRef.current.style.top = `${y}px`;
		}
	};

	const handleMouseMove = (e: any) => {
		if (isDragging) {
			updatePosition(e.clientX - initialPosition.x, e.clientY - initialPosition.y);
		}
	};

	const handleMouseDown = () => {
		setIsClickedIn(true);
	};

	const handleMouseUp = () => {
		setIsClickedIn(false);
	};

	const handleClose = () => {
		setIsMoved(false);
		if (onClose) {
			onClose();
		}
	};

	const handleCloseOut = () => {
		if (!isClickedIn) {
			setIsMoved(false);
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

	const handleMouseDownTitle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		setIsDragging(true);
		setIsMoved(true);
		if (dialogRef.current) {
			const rect = dialogRef.current.getBoundingClientRect();
			const x = e.clientX - rect.x;
			const y = e.clientY - rect.y;
			setInitialPosition({ x: x, y: y });
			updatePosition(e.clientX - x, e.clientY - y);
		}
	};

	const handleMouseUpTitle = () => {
		setIsDragging(false);
		setInitialPosition({ x: 0, y: 0 });
	};

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
			};
		}
	});

	const root = document.getElementById('root');
	if (!root) {
		return null;
	}

	return ReactDOM.createPortal(
		<>
			{isOpen && (
				<div className='dialog-overlay' onClick={handleCloseOut} onMouseUp={handleMouseUpTitle}>
					<div
						ref={dialogRef}
						className='dialog'
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						onClick={handleStopPropagation}
						style={isMoved ? {} : { transform: 'translate(-50%, -50%)' }}
					>
						{isDisabled && <div className='dialog-disable' />}
						<div
							className={Utils.getClassName([[isDragging, 'dialog-title-grabbing']], ['dialog-title'])}
							onMouseDown={handleMouseDownTitle}
						>
							<div className='flex-one'>{title}</div>
							<RxCross2 className='dialog-close' onClick={handleClose} />
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
