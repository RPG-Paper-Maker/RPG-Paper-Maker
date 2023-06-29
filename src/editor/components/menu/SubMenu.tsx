/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import SubMenuContent from './SubMenuContent';
import '../../styles/SubMenu.css';

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

	return (
		<div ref={refMain} className='custom-sub-menu'>
			<div
				ref={refTitle}
				onMouseEnter={onMouseEnterTitle}
				onMouseLeave={onMouseLeaveTitle}
				onMouseOver={onMouseOverTitle}
				className={'custom-sub-menu-title' + (isOpen ? ' custom-sub-menu-title-opened' : '')}
			>
				{icon}
				{title}
				<i ref={refArrow}></i>
			</div>
			<div className='absolute' ref={refContent}>
				<SubMenuContent
					subVisible={subVisible}
					setSubVisible={setSubVisible}
					testVisible={testVisible}
					setTestVisible={setTestVisible}
					setOpened={setIsOpen}
				>
					{children}
				</SubMenuContent>
			</div>
		</div>
	);
}

export default SubMenu;
