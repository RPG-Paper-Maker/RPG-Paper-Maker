/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState, useEffect, useRef } from 'react';
import '../styles/Splitter.css';
import { useDispatch } from 'react-redux';
import { triggerSplitting } from '../store';
import { Utils } from '../common/Utils';

type Props = {
	children: [JSX.Element, JSX.Element];
	vertical: boolean;
	defaultLeftSize?: number;
	className?: string;
	mobileHideFirst?: boolean;
};

function Splitter({ children, vertical, defaultLeftSize, className, mobileHideFirst = false }: Props) {
	const [isResizing, setIsResizing] = useState(false);
	const refLeft = useRef<HTMLDivElement>(null);

	const dispatch = useDispatch();

	const handleMouseDownSplitter = () => {
		setIsResizing(true);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (isResizing) {
			const leftDiv = refLeft.current;
			if (leftDiv) {
				if (vertical) {
					const pxSize = `${e.clientY}px`;
					leftDiv.style.minHeight = pxSize;
					leftDiv.style.maxHeight = pxSize;
					leftDiv.style.height = pxSize;
				} else {
					const pxSize = `${e.clientX}px`;
					leftDiv.style.minWidth = pxSize;
					leftDiv.style.maxWidth = pxSize;
					leftDiv.style.width = pxSize;
				}
			}
			dispatch(triggerSplitting());
		}
	};

	useEffect(() => {
		const handleMouseUp = () => {
			setIsResizing(false);
		};

		const leftDiv = refLeft.current;
		if (leftDiv && defaultLeftSize) {
			const pxSize = `${defaultLeftSize}px`;
			if (vertical) {
				leftDiv.style.minHeight = pxSize;
				leftDiv.style.maxHeight = pxSize;
				leftDiv.style.height = pxSize;
			} else {
				leftDiv.style.minWidth = pxSize;
				leftDiv.style.maxWidth = pxSize;
				leftDiv.style.width = pxSize;
			}
		}
		document.body.addEventListener('mouseup', handleMouseUp);
		return () => document.body.removeEventListener('mouseup', handleMouseUp);
		// eslint-disable-next-line
	}, []);

	return (
		<div
			className={`splitter ${vertical ? 'flex-column' : 'flex'} ${className} ${
				isResizing ? (vertical ? 'col-resize' : 'row-resize') : ''
			}`}
			onMouseMove={handleMouseMove}
		>
			<div className={`${mobileHideFirst ? 'mobile-hidden' : 'mobile-fill-width'} flex`} ref={refLeft}>
				{children[0]}
			</div>
			<div
				className={`splitter-button mobile-hidden ${vertical ? 'vertical' : 'horizontal'}`}
				onMouseDown={handleMouseDownSplitter}
			></div>
			<div className='flex flex-one'>{children[1]}</div>
		</div>
	);
}

export default Splitter;
