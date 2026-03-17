/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactElement } from 'react';
import { Utils } from '../common';
import { Keyboard } from '../models';
import '../styles/MenuItem.css';
import Flex from './Flex';
import Tooltip from './Tooltip';

type Props = {
	children?: ReactElement | ReactElement[] | string | string[];
	separator?: boolean;
	icon?: React.ReactNode;
	isActivable?: boolean;
	active?: boolean;
	index?: number;
	disabled?: boolean;
	shortcut?: string[];
	tooltip?: string;
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
	tooltip,
	setActiveIndex,
	onClick,
	setTriggerCloseAll,
}: Props) {
	const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
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

	const content = (
		<>
			{icon}
			{shortcut.length > 0 ? (
				<>
					<Flex one>{children}</Flex>
					<div className='shortcut'>{Keyboard.toStringShortcut(shortcut)}</div>
				</>
			) : (
				children
			)}
		</>
	);
	return (
		<div
			onClick={handleClick}
			className={Utils.getClassName(
				{
					active,
					disabled,
					separator,
				},
				'menuItem',
			)}
		>
			{tooltip ? <Tooltip text={tooltip}>{content}</Tooltip> : content}
		</div>
	);
}

export default MenuItem;
