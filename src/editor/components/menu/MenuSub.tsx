/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState, useRef, useEffect, ReactNode, Children, cloneElement } from 'react';
import '../../styles/MenuSub.css';
import { Utils } from '../../common/Utils';

type Props = {
	children: any;
	title?: string;
	icon?: ReactNode;
	triggerCloseAll?: boolean;
	setTriggerCloseAll?: (v: boolean) => void;
};

function MenuSub({ children, title, icon, triggerCloseAll, setTriggerCloseAll }: Props) {
	const [testVisible, setTestVisible] = useState(false);
	const [subVisible, setSubVisible] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const refMain = useRef<HTMLHeadingElement>(null);
	const refTitle = useRef<HTMLHeadingElement>(null);
	const refArrow = useRef<HTMLHeadingElement>(null);
	const refContent = useRef<HTMLHeadingElement>(null);

	const items = Children.map(children, (child) => cloneElement(child, { setTriggerCloseAll: setTriggerCloseAll }));

	const handleMouseEnterTitle = () => {
		setSubVisible(true);
		setIsOpen(true);
	};

	const handleMouseLeaveTitle = () => {
		setTestVisible(true);
		setIsOpen(false);
	};

	const handleMouseOverTitle = () => {
		setSubVisible(true);
	};

	const handleMouseLeaveContent = () => {
		setSubVisible(false);
		setIsOpen(false);
	};

	const handleMouseEnterContent = () => {
		setTestVisible(false);
		setIsOpen(true);
	};

	useEffect(() => {
		if (refMain.current && refArrow.current && refMain.current.parentElement) {
			let isRoot = refMain.current.parentElement.classList.contains('custom-menu');
			if (!isRoot) {
				refArrow.current.classList.add('arrow-right');
			}
			if (refTitle.current && refContent.current) {
				let rect = refTitle.current.getBoundingClientRect();
				let left = 0;
				let top = 0;
				if (isRoot) {
					left = rect.left;
					top = rect.bottom;
				} else {
					left = refTitle.current.offsetWidth;
					top = rect.top - rect.height;
				}
				refContent.current.style.top = `${top}px`;
				refContent.current.style.left = `${left}px`;
			}
		}
	});

	useEffect(() => {
		if (testVisible) {
			setTestVisible(false);
			setSubVisible(false);
		}
	}, [testVisible]);

	useEffect(() => {
		if (triggerCloseAll) {
			setIsOpen(false);
			setSubVisible(false);
			setTestVisible(false);
		}
	}, [triggerCloseAll]);

	return (
		<div ref={refMain} className='custom-menu-sub'>
			<div
				className={Utils.getClassName([[isOpen, 'custom-menu-sub-title-opened']], ['custom-menu-sub-title'])}
				ref={refTitle}
				onMouseEnter={handleMouseEnterTitle}
				onMouseLeave={handleMouseLeaveTitle}
				onMouseOver={handleMouseOverTitle}
			>
				{icon}
				{title}
				<i ref={refArrow}></i>
			</div>
			<div ref={refContent} className='absolute'>
				<div
					className='custom-menu-sub-content'
					onMouseLeave={handleMouseLeaveContent}
					onMouseEnter={handleMouseEnterContent}
					hidden={!subVisible}
				>
					{items}
				</div>
			</div>
		</div>
	);
}

export default MenuSub;
