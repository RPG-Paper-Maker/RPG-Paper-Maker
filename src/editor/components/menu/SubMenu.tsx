/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import '../../styles/SubMenu.css';
import { Utils } from '../../common/Utils';

type Props = {
	children?: ReactNode | ReactNode[];
	title?: string;
	icon?: ReactNode;
};

function SubMenu({ children, title, icon }: Props) {
	const [testVisible, setTestVisible] = useState(false);
	const [subVisible, setSubVisible] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const refMain = useRef<HTMLHeadingElement>(null);
	const refTitle = useRef<HTMLHeadingElement>(null);
	const refArrow = useRef<HTMLHeadingElement>(null);
	const refContent = useRef<HTMLHeadingElement>(null);

	const onMouseEnterTitle = () => {
		setSubVisible(true);
		setIsOpen(true);
	};

	const onMouseLeaveTitle = () => {
		setTestVisible(true);
		setIsOpen(false);
	};

	const onMouseOverTitle = () => {
		setSubVisible(true);
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

	const onMouseLeave = (e: unknown) => {
		setSubVisible(false);
		setIsOpen(false);
	};

	const onMouseEnter = () => {
		setTestVisible(false);
		setIsOpen(true);
	};

	useEffect(() => {
		if (testVisible) {
			setTestVisible(false);
			setSubVisible(false);
		}
	}, [testVisible]);

	return (
		<div ref={refMain} className='custom-sub-menu'>
			<div
				className={Utils.getClassName([[isOpen, 'custom-sub-menu-title-opened']], ['custom-sub-menu-title'])}
				ref={refTitle}
				onMouseEnter={onMouseEnterTitle}
				onMouseLeave={onMouseLeaveTitle}
				onMouseOver={onMouseOverTitle}
			>
				{icon}
				{title}
				<i ref={refArrow}></i>
			</div>
			<div ref={refContent} className='absolute'>
				<div
					className='custom-sub-menu-content'
					onMouseLeave={onMouseLeave}
					onMouseEnter={onMouseEnter}
					hidden={!subVisible}
				>
					{children}
				</div>
			</div>
		</div>
	);
}

export default SubMenu;
