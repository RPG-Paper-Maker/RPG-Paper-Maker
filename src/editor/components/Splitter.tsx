/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import '../styles/Splitter.css';

type Props = {
	children: [JSX.Element, JSX.Element];
	vertical: boolean;
	size?: number;
	className?: string;
};

function Splitter({ children, vertical, size, className }: Props) {
	const ref = useRef<HTMLHeadingElement>(null);

	const getStyle = () => {
		if (size) {
			const pxSize = `${size}px`;
			if (vertical) {
				return {
					minHeight: pxSize,
					maxHeight: pxSize,
					height: pxSize,
				};
			} else {
				return {
					minWidth: pxSize,
					maxWidth: pxSize,
					width: pxSize,
				};
			}
		}
	};

	useEffect(() => {
		// TODO
	}, []);

	return (
		<div className={`splitter ${vertical ? 'flex-column' : 'flex'} ${className}`}>
			<div className='flex' ref={ref} style={getStyle()}>
				{children[0]}
			</div>
			<div className={vertical ? 'splitter-button-vertical' : 'splitter-button-horizontal'}></div>
			<div className='flex flex-one'>{children[1]}</div>
		</div>
	);
}

export default Splitter;
