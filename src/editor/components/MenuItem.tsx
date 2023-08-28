/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../common/Utils';
import '../styles/MenuItem.css';

type Props = {
	children?: any;
	separator?: boolean;
	icon?: React.ReactNode;
	isActivable?: boolean;
	active?: boolean;
	index?: number;
	disabled?: boolean;
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
			{children}
		</div>
	);
}

export default MenuItem;
