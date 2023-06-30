/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../../common/Utils';
import '../../styles/MenuItem.css';

type Props = {
	children?: any;
	type?: string;
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
	type,
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
		if (!disabled) {
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
					[active, 'custom-menu-item-active'],
					[disabled, 'custom-menu-item-disabled'],
					[type === 'separator', 'custom-menu-item-separator'],
				],
				['custom-menu-item']
			)}
		>
			{icon}
			{children}
		</div>
	);
}

export default MenuItem;
