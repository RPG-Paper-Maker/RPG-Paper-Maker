/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { RxCross2 } from 'react-icons/rx';
import { useDispatch } from 'react-redux';
import { Utils } from '../../common/Utils';
import { Inputs } from '../../managers';
import { setIsOpeningNewDialog } from '../../store/slices/TriggersReducer';
import '../../styles/Dialog.css';
import '../../styles/Footer.css';
import Flex from '../Flex';
import Loader from '../Loader';

type Props = {
	children: React.ReactNode;
	title: string;
	isOpen: boolean;
	initialWidth?: string;
	initialHeight?: string;
	isDisabled?: boolean;
	isLoading?: boolean;
	zIndex?: number;
	footer?: React.ReactNode;
	onClose?: () => void;
};

enum RESIZING_TYPE {
	LEFT_RIGHT = 'ew-resize',
	BOTTOM = 'ns-resize',
	LEFT_BOTTOM = 'nesw-resize',
	RIGHT_BOTTOM = 'nwse-resize',
}

export enum Z_INDEX_LEVEL {
	LAYER_TWO = 2000,
	LAYER_TOP = 9999,
}

const RESIZING_SPACE = 5;

function Dialog({
	children,
	title,
	isOpen,
	initialWidth,
	initialHeight,
	isDisabled = false,
	isLoading = false,
	zIndex,
	footer,
	onClose,
}: Props) {
	const [isClickedIn, setIsClickedIn] = useState(false); // Prevent mouse down on div + mouse up out to close
	const [isDragging, setIsDragging] = useState(false);
	const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
	const [isMoved, setIsMoved] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [resizingType, setResizingType] = useState(RESIZING_TYPE.BOTTOM);
	const [resizingSide] = useState({ left: true });

	const dialogRef = useRef<HTMLDivElement>(null);

	const dispatch = useDispatch();

	const updatePosition = (x: number, y: number) => {
		if (dialogRef.current) {
			const min = 0;
			const rect = dialogRef.current.getBoundingClientRect();
			const maxX = window.innerWidth - rect.width;
			const maxY = window.innerHeight - rect.height;
			x = Math.min(maxX, Math.max(min, x));
			dialogRef.current.style.left = `${x}px`;
			y = Math.min(maxY, Math.max(min, y));
			dialogRef.current.style.top = `${y}px`;
		}
	};

	const handleMouseMoveDragging = (e: MouseEvent) => {
		if (isDragging) {
			updatePosition(e.clientX - initialPosition.x, e.clientY - initialPosition.y);
		}
	};

	const handleMouseMoveResizing = (e: MouseEvent) => {
		if (isResizing && dialogRef.current) {
			const rect = dialogRef.current.getBoundingClientRect();
			dialogRef.current.style.cursor = resizingType;
			let newWidth = rect.width;
			let newHeight = rect.height;
			if (
				resizingType === RESIZING_TYPE.LEFT_RIGHT ||
				resizingType === RESIZING_TYPE.LEFT_BOTTOM ||
				resizingType === RESIZING_TYPE.RIGHT_BOTTOM
			) {
				newWidth = resizingSide.left ? rect.right - e.clientX : e.clientX - rect.left;
				if (resizingSide.left) {
					if (e.clientX < rect.right) {
						dialogRef.current.style.width = `${newWidth}px`;
						const newrect = dialogRef.current.getBoundingClientRect();
						if (newrect.width !== rect.width) {
							dialogRef.current.style.left = `${e.clientX}px`;
						}
					}
				} else {
					if (e.clientX > rect.left) {
						dialogRef.current.style.width = `${newWidth}px`;
					}
				}
			}
			if (
				resizingType === RESIZING_TYPE.BOTTOM ||
				resizingType === RESIZING_TYPE.LEFT_BOTTOM ||
				resizingType === RESIZING_TYPE.RIGHT_BOTTOM
			) {
				newHeight = e.clientY - rect.top;
			}
			dialogRef.current.style.minHeight = `${newHeight}px`;
		}
	};

	const handleMouseUpResizing = () => {
		setIsResizing(false);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (dialogRef.current && !isResizing) {
			let cursor = '';
			const rect = dialogRef.current.getBoundingClientRect();
			const isBottom = e.clientY >= rect.y + rect.height - RESIZING_SPACE;
			if (e.clientX >= rect.x + rect.width - RESIZING_SPACE) {
				if (isBottom) {
					cursor = 'nwse-resize';
				} else {
					cursor = 'ew-resize';
				}
				resizingSide.left = false;
			} else if (e.clientX <= rect.x + RESIZING_SPACE) {
				if (isBottom) {
					cursor = 'nesw-resize';
				} else {
					cursor = 'ew-resize';
				}
				resizingSide.left = true;
			} else if (isBottom) {
				cursor = 'ns-resize';
			}
			dialogRef.current.style.cursor = cursor;
		}
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		setIsClickedIn(true);
		if (dialogRef.current && dialogRef.current.style.cursor) {
			setIsResizing(true);
			setResizingType(dialogRef.current.style.cursor as RESIZING_TYPE);
			setIsMoved(true);
			const rect = dialogRef.current.getBoundingClientRect();
			const x = e.clientX - rect.x;
			const y = e.clientY - rect.y;
			setInitialPosition({ x, y });
			updatePosition(e.clientX - x, e.clientY - y);
		}
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

	const handleMouseDownOverlay = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const container = dialogRef.current;
		const dialogs = document.getElementsByClassName('dialog');
		if (container === dialogs[dialogs.length - 1]) {
			e.stopPropagation();
		}
	};

	const handleCloseOut = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const container = dialogRef.current;
		const dialogs = document.getElementsByClassName('dialog');
		e.stopPropagation();
		if (dialogs.length <= 1 && !isClickedIn && !isLoading && container && !container.contains(e.target as Node)) {
			setIsMoved(false);
			if (onClose) {
				onClose();
			}
		} else {
			setIsClickedIn(false);
		}
	};

	const handleMouseDownTitle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		setIsDragging(true);
		setIsMoved(true);
		if (dialogRef.current) {
			const rect = dialogRef.current.getBoundingClientRect();
			const x = e.clientX - rect.x;
			const y = e.clientY - rect.y;
			setInitialPosition({ x, y });
			updatePosition(e.clientX - x, e.clientY - y);
		}
	};

	const handleMouseUpTitle = () => {
		setIsDragging(false);
		setInitialPosition({ x: 0, y: 0 });
	};

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMoveDragging);
			return () => {
				document.removeEventListener('mousemove', handleMouseMoveDragging);
			};
		} else if (isResizing) {
			document.addEventListener('mousemove', handleMouseMoveResizing);
			document.addEventListener('mouseup', handleMouseUpResizing);
			return () => {
				document.removeEventListener('mousemove', handleMouseMoveResizing);
				document.removeEventListener('mouseup', handleMouseUpResizing);
			};
		}
	});

	useEffect(() => {
		const dialogs = document.getElementsByClassName('dialog');
		Inputs.isMapFocused = dialogs.length === 0;
		if (dialogRef.current && isOpen) {
			dialogRef.current.style.width = initialWidth || '';
			dialogRef.current.style.height = initialHeight || '';
			dialogRef.current.style.minHeight = initialHeight || '';
		}
	}, [isOpen, initialWidth, initialHeight]);

	useEffect(() => {
		if (isOpen) {
			dispatch(setIsOpeningNewDialog());
			setIsDragging(false);
			setIsMoved(false);
			setInitialPosition({ x: 0, y: 0 });
			setIsClickedIn(false);
			setIsResizing(false);
		}
	}, [isOpen]);

	useEffect(() => {
		return () => {
			Inputs.isMapFocused = document.getElementsByClassName('dialog').length === 0;
		};
	}, []);

	const root = document.getElementById('root');
	if (!root || !isOpen) {
		return null;
	}

	return ReactDOM.createPortal(
		<div
			className='dialogOverlay'
			onClick={handleCloseOut}
			onMouseDown={handleMouseDownOverlay}
			onMouseUp={handleMouseUpTitle}
			style={{
				zIndex,
			}}
		>
			<div
				ref={dialogRef}
				className='dialog'
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				style={{
					transform: `translate(${isMoved ? '0,0' : '-50%,-50%'})`,
				}}
			>
				{isDisabled && <div className='dialogDisable' />}
				<div
					className={Utils.getClassName({ dialogTitleGrabbing: isDragging }, 'dialogTitle')}
					onMouseDown={handleMouseDownTitle}
				>
					<Flex one>{title}</Flex>
					{onClose && <RxCross2 className='dialogClose' onClick={handleClose} />}
				</div>
				<div className='dialogContent'>
					<Loader isLoading={isLoading} />
					{children}
				</div>
				<div className='dialogFooter'>{footer}</div>
			</div>
		</div>,
		root
	);
}

export default Dialog;
