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

	const update = () => {
		//flex fill-height
		//requestAnimationFrame(update);
	};

	useEffect(() => {
		if (size) {
			if (vertical) {
				ref.current!.style.minHeight = size + 'px';
				ref.current!.style.maxHeight = size + 'px';
				ref.current!.style.height = size + 'px';
			} else {
				ref.current!.style.minWidth = size + 'px';
				ref.current!.style.maxWidth = size + 'px';
				ref.current!.style.width = size + 'px';
			}
		}
		update();
		// eslint-disable-next-line
	}, []);

	return (
		<div className={`splitter ${vertical ? 'flex-column' : 'flex'} ${className}`}>
			<div ref={ref}>{children[0]}</div>
			<div className={vertical ? 'splitter-button-vertical' : 'splitter-button-horizontal'}></div>
			<div className='flex flex-one'>{children[1]}</div>
		</div>
	);
}

export default Splitter;
