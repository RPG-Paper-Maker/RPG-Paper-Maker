/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronDown } from 'react-icons/bs';
import { Model } from '../Editor';
import { Utils } from '../common';
import '../styles/Dropdown.css';
import Flex from './Flex';

const DROPDOWN_SPACE_ARROW = 20;

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
	disabled?: boolean;
	disabledIds?: number[];
	displayIDs?: boolean;
	fillWidth?: boolean;
	noSelectionName?: string;
	noWidthChange?: boolean;
	width?: string;
};

function Dropdown({
	selectedID,
	onChange,
	options,
	translateOptions = false,
	disabled = false,
	disabledIds = [],
	displayIDs = false,
	fillWidth = false,
	noSelectionName = '',
	noWidthChange = false,
	width,
}: Props) {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);

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
			let top = getScrollingTop(container);
			const bottom = Utils.getViewportBottom();
			const left = container.getBoundingClientRect().x - Utils.getViewportLeft();
			const width = container.clientWidth;
			const height = top + dropdown.getBoundingClientRect().height;
			if (height > bottom) {
				top -= height - bottom;
			}
			dropdown.style.top = `${top}px`;
			dropdown.style.left = `${left}px`;
			if (!noWidthChange) {
				dropdown.style.width = `${width}px`;
			}
		}
	};

	const handleClick = () => {
		if (!disabled) {
			setIsOpen((value) => !value);
		}
	};

	const handleClickOption = (option: Model.Base) => {
		if (!disabledIds.includes(option.id)) {
			onChange(option.id);
		}
	};

	useLayoutEffect(() => {
		const container = containerRef.current;
		const dropdown = dropdownContainerRef.current;
		if (container && dropdown && !noWidthChange) {
			const v = `${Math.max(
				container.getBoundingClientRect().width,
				dropdown.getBoundingClientRect().width + DROPDOWN_SPACE_ARROW
			)}px`;
			if (fillWidth) {
				container.style.minWidth = v;
			} else if (width === undefined) {
				container.style.width = v;
			}
		}
		// eslint-disable-next-line
	}, [fillWidth]);

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
		const handleMouseDownOutside = (event: MouseEvent) => {
			const container = containerRef.current;
			if (container && !container.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			const dialogs = document.getElementsByClassName('dialog');
			const currentDialog = dialogs.length === 0 ? document : dialogs[dialogs.length - 1];
			currentDialog.addEventListener('mousedown', handleMouseDownOutside as EventListener);
			return () => {
				currentDialog.removeEventListener('mousedown', handleMouseDownOutside as EventListener);
			};
		}
	}, [isOpen]);

	useEffect(() => {
		if (disabled) {
			setIsOpen(false);
		}
	}, [disabled]);

	const selectedOrEmpty = Model.Base.getByID(options, selectedID);
	const selected = selectedOrEmpty ?? Model.Base.create(selectedID, noSelectionName);

	const getCurrentItem = () =>
		translateOptions ? t(selected.name) : displayIDs && selectedOrEmpty ? selected.toStringNameID() : selected.name;

	const getDropdownItems = () =>
		options.map((option) => (
			<Flex
				spaced
				className={Utils.getClassName(
					{
						selected: selectedID === option.id,
						disabled: disabledIds.includes(option.id),
						whiteSpaceNowrap: !fillWidth,
					},
					'element'
				)}
				key={option.id}
				onClick={() => handleClickOption(option)}
			>
				{option.getDropdownIcon()}
				{translateOptions ? t(option.name) : displayIDs ? option.toStringNameID() : option.name}
			</Flex>
		));

	return (
		<div
			className={Utils.getClassName({ open: isOpen, disabled, fillWidth }, 'dropdown')}
			style={{ width }}
			ref={containerRef}
			onClick={handleClick}
		>
			<Flex one centerV spaced>
				<Flex one centerV className={Utils.getClassName({ textEllipsis: fillWidth })}>
					{getCurrentItem()}
				</Flex>
				<Flex>
					<BsChevronDown />
				</Flex>
			</Flex>
			<div
				className={Utils.getClassName({ visibilityHidden: !canDisplayDropdown() }, 'content')}
				ref={dropdownContainerRef}
			>
				{getDropdownItems()}
			</div>
		</div>
	);
}

export default Dropdown;
