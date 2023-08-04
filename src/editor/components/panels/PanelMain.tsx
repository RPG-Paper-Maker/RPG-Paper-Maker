/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Loader from '../Loader';
import PanelNoProject from './PanelNoProject';
import PanelProject from './PanelProject';

function PanelMain() {
	const currentProjectName = useSelector((state: RootState) => state.projects.current);
	const loading = useSelector((state: RootState) => state.projects.loading);

	return (
		<div className='flex-one flex relative'>
			<Loader large isLoading={loading} />
			{currentProjectName.length === 0 ? <PanelNoProject /> : <PanelProject />}
		</div>
	);
}

export default PanelMain;
