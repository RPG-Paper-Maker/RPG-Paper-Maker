/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useState } from 'react';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';
import { Utils } from '../common';
import '../styles/Groupbox.css';
import Flex from './Flex';

type Props = {
	children?: ReactNode;
	title?: string;
	fillWidth?: boolean;
	disabled?: boolean;
	canExpand?: boolean;
	initialClose?: boolean;
};

function Groupbox({
	children,
	title = '',
	fillWidth = false,
	disabled = false,
	canExpand = false,
	initialClose = false,
}: Props) {
	const [isOpen, setIsOpen] = useState(!initialClose);

	const handleMouseDownSwitchExpand = () => {
		if (!canExpand || disabled) {
			return;
		}
		setIsOpen((v) => !v);
	};

	return isOpen ? (
		<fieldset className={Utils.getClassName({ fillWidth, disabled })}>
			<legend>
				<Flex
					spaced
					centerV
					className={canExpand && !disabled ? 'pointer' : undefined}
					onMouseDown={handleMouseDownSwitchExpand}
				>
					{canExpand && <HiChevronDown className='iconMedium' />}
					{title}
				</Flex>
			</legend>
			{isOpen && children}
		</fieldset>
	) : (
		<Flex spaced centerV fillWidth className='pointer' onMouseDown={handleMouseDownSwitchExpand}>
			<HiChevronRight className='iconMedium' />
			{title}
			<div className='horizontalSeparator' />
		</Flex>
	);
}

export default Groupbox;
