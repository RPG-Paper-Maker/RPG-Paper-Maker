/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import '../../styles/SubMenuContent.css';

type Props = {
	children: any;
	subVisible: boolean;
	setSubVisible: React.Dispatch<React.SetStateAction<boolean>>;
	testVisible: boolean;
	setTestVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

function SubMenuContent({ children, subVisible, setSubVisible, testVisible, setTestVisible, setOpened }: Props) {
	const onMouseLeave = (e: unknown) => {
		setSubVisible(false);
		setOpened(false);
	};

	const onMouseEnter = () => {
		setTestVisible(false);
		setOpened(true);
	};

	useEffect(() => {
		if (testVisible) {
			setTestVisible(false);
			setSubVisible(false);
		}
	});

	return (
		<div
			onMouseLeave={onMouseLeave}
			onMouseEnter={onMouseEnter}
			className='custom-sub-menu-content'
			hidden={!subVisible}
		>
			{children}
		</div>
	);
}

export default SubMenuContent;
