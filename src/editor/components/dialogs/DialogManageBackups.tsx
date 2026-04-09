/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BUTTON_TYPE, Paths } from '../../common';
import { checkFileExists, copyFile, copyFolder, getFiles, getFolders } from '../../common/Platform';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { triggerOpenProject } from '../../store';
import { setLoading } from '../../store/slices/ProjectsReducer';
import '../../styles/DialogManageBackups.css';
import Button from '../Button';
import Flex from '../Flex';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterNoYes from './footers/FooterNoYes';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	project?: Model.ProjectPreview;
	onAfterRestore?: () => void;
};

function DialogManageBackups({ isOpen, setIsOpen, project, onAfterRestore }: Props) {
	const projectLocation = project?.location ?? Project.current?.location ?? '';
	const projectName = project?.name ?? Project.current?.systems.projectName.getName() ?? '';
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const [backups, setBackups] = useState<string[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			void loadBackups();
		}
	}, [isOpen]);

	const loadBackups = async () => {
		const backupsPath = Paths.join(projectLocation, Paths.BACKUPS);
		if (!(await checkFileExists(backupsPath))) {
			setBackups([]);
			return;
		}
		const folders = await getFolders(backupsPath);
		folders.sort().reverse();
		setBackups(folders);
		setSelected(folders[0] ?? null);
	};

	const handleClose = () => {
		setIsOpen(false);
		setSelected(null);
	};

	const handleRestore = () => {
		setIsConfirmOpen(true);
	};

	const handleRejectRestore = () => {
		setIsConfirmOpen(false);
	};

	const handleConfirmRestore = async () => {
		setIsConfirmOpen(false);
		setIsOpen(false);
		dispatch(setLoading(true));
		const backupPath = Paths.join(projectLocation, Paths.BACKUPS, selected!);
		const folders = await getFolders(backupPath);
		const files = await getFiles(backupPath);
		for (const folder of folders) {
			await copyFolder(Paths.join(backupPath, folder), Paths.join(projectLocation, folder));
		}
		for (const file of files) {
			await copyFile(Paths.join(backupPath, file), Paths.join(projectLocation, file));
		}
		dispatch(setLoading(false));
		onAfterRestore?.();
		const projectPreview = project ?? Model.ProjectPreview.create(projectName, projectLocation);
		dispatch(triggerOpenProject(projectPreview));
	};

	const footer = (
		<Flex centerV spaced>
			<Flex one />
			<Button onClick={handleClose}>{t('cancel')}</Button>
			<Button buttonType={BUTTON_TYPE.PRIMARY} disabled={!selected} onClick={handleRestore}>
				{t('restore')}
			</Button>
		</Flex>
	);

	return (
		<>
			<Dialog
				title={t('manage.backups')}
				isOpen={isOpen}
				onClose={handleClose}
				footer={footer}
				initialWidth='400px'
				initialHeight='250px'
				zIndex={Z_INDEX_LEVEL.LAYER_TOP}
			>
				{backups.length === 0 ? (
					<div className='textCenter'>{t('no.backups.available')}</div>
				) : (
					<div className='backupList'>
						{backups.map((b, i) => {
							const dashIndex = b.indexOf('-', 8); // skip YYYY-MM-DD, split at the next dash
							const date = dashIndex !== -1 ? b.slice(0, dashIndex) : b;
							const time = dashIndex !== -1 ? b.slice(dashIndex + 1) : '';
							return (
								<div
									key={b}
									className={`backupItem${selected === b ? ' selected' : ''}`}
									onClick={() => setSelected(b)}
								>
									<span>{date}</span>
									{i === 0 && <span className='backupLastSaveBadge'>{t('last.save')}</span>}
									<span>{time}</span>
								</div>
							);
						})}
					</div>
				)}
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isConfirmOpen}
				footer={<FooterNoYes onNo={handleRejectRestore} onYes={handleConfirmRestore} />}
				onClose={handleRejectRestore}
				zIndex={Z_INDEX_LEVEL.LAYER_TOP}
			>
				<div className='warning textCenter'>
					{t('warning.restore.backup', { backupName: selected, projectName })}
				</div>
			</Dialog>
		</>
	);
}

export default DialogManageBackups;
