/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCopiedItems } from '../../store';
import Loader from '../Loader';
import PanelNoProject from './PanelNoProject';
import PanelProject from './PanelProject';
import Dialog from '../dialogs/Dialog';
import { Node } from '../../core';
import { useTranslation } from 'react-i18next';

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
		<div className='flex-one flex relative'>
			<Loader large isLoading={loading} />
			{currentProject === null ? <PanelNoProject /> : <PanelProject />}
			{needsReloadPageUpdate && (
				<Dialog title={t('warning.refresh.page.update.title')} isOpen>
					<p>{`${t('warning.refresh.page.update')}.`}</p>
				</Dialog>
			)}
			{needsReloadPageClearCache && (
				<Dialog title={t('warning')} isOpen>
					<p>{`${t('warning.refresh.page.cache.clearing')}.`}</p>
				</Dialog>
			)}
		</div>
	);
}

export default PanelMain;
