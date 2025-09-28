/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JSONType, Paths } from '../../common';
import { getFiles, getFolders, readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';
import { EngineSettings } from '../../data';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogDebugOptions({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);
	const [isShowBB, setIsShowBB] = useState(Project.current!.systems.showBB);
	const [isShowFPS, setIsShowFPS] = useState(Project.current!.systems.showFPS);
	const [isBackupsActivated, setIsBackupsActivated] = useState(EngineSettings.current!.backupsActivated);
	const [backupsInterval, setIsBackupsInterval] = useState(EngineSettings.current!.backupsInterval);
	const [backupsMax, setBackupsMax] = useState(EngineSettings.current!.backupsMax);

	const handleClickSynchronizeMapObjects = async () => {
		const maps = await getFolders(Project.current!.getPathMaps());
		for (const mapName of maps) {
			const basePath = Paths.join(Project.current!.getPathMaps(), mapName);
			const mapProperties = (await readJSON(Paths.join(basePath, Paths.FILE_MAP_INFOS))) as JSONType;
			const allObjects: JSONType[] = [];
			mapProperties.objs = allObjects;
			const allPortions = await getFiles(Paths.join(basePath));
			for (const portionFileName of allPortions) {
				if (portionFileName !== Paths.FILE_MAP_INFOS) {
					const objs = (await readJSON(Paths.join(basePath, portionFileName)))?.objs as JSONType[];
					if (objs) {
						allObjects.push(
							...objs.map((obj) => ({
								id: (obj.v as JSONType).id,
								name: (obj.v as JSONType).name,
								p: obj.k,
							})),
						);
					}
				}
			}
			await writeJSON(Paths.join(basePath, Paths.FILE_MAP_INFOS), mapProperties);
		}
	};

	const handleAccept = async () => {
		setIsLoading(true);
		Project.current!.systems.showBB = isShowBB;
		Project.current!.systems.showFPS = isShowFPS;
		await Project.current!.systems.save();
		EngineSettings.current!.backupsActivated = isBackupsActivated;
		EngineSettings.current!.backupsInterval = backupsInterval;
		EngineSettings.current!.backupsMax = backupsMax;
		await EngineSettings.current!.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	return (
		<>
			<Dialog
				isOpen
				title={`${t('debug.options')}...`}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				isLoading={isLoading}
			>
				<Flex column spacedLarge fillWidth fillHeight>
					<Checkbox isChecked={isShowBB} onChange={setIsShowBB}>
						{t('show.collisions.bb')}
					</Checkbox>
					<Checkbox isChecked={isShowFPS} onChange={setIsShowFPS}>
						{t('show.fps')}
					</Checkbox>
					<Groupbox title={t('backups')}>
						<Flex column spacedLarge>
							<Checkbox isChecked={isBackupsActivated} onChange={setIsBackupsActivated}>
								{t('activated')}
							</Checkbox>
							<Form>
								<Label>{t('interval')}</Label>
								<Value>
									<Flex spaced>
										<InputNumber value={backupsInterval} onChange={setIsBackupsInterval} />
										{t('minute.s')}
									</Flex>
								</Value>
								<Label>{t('max')}</Label>
								<Value>
									<InputNumber value={backupsMax} onChange={setBackupsMax} />
								</Value>
							</Form>
							<Button
								onClick={handleClickSynchronizeMapObjects}
								disabled={!Project.current!.treeMaps.isAllMapsSaved()}
							>
								{t('synchronize.map.objects')}
							</Button>
						</Flex>
					</Groupbox>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogDebugOptions;
