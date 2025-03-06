/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Children, cloneElement, JSX, useEffect, useState } from 'react';
import { Utils } from '../common';
import '../styles/Menu.css';

type Props = {
	children: JSX.Element | JSX.Element[];
	horizontal?: boolean;
	isActivable?: boolean;
	activeIndex?: number;
	setActiveIndex?: (v: number) => void;
	isVisible?: boolean;
};

function Menu({
	children,
	horizontal = false,
	isActivable = false,
	activeIndex = 0,
	setActiveIndex,
	isVisible = true,
}: Props) {
	const [triggerCloseAll, setTriggerCloseAll] = useState(false);

	const items = Children.map(children, (child, index) =>
		cloneElement(child, {
			triggerCloseAll,
			setTriggerCloseAll,
			isActivable,
			active: isActivable && activeIndex === index,
			setActiveIndex,
			index,
			isRoot: true,
		})
	);

	useEffect(() => {
		if (triggerCloseAll) {
			setTriggerCloseAll(false);
		}
	}, [triggerCloseAll]);

	return (
		<div className={Utils.getClassName({ menuHorizontal: horizontal, hidden: !isVisible }, 'menu')}>{items}</div>
	);
}

export default Menu;
