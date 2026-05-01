/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

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
import { KEY, Utils } from '../common';
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
	const [isAnimatingClose, setIsAnimatingClose] = useState(false);
	const [isAnimatingOpen, setIsAnimatingOpen] = useState(false);
	const [preSelectedID, setPreSelectedID] = useState(options[0]?.id ?? -1);
	const [firstOpened, setFirstOpened] = useState(false);
	const [isWidthUpdated, setIsWidthUpdated] = useState(false);

	const dropdownContainerRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const selectedDropdownRef = useRef<HTMLInputElement>(null);
	const preSelectedElementRef = useRef<HTMLDivElement>(null);
	const selectedElementRef = useRef<HTMLDivElement>(null);

	const canDisplayDropdown = () => (isOpen || isAnimatingClose) && !needForceHide() && options.length > 0;

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
				setIsWidthUpdated(true);
			}
		}
	};

	const closeDropdown = () => {
		if (!isOpen && !isAnimatingClose) return;
		setIsAnimatingOpen(false);
		setIsAnimatingClose(true);
		setIsOpen(false);
	};

	const handleClick = () => {
		if (!disabled) {
			if (isOpen) {
				closeDropdown();
			} else {
				setIsAnimatingClose(false);
				setIsAnimatingOpen(true);
				setIsOpen(true);
				if (!firstOpened) {
					setFirstOpened(true);
				}
			}
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
				dropdown.getBoundingClientRect().width + DROPDOWN_SPACE_ARROW,
			)}px`;
			if (fillWidth) {
				container.style.minWidth = v;
			} else if (width === undefined) {
				container.style.width = v;
			}
		}
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
				closeDropdown();
			}
		};

		if (isOpen && options.length > 0) {
			const handleKeyDown = (e: KeyboardEvent) => {
				const index = options.findIndex((option) => option.id === preSelectedID);
				switch (e.key) {
					case KEY.ARROW_DOWN:
						setPreSelectedID((id) => (index === options.length - 1 ? id : options[index + 1].id));
						break;
					case KEY.ARROW_UP:
						setPreSelectedID((id) => (index <= 0 ? id : options[index - 1].id));
						break;
					case KEY.ENTER:
						if (index >= 0) {
							handleClickOption(options[index]);
							closeDropdown();
						}
						break;
				}
			};
			const currentDialog = Utils.getViewport();
			currentDialog.addEventListener('mousedown', handleMouseDownOutside as EventListener);
			window.addEventListener('keydown', handleKeyDown);
			return () => {
				currentDialog.removeEventListener('mousedown', handleMouseDownOutside as EventListener);
				window.removeEventListener('keydown', handleKeyDown);
			};
		}
	}, [isOpen, preSelectedID]);

	useEffect(() => {
		const dropdown = dropdownContainerRef.current;
		if (!dropdown) return;
		const handleAnimationEnd = (e: AnimationEvent) => {
			if (e.animationName === 'dropdownFadeOut') {
				setIsAnimatingClose(false);
			} else if (e.animationName === 'dropdownFadeIn') {
				setIsAnimatingOpen(false);
			}
		};
		dropdown.addEventListener('animationend', handleAnimationEnd);
		return () => dropdown.removeEventListener('animationend', handleAnimationEnd);
	}, []);

	useEffect(() => {
		preSelectedElementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	}, [preSelectedID]);

	useEffect(() => {
		selectedElementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	}, [selectedID]);

	useEffect(() => {
		if (disabled) {
			closeDropdown();
		}
	}, [disabled]);

	const handleWheel = (e: React.WheelEvent) => {
		if (isOpen || disabled || options.length === 0 || !firstOpened) {
			return;
		}
		const index = options.findIndex((option) => option.id === selectedID);
		if (e.deltaY > 0) {
			for (let i = index + 1; i < options.length; i++) {
				if (!disabledIds.includes(options[i].id)) {
					onChange(options[i].id);
					return;
				}
			}
		} else if (e.deltaY < 0) {
			for (let i = index - 1; i >= 0; i--) {
				if (!disabledIds.includes(options[i].id)) {
					onChange(options[i].id);
					return;
				}
			}
		}
	};

	const selectedOrEmpty = Model.Base.getByID(options, selectedID);
	const selected = selectedOrEmpty ?? Model.Base.create(selectedID, noSelectionName);

	const getCurrentItem = () =>
		translateOptions
			? t(selected.getName())
			: displayIDs && selectedOrEmpty
				? selected.toStringNameID()
				: selected.getName();

	const getDropdownItems = () =>
		options.map((option) => {
			const name = translateOptions
				? t(option.getName())
				: displayIDs
					? option.toStringNameID()
					: option.getName();
			return (
				<Flex key={option.id} one fillWidth>
					<Flex
						ref={
							option.id === preSelectedID
								? preSelectedElementRef
								: option.id === selectedID
									? selectedElementRef
									: null
						}
						spaced
						className={Utils.getClassName(
							{
								selected: selectedID === option.id,
								preSelected: preSelectedID === option.id,
								disabled: disabledIds.includes(option.id),
								whiteSpaceNowrap: !fillWidth,
								textEllipsis: isWidthUpdated,
							},
							'element',
						)}
						onClick={() => handleClickOption(option)}
						title={name}
					>
						{option.getDropdownIcon()}
						{name}
					</Flex>
				</Flex>
			);
		});

	return (
		<div
			className={Utils.getClassName({ open: isOpen, disabled, fillWidth }, 'dropdown')}
			style={{ width }}
			ref={containerRef}
			onClick={handleClick}
			onWheel={handleWheel}
		>
			<Flex one centerV spaced>
				<Flex
					one
					centerV
					className={Utils.getClassName({
						textEllipsis: !noWidthChange,
					})}
				>
					{getCurrentItem()}
				</Flex>
				<Flex className="dropdownArrow">
					<BsChevronDown />
				</Flex>
			</Flex>
			<div
				className={Utils.getClassName({ visibilityHidden: !canDisplayDropdown(), closing: isAnimatingClose, opening: isAnimatingOpen }, 'content')}
				ref={dropdownContainerRef}
			>
				{getDropdownItems()}
			</div>
		</div>
	);
}

export default Dropdown;
