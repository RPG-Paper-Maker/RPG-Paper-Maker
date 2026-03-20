/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '../../core/Project';
import { EngineSettings } from '../../data';
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
	const [isBackupsIncludeAssets, setIsBackupsIncludeAssets] = useState(EngineSettings.current!.backupsIncludeAssets);

	const handleAccept = async () => {
		setIsLoading(true);
		Project.current!.systems.showBB = isShowBB;
		Project.current!.systems.showFPS = isShowFPS;
		await Project.current!.systems.save();
		EngineSettings.current!.backupsActivated = isBackupsActivated;
		EngineSettings.current!.backupsInterval = backupsInterval;
		EngineSettings.current!.backupsMax = backupsMax;
		EngineSettings.current!.backupsIncludeAssets = isBackupsIncludeAssets;
		await EngineSettings.current!.save();
		Project.current!.resetBackups();
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
					<Groupbox title='Backups'>
						<Flex column spacedLarge>
							<Checkbox isChecked={isBackupsActivated} onChange={setIsBackupsActivated}>
								{t('activated')}
							</Checkbox>
							<Checkbox
								isChecked={isBackupsIncludeAssets}
								onChange={setIsBackupsIncludeAssets}
								disabled={!isBackupsActivated}
							>
								{t('include.assets.images.shapes.songs.videos.fonts')}
							</Checkbox>
							<Form>
								<Label disabled={!isBackupsActivated}>{t('interval')}</Label>
								<Value disabled={!isBackupsActivated}>
									<Flex spaced centerV>
										<InputNumber
											value={backupsInterval}
											onChange={setIsBackupsInterval}
											disabled={!isBackupsActivated}
										/>
										{t('minute.s')}
									</Flex>
								</Value>
								<Label disabled={!isBackupsActivated}>{t('max')}</Label>
								<Value>
									<InputNumber
										value={backupsMax}
										onChange={setBackupsMax}
										disabled={!isBackupsActivated}
									/>
								</Value>
							</Form>
						</Flex>
					</Groupbox>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogDebugOptions;
