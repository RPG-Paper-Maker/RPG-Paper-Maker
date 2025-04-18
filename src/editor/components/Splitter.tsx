/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSX, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Utils } from '../common';
import { triggerSplitting } from '../store';
import '../styles/Splitter.css';
import Flex from './Flex';

type Props = {
	children: [JSX.Element | undefined, JSX.Element | undefined];
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
				const rect = leftDiv.getBoundingClientRect();
				if (vertical) {
					const pxSize = `${e.clientY - rect.y}px`;
					leftDiv.style.minHeight = pxSize;
					leftDiv.style.maxHeight = pxSize;
					leftDiv.style.height = pxSize;
				} else {
					const pxSize = `${e.clientX - rect.x}px`;
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

	return children[0] && children[1] ? (
		<div
			className={Utils.getClassName(
				{
					flexColumn: vertical,
					fillWidth: vertical,
					colResize: isResizing && vertical,
					rowResize: isResizing && !vertical,
				},
				`splitter flex ${className ?? ''}`
			)}
			onMouseMove={handleMouseMove}
		>
			<div className={`${mobileHideFirst ? 'mobileHidden' : 'mobileFillWidth'} flex`} ref={refLeft}>
				{children[0]}
			</div>
			<div
				className={`splitterButton mobileHidden ${vertical ? 'vertical' : 'horizontal'}`}
				onMouseDown={handleMouseDownSplitter}
			></div>
			<Flex one>{children[1]}</Flex>
		</div>
	) : (
		children[0] ?? children[1] ?? null
	);
}

export default Splitter;
