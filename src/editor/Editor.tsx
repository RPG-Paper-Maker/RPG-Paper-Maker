/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { lazy, useEffect, useLayoutEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Constants } from './common';
import Flex from './components/Flex';
import UpdateCountdown from './components/UpdateCountdown';
import i18n from './i18n/i18n';
import { Inputs } from './managers/Inputs';
import { RootState } from './store';
import './styles/Editor.css';
import './styles/Mobile.css';
import './styles/themes/White.css';
const MainMenuBar = lazy(() => import('./components/MainMenuBar'));
const PanelLoading = lazy(() => import('./components/panels/PanelLoading'));
const PanelMain = lazy(() => import('./components/panels/PanelMain'));

function Editor() {
	const [loaded, setLoaded] = useState(false);
	const theme = useSelector((state: RootState) => state.settings.theme);

	useEffect(() => {
		const handleKeyDown = (e: globalThis.KeyboardEvent) => {
			Inputs.isALT = e.altKey;
			Inputs.isCTRL = e.ctrlKey;
			Inputs.isSHIFT = e.shiftKey;
		};
		const handleKeyUp = (e: globalThis.KeyboardEvent) => {
			Inputs.isALT = e.altKey;
			Inputs.isCTRL = e.ctrlKey;
			Inputs.isSHIFT = e.shiftKey;
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	}, []);

	useLayoutEffect(() => {
		document.documentElement.classList.add('white-theme');
	}, [theme]);

	return (
		<I18nextProvider i18n={i18n}>
			{loaded ? (
				<Flex
					id='main'
					column
					className='fillSpace'
					onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.preventDefault()}
				>
					{!Constants.IS_DESKTOP && <UpdateCountdown />}
					<MainMenuBar />
					<PanelMain />
				</Flex>
			) : (
				<PanelLoading setLoaded={setLoaded} />
			)}
		</I18nextProvider>
	);
}

export * as Manager from './managers/index';
export * as Scene from './scenes/index';
export * as Model from './models/index';
export * as MapElement from './mapElements/index';
export * as Data from './data/index';

export default Editor;
