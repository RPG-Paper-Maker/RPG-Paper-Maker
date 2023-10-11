/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState, useRef, useEffect, ReactNode, Children, cloneElement } from 'react';
import { Utils } from '../common/Utils';
import '../styles/MenuSub.css';

type Props = {
	children: any;
	title?: string;
	icon?: ReactNode;
	isActivable?: boolean;
	active?: boolean;
	index?: number;
	disabled?: boolean;
	shortcut?: string[];
	isRoot?: boolean;
	setActiveIndex?: (v: number) => void;
	triggerCloseAll?: boolean;
	setTriggerCloseAll?: (v: boolean) => void;
	onClick?: () => void;
};

function MenuSub({
	children,
	title,
	icon,
	isActivable = false,
	active = false,
	index = 0,
	disabled = false,
	shortcut = [],
	isRoot = false,
	setActiveIndex,
	triggerCloseAll,
	setTriggerCloseAll,
	onClick,
}: Props) {
	const [testVisible, setTestVisible] = useState(false);
	const [subVisible, setSubVisible] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const refMain = useRef<HTMLHeadingElement>(null);
	const refTitle = useRef<HTMLHeadingElement>(null);
	const refArrow = useRef<HTMLHeadingElement>(null);
	const refContent = useRef<HTMLHeadingElement>(null);

	const items = Children.map(children, (child) =>
		cloneElement(child, {
			setTriggerCloseAll,
			onClick: (e: any) => {
				if (child.props.onClick) {
					child.props.onClick(e);
				}
				if (isActivable && setActiveIndex) {
					setActiveIndex(index);
				}
			},
		})
	);

	const handleMouseEnterTitle = () => {
		if (!disabled) {
			setSubVisible(true);
			setIsOpen(true);
		}
	};

	const handleMouseLeaveTitle = () => {
		setTestVisible(true);
		setIsOpen(false);
	};

	const handleMouseOverTitle = () => {
		if (!disabled) {
			setSubVisible(true);
		}
	};

	const handleMouseLeaveContent = () => {
		setSubVisible(false);
		setIsOpen(false);
	};

	const handleMouseEnterContent = () => {
		setTestVisible(false);
		setIsOpen(true);
	};

	const handleClick = (e: any) => {
		if (!disabled) {
			if (isActivable && setActiveIndex) {
				setActiveIndex(index);
			}
			onClick?.();
		}
	};

	useEffect(() => {
		if (refMain.current && refMain.current.parentElement) {
			if (!isRoot && refArrow.current) {
				refArrow.current.classList.add('arrow-right');
			}
			if (refTitle.current && refContent.current) {
				const rect = refTitle.current.getBoundingClientRect();
				let left = 0;
				let top = 0;
				if (isRoot) {
					left = rect.left;
					top = refTitle.current.offsetTop + refTitle.current.offsetHeight;
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

	const getShortcut = () => shortcut.join(' + ');

	return (
		<div ref={refMain} className='menu-sub'>
			<div
				className={Utils.getClassName(
					[
						[active, 'active'],
						[isOpen, 'opened'],
						[disabled, 'disabled'],
					],
					['menu-sub-title']
				)}
				ref={refTitle}
				onMouseEnter={handleMouseEnterTitle}
				onMouseLeave={handleMouseLeaveTitle}
				onMouseOver={handleMouseOverTitle}
				onClick={handleClick}
			>
				{icon}
				{title}
				{getShortcut()}
				{!isRoot && <i ref={refArrow}></i>}
			</div>
			<div ref={refContent} className='absolute'>
				<div
					className='menu-sub-content'
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
