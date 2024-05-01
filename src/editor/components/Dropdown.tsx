/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Model } from '../Editor';
import { Utils } from '../common';
import '../styles/Dropdown.css';

const DROPDOWN_SPACE_ARROW = 30;

const getScrollingTop = (element?: HTMLElement) => {
	const bounding = element?.getBoundingClientRect();
	const positionTop = Utils.getViewportTop();

	return bounding && element ? bounding.top - positionTop + element.offsetHeight : 0;
};

const isScrollable = (element: HTMLElement) => {
	const hasScrollableContent = element.scrollHeight > element.clientHeight;
	const overflowYStyle = window.getComputedStyle(element).overflowY;
	const isOverflowHidden = overflowYStyle.indexOf('auto') !== -1;
	return hasScrollableContent && isOverflowHidden;
};

const getScrollableParent = (element: HTMLElement | ParentNode | null): Window | HTMLElement =>
	!element || element === document.body
		? window
		: isScrollable(element as HTMLElement)
		? (element as HTMLElement)
		: getScrollableParent(element.parentNode);

type Props = {
	selectedID: number;
	onChange: (id: number) => void;
	options: Model.Base[];
	translateOptions?: boolean;
	displayIDs?: boolean;
};

function Dropdown({ selectedID, onChange, options, translateOptions = false, displayIDs = false }: Props) {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
	const [needReset, setNeedReset] = useState(false);

	const dropdownContainerRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const selectedDropdownRef = useRef<HTMLInputElement>(null);

	const canDisplayDropdown = () => isOpen && !needForceHide() && options.length > 0;

	const needForceHide = () => {
		const container = containerRef.current;
		const dropdown = dropdownContainerRef.current;
		if (!dropdown) {
			return false;
		}
		const parent = getScrollableParent(container) as HTMLElement;
		return parseInt(dropdown.style.top) - 5 > parent.offsetTop + parent.offsetHeight;
	};

	const updateDropdownScroll = () => {
		const selected = selectedDropdownRef.current;
		const dropdown = dropdownContainerRef.current;
		if (selected && dropdown) {
			const rectDropdown = dropdown.getBoundingClientRect();
			if (selected.offsetTop + selected.offsetHeight >= rectDropdown.height) {
				dropdown.scrollTop += selected.offsetHeight;
			}
			if (selected.offsetTop < dropdown.scrollTop) {
				dropdown.scrollTop = selected.offsetTop;
			}
		}
	};

	const handleScroll = () => {
		const container = containerRef.current;
		const dropdown = dropdownContainerRef.current;
		if (container && dropdown) {
			const top = getScrollingTop(container);
			const left = container.getBoundingClientRect().x - Utils.getViewportLeft();
			const width = container.clientWidth;
			dropdown.style.top = `${top}px`;
			dropdown.style.left = `${left}px`;
			dropdown.style.width = `${width}px`;
		}
	};

	const handleClick = () => {
		setIsOpen((value) => !value);
	};

	const handleClickOption = (option: Model.Base) => {
		onChange(option.id);
	};

	const handleClickOutside = (event: MouseEvent) => {
		const container = containerRef.current;
		if (container && !container.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useLayoutEffect(() => {
		const container = containerRef.current;
		const dropdown = dropdownContainerRef.current;
		if (container && dropdown) {
			if (needReset) {
				dropdown.style.width = '';
				setNeedReset(false);
			}
			container.style.width = `${dropdown.getBoundingClientRect().width + DROPDOWN_SPACE_ARROW}px`;
		}
	}, [needReset]);

	useLayoutEffect(() => {
		handleScroll();
		updateDropdownScroll();
		const parent = getScrollableParent(containerRef.current);
		parent.addEventListener('scroll', handleScroll);
		return () => {
			parent.removeEventListener('scroll', handleScroll);
		};
	});

	useEffect(() => {
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	}, [isOpen]);

	useLayoutEffect(() => {
		const handleLanguageChanged = () => {
			setNeedReset(true);
		};
		i18n.on('languageChanged', handleLanguageChanged);

		// Cleanup
		return () => {
			i18n.off('languageChanged', handleLanguageChanged);
		};
	}, []);

	const selected = Model.Base.getByIDOrFirst(options, selectedID);

	const getCurrentItem = () =>
		translateOptions ? t(selected.name) : displayIDs ? selected.toStringNameID() : selected.name;

	const getDropdownItems = () =>
		options.map((option) => (
			<div
				className={Utils.getClassName([[selectedID === option.id, 'selected']], ['element'])}
				key={option.id}
				onClick={() => handleClickOption(option)}
			>
				{translateOptions ? t(option.name) : displayIDs ? option.toStringNameID() : option.name}
			</div>
		));

	return (
		<div className={Utils.getClassName([[isOpen, 'open']], ['dropdown'])} ref={containerRef} onClick={handleClick}>
			<div className='flex-one flex-center-v gap-small'>
				<div className='flex-one flex-center-v'>{getCurrentItem()}</div>
				<div className='flex'>
					<BsChevronDown />
				</div>
			</div>
			<div
				className={Utils.getClassName([[!canDisplayDropdown(), 'visibility-hidden']], ['content'])}
				ref={dropdownContainerRef}
			>
				{getDropdownItems()}
			</div>
		</div>
	);
}

export default Dropdown;
