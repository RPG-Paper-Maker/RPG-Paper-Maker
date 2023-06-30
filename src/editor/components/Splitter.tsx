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
		requestAnimationFrame(update);
	};

	useEffect(() => {
		if (size) {
			if (vertical) {
				ref.current!.style.width = size + 'px';
			} else {
				ref.current!.style.height = size + 'px';
			}
		}
		update();
		// eslint-disable-next-line
	}, []);

	return (
		<div ref={ref} className={`splitter ${vertical ? 'flex-column' : 'flex'} ${className}`}>
			{children[0]}
			<div className={vertical ? 'splitter-button-vertical' : 'splitter-button-horizontal'}></div>
			{children[1]}
		</div>
	);
}

export default Splitter;
