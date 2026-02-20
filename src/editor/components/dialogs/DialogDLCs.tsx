/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ArrayUtils, IO, Paths } from '../../common';
import { Project } from '../../core/Project';
import { Checkable } from '../../models';
import { setNeedsReloadMap } from '../../store';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogDLCs({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(true);
	const [dlcs, setDlcs] = useState<Checkable[]>([]);

	const dispatch = useDispatch();

	const updateDLCsList = async () => {
		const names = await IO.getFolders(Paths.join(Paths.DIST, Paths.DLCS));
		setDlcs(names.map((name) => Checkable.createCheckable(-1, name, Project.current!.dlcs.list.includes(name))));
		setIsLoading(false);
	};

	const handleClickImportDLC = async () => {
		const path = await IO.openFolderDialog();
		if (path) {
			setIsLoading(true);
			const folderName = Paths.getFileName(path);
			await IO.copyFolder(path, Paths.join(Paths.DIST, Paths.DLCS, folderName));
			await updateDLCsList();
		}
	};

	const handleChangeChecked = (name: string, b: boolean) => {
		ArrayUtils.removeElement(Project.current!.dlcs.list, name);
		if (b) {
			Project.current!.dlcs.list.push(name);
		}
		const dlc = dlcs.find((e) => e.name === name);
		if (dlc) {
			dlc.checked = b;
			setDlcs([...dlcs]);
		}
	};

	const handleAccept = async () => {
		setIsLoading(true);
		dispatch(setNeedsReloadMap());
		await Project.current!.dlcs.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsLoading(true);
		await Project.current!.dlcs.load();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		updateDLCsList().catch(console.error);
	}, []);

	const getDlcsContent = () => (
		<Flex column spaced>
			{dlcs.map((dlc) => (
				<Checkbox key={dlc.name} isChecked={dlc.checked} onChange={(b) => handleChangeChecked(dlc.name, b)}>
					{dlc.name}
				</Checkbox>
			))}
		</Flex>
	);

	return (
		<Dialog
			isOpen
			title={`${t('import.dlc.s')}...`}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			isLoading={isLoading}
			initialWidth='300px'
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Flex>
					<Flex one />
					<Button onClick={handleClickImportDLC}>{t('import.dlc.s')}...</Button>
					<Flex one />
				</Flex>
				{getDlcsContent()}
			</Flex>
		</Dialog>
	);
}

export default DialogDLCs;
