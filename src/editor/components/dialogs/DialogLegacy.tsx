/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @deprecated Move camera / screen tone legacy modes (pre-3.2.30 projects), to remove. */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CommandUsage, goToCommandUsage } from '../../data/CommandUsages';
import { findLegacyUsages, updateLegacyCount } from '../../data/Legacy';
import { setLegacyCount } from '../../store';
import DialogCommandUsages from './DialogCommandUsages';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogLegacy({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const [usages, setUsages] = useState<CommandUsage[] | null>(null);

	useEffect(() => {
		let cancelled = false;
		const search = async () => {
			const found = await findLegacyUsages();
			dispatch(setLegacyCount(await updateLegacyCount(found)));
			if (!cancelled) {
				setUsages(found);
			}
		};
		search().catch(console.error);
		return () => {
			cancelled = true;
		};
	}, []);

	const handleGoTo = (usage: CommandUsage) => {
		setIsOpen(false);
		goToCommandUsage(usage);
	};

	return (
		<DialogCommandUsages
			title={t('legacy.to.check')}
			usages={usages ?? []}
			emptyText={t('legacy.none')}
			isLoading={usages === null}
			onClose={() => setIsOpen(false)}
			onGoTo={handleGoTo}
			header={<div>{t('legacy.description')}</div>}
		/>
	);
}

export default DialogLegacy;
