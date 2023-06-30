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
	disabled?: boolean;
	icon?: React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	setTriggerCloseAll?: (v: boolean) => void;
};

function MenuItem({ children, type, disabled = false, icon, onClick, setTriggerCloseAll }: Props) {
	const handleClick = (e: any) => {
		if (onClick && !disabled) {
			onClick(e);
			if (setTriggerCloseAll) {
				setTriggerCloseAll(true);
			}
		}
	};

	return (
		<div
			onClick={handleClick}
			className={Utils.getClassName(
				[
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
