/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { lazy, useEffect, useLayoutEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Constants, RPM } from './common';
import DialogError from './components/dialogs/DialogError';
import Flex from './components/Flex';
import UpdateCountdown from './components/UpdateCountdown';
import UpdateVersionWarning from './components/UpdateVersionWarning';
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
	const engineFontSize = useSelector((state: RootState) => state.settings.engineFontSize);

	useEffect(() => {
		const handleKeyDown = (e: globalThis.KeyboardEvent) => {
			Inputs.isALT = e.altKey;
			Inputs.isCTRL = e.ctrlKey;
			Inputs.isSHIFT = e.shiftKey;
			if (RPM.isFocusingTree && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
				// Prevent parent scrollbar if focusing a list
				e.preventDefault();
			}
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
		document.documentElement.className = '';
		document.documentElement.classList.add(theme);
	}, [theme]);

	useLayoutEffect(() => {
		document.documentElement.style.setProperty('--engine-font-size', `${engineFontSize}px`);
	}, [engineFontSize]);

	return (
		<I18nextProvider i18n={i18n}>
			<DialogError />
			{loaded ? (
				<Flex
					id='main'
					column
					className='fillSpace'
					onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.preventDefault()}
				>
					<MainMenuBar />
					{Constants.IS_DESKTOP ? <UpdateVersionWarning /> : <UpdateCountdown />}
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
