/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Node } from '../../core';
import { RootState, setCopiedItems } from '../../store';
import Dialog, { Z_INDEX_LEVEL } from '../dialogs/Dialog';
import Flex from '../Flex';
import Loader from '../Loader';
import PanelNoProject from './PanelNoProject';
import PanelProject from './PanelProject';

function PanelMain() {
	const { t } = useTranslation();

	const currentProject = useSelector((state: RootState) => state.projects.current);
	const loading = useSelector((state: RootState) => state.projects.loading);
	const needsReloadPageUpdate = useSelector((state: RootState) => state.triggers.needsReloadPageUpdate);
	const needsReloadPageClearCache = useSelector((state: RootState) => state.triggers.needsReloadPageClearCache);

	const dispatch = useDispatch();

	useEffect(() => {
		const handleFocus = async () => {
			dispatch(setCopiedItems(await Node.loadToPaste()));
		};
		handleFocus().catch(console.error);
		window.addEventListener('focus', handleFocus);
		return () => window.removeEventListener('focus', handleFocus);
	}, [dispatch]);

	return (
		<>
			<Flex one className='relative'>
				<Loader large isLoading={loading} />
				{currentProject === null ? <PanelNoProject /> : <PanelProject />}
			</Flex>
			<Dialog
				title={t('warning.refresh.page.update.title')}
				isOpen={needsReloadPageUpdate}
				zIndex={Z_INDEX_LEVEL.LAYER_TOP}
			>
				<p>{`${t('warning.refresh.page.update')}.`}</p>
			</Dialog>
			<Dialog title={t('warning')} isOpen={needsReloadPageClearCache} zIndex={Z_INDEX_LEVEL.LAYER_TOP}>
				<p>{`${t('warning.refresh.page.cache.clearing')}.`}</p>
			</Dialog>
		</>
	);
}

export default PanelMain;
