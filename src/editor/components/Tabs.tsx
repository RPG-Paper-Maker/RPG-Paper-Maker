/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode } from 'react';
import { RxCross2 } from 'react-icons/rx';
import '../styles/Tabs.css';

type Props = {
	titles: string[];
	contents: ReactNode[];
	currentIndex: number;
	setCurrentIndex: (v: number) => void;
	isClosable?: boolean;
};

function Tabs({ titles, contents, currentIndex, setCurrentIndex, isClosable = false }: Props) {
	const getTitles = () =>
		titles.map((title) => {
			return (
				<div className='tab-item'>
					{title}
					{isClosable && <RxCross2 />}
				</div>
			);
		});

	const getContent = () => contents[currentIndex];

	return (
		<div className='tabs'>
			<div className='tabs-titles'>{getTitles()}</div>
			<div className='tabs-content'>{getContent()}</div>
		</div>
	);
}

export default Tabs;
