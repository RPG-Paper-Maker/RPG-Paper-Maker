/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useRef, useState } from 'react';
import { BUTTON_TYPE, Utils } from '../common';
import '../styles/Button.css';

type Props = {
	children?: ReactNode;
	buttonType?: BUTTON_TYPE;
	disabled?: boolean;
	canHold?: boolean;
	intervalHold?: number;
	icon?: ReactNode;
	activable?: boolean;
	active?: boolean;
	big?: boolean;
	backgroundOnHoverOnly?: boolean;
	square?: boolean;
	small?: boolean;
	onClick?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
};

function Button({
	children,
	buttonType = BUTTON_TYPE.DEFAULT,
	disabled = false,
	canHold = false,
	intervalHold = 0,
	icon,
	activable = false,
	active = true,
	big = false,
	backgroundOnHoverOnly = false,
	square = false,
	small = false,
	onClick,
	onMouseEnter,
	onMouseLeave,
}: Props) {
	const [activeState, setActiveState] = useState(active);
	const ref = useRef<HTMLButtonElement>(null);

	if (active !== activeState) {
		setActiveState(active);
	}

	const unactive = !activeState;

	const handleClick = () => {
		if (!disabled) {
			if (onClick) {
				onClick();
			}
			if (activable) {
				setActiveState(!activeState);
			}
		}
	};

	useEffect(() => {
		const current = ref.current;
		if (canHold && current) {
			const handle = () => {
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
	}, []);

	return (
		<button
			ref={ref}
			className={Utils.getClassName(
				{ disabled, unactive, big, backgroundOnHoverOnly, square, small },
				buttonType
			)}
			onClick={handleClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{icon}
			{children}
		</button>
	);
}

export default Button;
