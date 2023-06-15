/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState, useRef, useEffect } from 'react';
import SubMenuContent from './SubMenuContent';
import '../styles/SubMenu.css';

type Props = {
	children?: any;
	title?: string;
	icon?: string;
};

function SubMenu({ children, title, icon }: Props) {
	let [testVisible, setTestVisible] = useState<boolean>(false);
	let [subVisible, setSubVisible] = useState<boolean>(false);
	let [opened, setOpened] = useState<boolean>(false);
	let [isClickingSub, setIsClickingSub] = useState<boolean>(false);
	const refMain = useRef<HTMLHeadingElement>(null);
	const refTitle = useRef<HTMLHeadingElement>(null);
	const refArrow = useRef<HTMLHeadingElement>(null);
	const refContent = useRef<HTMLHeadingElement>(null);

	const onMouseEnter = () => {
		setSubVisible(true);
	};

	const onMouseLeave = () => {
		setTestVisible(true);
	};

	const onMouseOver = () => {
		setSubVisible(true);
	};

	const onClick = () => {
		if (!isClickingSub) {
			setOpened(false);
			setSubVisible(false);
		}
		setIsClickingSub(false);
	};

	const onClickInSub = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		setOpened(true);
		setSubVisible(true);
		setIsClickingSub(true);
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
					left = rect.right;
					top = rect.top - rect.height;
				}
				refContent.current.setAttribute('style', 'top:' + top + 'px; left:' + left + 'px;');
			}
		}
	});

	return (
		<div ref={refMain} className='custom-sub-menu'>
			<div
				ref={refTitle}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onMouseOver={onMouseOver}
				onClick={onClickInSub}
				className={'custom-sub-menu-title' + (opened ? ' custom-sub-menu-title-opened' : '')}
			>
				{icon ? <img alt='menu icon' src={'/assets/icons/' + icon}></img> : null}
				{icon && title ? <label>&nbsp;</label> : null}
				{title}
				<i ref={refArrow}></i>
			</div>
			<div className='absolute' ref={refContent} onClick={onClick}>
				<SubMenuContent
					subVisible={subVisible}
					setSubVisible={setSubVisible}
					testVisible={testVisible}
					setTestVisible={setTestVisible}
					setOpened={setOpened}
				>
					{children}
				</SubMenuContent>
			</div>
		</div>
	);
}

export default SubMenu;
