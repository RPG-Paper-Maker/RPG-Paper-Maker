/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState, useEffect, useRef, ReactNode } from 'react';
import '../styles/Button.css';
import { Utils } from '../common';

type Props = {
	children?: any;
	primary?: boolean;
	canHold?: boolean;
	intervalHold?: number;
	icon?: ReactNode;
	activable?: boolean;
	active?: boolean;
	big?: boolean;
	patreon?: boolean;
	onClick?: () => void;
};

function Button({
	children,
	primary = false,
	canHold = false,
	intervalHold = 0,
	icon,
	activable = false,
	active = true,
	big = false,
	patreon = false,
	onClick,
}: Props) {
	const [activeState, setActiveState] = useState(active);
	const ref = useRef<HTMLButtonElement>(null);

	if (active !== activeState) {
		setActiveState(active);
	}

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
		if (activable) {
			setActiveState(!activeState);
		}
	};

	useEffect(() => {
		const current = ref.current;
		if (canHold && current) {
			const handle = (e: any) => {
				const int = setInterval(() => {
					handleClick();
				}, intervalHold);
				const f1 = () => {
					clearInterval(int);
					document.removeEventListener('mouseup', f1);
				};
				const f2 = () => {
					clearInterval(int);
					document.removeEventListener('touchend', f2);
				};
				document.addEventListener('mouseup', f1);
				document.addEventListener('touchend', f2);
			};
			current.addEventListener('pointerdown', handle);
			return () => {
				current.removeEventListener('pointerdown', handle);
			};
		}
		// eslint-disable-next-line
	}, []);

	return (
		<button
			ref={ref}
			className={Utils.getClassName([
				[!activeState, 'unactive'],
				[primary, 'primary'],
				[big, 'big'],
				[patreon, 'patreon'],
			])}
			onClick={handleClick}
		>
			{icon}
			{children}
		</button>
	);
}

export default Button;
