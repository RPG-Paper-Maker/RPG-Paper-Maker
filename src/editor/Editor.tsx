/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import Flex from './components/Flex';
import MainMenuBar from './components/MainMenuBar';
import PanelLoading from './components/panels/PanelLoading';
import PanelMain from './components/panels/PanelMain';
import i18n from './i18n/i18n';
import { Inputs } from './managers/Inputs';
import { store } from './store';
import './styles/Editor.css';
import './styles/Mobile.css';

function Editor() {
	const [loaded, setLoaded] = useState(false);

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

	return (
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				{loaded ? (
					<Flex
						id='main'
						column
						className='fillSpace'
						onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.preventDefault()}
					>
						<MainMenuBar />
						<PanelMain />
					</Flex>
				) : (
					<PanelLoading setLoaded={setLoaded} />
				)}
			</I18nextProvider>
		</Provider>
	);
}

export * as Manager from './managers/index';
export * as Scene from './scenes/index';
export * as Model from './models/index';
export * as MapElement from './mapElements/index';
export * as Data from './data/index';

export default Editor;
