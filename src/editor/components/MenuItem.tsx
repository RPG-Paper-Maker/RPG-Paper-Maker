/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../common';
import '../styles/MenuItem.css';

type Props = {
	children?: any;
	separator?: boolean;
	icon?: React.ReactNode;
	isActivable?: boolean;
	active?: boolean;
	index?: number;
	disabled?: boolean;
	shortcut?: string[];
	setActiveIndex?: (v: number) => void;
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	setTriggerCloseAll?: (v: boolean) => void;
};

function MenuItem({
	children,
	separator = false,
	icon,
	isActivable = false,
	active = false,
	index = 0,
	disabled = false,
	shortcut = [],
	setActiveIndex,
	onClick,
	setTriggerCloseAll,
}: Props) {
	const handleClick = (e: any) => {
		if (!disabled && !separator) {
			if (isActivable && setActiveIndex) {
				setActiveIndex(index);
			}
			if (onClick) {
				onClick(e);
				if (setTriggerCloseAll) {
					setTriggerCloseAll(true);
				}
			}
		}
	};

	const getShortcut = () => shortcut.join('+');

	return (
		<div
			onClick={handleClick}
			className={Utils.getClassName(
				[
					[active, 'active'],
					[disabled, 'disabled'],
					[separator, 'separator'],
				],
				['menu-item']
			)}
		>
			{icon}
			{shortcut.length > 0 ? (
				<>
					<div className='flex-one'>{children}</div>
					<div className='shortcut'>{getShortcut()}</div>
				</>
			) : (
				children
			)}
		</div>
	);
}

export default MenuItem;
