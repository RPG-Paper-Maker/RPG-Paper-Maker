/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState, useEffect, useRef } from 'react';
import { Utils } from '../common/Utils';
import '../styles/Button.css';

type Props = {
	children?: any;
	primary?: boolean;
	canHold?: boolean;
	intervalHold?: number;
	icon?: string;
	activable?: boolean;
	active?: boolean;
	onClick?: () => void;
};

function Button({
	children,
	primary = false,
	canHold = false,
	intervalHold = 0,
	icon = '',
	activable = false,
	active = true,
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
				let int = setInterval(() => {
					handleClick();
				}, intervalHold);
				let f1 = function () {
					clearInterval(int);
					document.removeEventListener('mouseup', f1);
				};
				let f2 = function () {
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
				[!activeState, 'button-unactive'],
				[primary, 'button-primary'],
			])}
			onClick={handleClick}
		>
			{icon !== '' && <img alt='button icon' src={'./assets/icons/' + icon} />}
			{children}
		</button>
	);
}

export default Button;
