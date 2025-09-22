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
import { useDispatch } from 'react-redux';
import { Constants, INPUT_TYPE_WIDTH, IO, Paths } from '../../common';
import {
	checkFileExists,
	copyFolder,
	copyPublicFile,
	copyPublicFolder,
	createFile,
	createFolder,
	exportFolder,
	removeFolder,
	writeJSON,
} from '../../common/Platform';
import { Project } from '../../core/Project';
import { Serializable } from '../../core/Serializable';
import { Asset } from '../../models';
import { setLoading, setLoadingBar } from '../../store';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import InputNumber from '../InputNumber';
import InputText from '../InputText';
import RadioButton from '../RadioButton';
import RadioGroup from '../RadioGroup';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterNoYes from './footers/FooterNoYes';

enum EXPORT_TYPE {
	APPLICATION,
	WEB,
}

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogDeploy({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const [isWarningLocationOpen, setIsWarningLocationOpen] = useState(false);
	const [location, setLocation] = useState(Paths.getRPMGamesFolder());
	const [exportType, setExportType] = useState(Constants.IS_DESKTOP ? EXPORT_TYPE.APPLICATION : EXPORT_TYPE.WEB);
	const [major, setMajor] = useState(Project.current!.settings.lastMajorVersion);
	const [minor, setMinor] = useState(Project.current!.settings.lastMinorVersion);
	const [protectData, setProtectData] = useState(true);

	const dispatch = useDispatch();

	const getPathProject = () => {
		return Paths.join(
			location,
			`${Paths.getFileName(Project.current!.getPath())}-${exportType === EXPORT_TYPE.WEB ? 'BROWSER-' : ''}${major}.${minor}`,
		);
	};

	const deploy = async () => {
		dispatch(setLoading(true));
		dispatch(setLoadingBar({ percent: 0, label: 'Copy project...' }));
		const path = getPathProject();
		await copyAllProject(path);
		dispatch(setLoadingBar({ percent: 20, label: 'Copying BR...' }));
		await copyBRDLC(path);
		if (exportType === EXPORT_TYPE.WEB) {
			dispatch(setLoadingBar({ percent: 80, label: 'Copying BR...' }));
			await createWeb(path);
		}
		dispatch(setLoadingBar({ percent: 100, label: 'Finished!' }));
		if (Constants.IS_DESKTOP) {
			await IO.openFolder(path);
		} else {
			await exportFolder(path);
		}
		dispatch(setLoading(false));
		dispatch(setLoadingBar(null));
		setIsOpen(false);
	};

	const copyAllProject = async (path: string) => {
		await createFolder(path);
		await copyFolder(Project.current!.getPath(), Paths.join(path, Paths.BUILD));
		await copyPublicFile(Paths.join(Paths.DEPLOY, 'index.html'), Paths.join(path, 'index.html'));
		await copyPublicFolder([Paths.SCRIPTS], Paths.join(path, Paths.BUILD, Paths.SCRIPTS));
		await createFile(
			Paths.join(path, Paths.BUILD, Paths.STYLES, Paths.FILE_FONTS_CSS),
			await Project.current!.systems.getStyleCSS(true),
		);
	};

	const copyBRDLC = async (path: string) => {
		const promises: Promise<void>[] = [];
		const pictures = Project.current!.pictures.clone();
		copyBRDLCKind(path, pictures.list, promises, pictures, Paths.FILE_PICTURES, true);
		const songs = Project.current!.songs.clone();
		copyBRDLCKind(path, songs.list, promises, songs, Paths.FILE_SONGS, true);
		const shapes = Project.current!.shapes.clone();
		copyBRDLCKind(path, shapes.list, promises, shapes, Paths.FILE_SHAPES, false);
		const videos = Project.current!.videos.clone();
		copyBRDLCKind(path, new Map([[0, videos.list]]), promises, videos, Paths.FILE_VIDEOS, true);
		const fonts = Project.current!.fonts.clone();
		copyBRDLCKind(path, new Map([[0, fonts.list]]), promises, fonts, Paths.FILE_FONTS, true);
		const start = 20;
		const end = 80;
		const step = (end - start) / promises.length;
		let completed = 0;
		promises.forEach((p) =>
			p
				.then((result) => {
					completed++;
					const percent = Math.floor(start + completed * step);
					dispatch(setLoadingBar({ percent, label: `Copying BR... (${completed}/${promises.length})` }));
					return result;
				})
				.catch(console.error),
		);
		await Promise.all(promises);
	};

	const copyBRDLCKind = (
		path: string,
		assets: Map<number, Asset[]>,
		promises: Promise<void>[],
		data: Serializable,
		fileName: string,
		isBlob: boolean,
	) => {
		for (const list of assets.values()) {
			for (const asset of list) {
				if ((asset.isBR || !!asset.dlc) && asset.id >= 1) {
					promises.push(
						copyPublicFile(asset.getPath(), Paths.join(path, Paths.BUILD, asset.getPath(true)), isBlob),
					);
					asset.isBR = false;
					asset.dlc = '';
				}
			}
		}
		const json = {};
		data.write(json);
		promises.push(writeJSON(Paths.join(path, Paths.BUILD, fileName), json));
	};

	const createWeb = async (path: string) => {};

	const handleClickChangeLocation = async () => {
		const newLocation = await IO.openFolderDialog(location);
		if (newLocation) {
			setLocation(newLocation);
		}
	};

	const handleWarningLocationNo = () => {
		setIsWarningLocationOpen(false);
	};

	const handleWarningLocationYes = async () => {
		setIsWarningLocationOpen(false);
		await removeFolder(getPathProject());
		await deploy();
	};

	const handleAccept = async () => {
		if (await checkFileExists(getPathProject())) {
			setIsWarningLocationOpen(true);
			return;
		}
		await deploy();
		Project.current!.settings.lastMajorVersion = major;
		Project.current!.settings.lastMinorVersion = minor;
		await Project.current!.settings.save();
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	// TODO
	// modifier font.css

	return (
		<>
			<Dialog
				isOpen
				title={`${t('deploy')}...`}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<Flex column spacedLarge fillWidth fillHeight>
					{Constants.IS_DESKTOP && (
						<Flex spaced centerV>
							<div>{t('location')}:</div>
							<InputText value={location} onChange={setLocation} widthType={INPUT_TYPE_WIDTH.FILL} />
							<Button onClick={handleClickChangeLocation}>...</Button>
						</Flex>
					)}
					<Groupbox title={t('type.export')}>
						<RadioGroup selected={exportType} onChange={setExportType}>
							<Flex column spacedLarge>
								{Constants.IS_DESKTOP && (
									<Flex spaced>
										<RadioButton value={EXPORT_TYPE.APPLICATION}>
											{t('desploy.desktop')}
										</RadioButton>
										<Checkbox isChecked={protectData} onChange={setProtectData}>
											{t('protect.data')}
										</Checkbox>
									</Flex>
								)}
								<RadioButton value={EXPORT_TYPE.WEB}>{t('deploy.web')}</RadioButton>
							</Flex>
						</RadioGroup>
					</Groupbox>
					<Groupbox title={t('version')}>
						<Flex fillWidth spacedLarge>
							<Flex one spaced>
								<Flex column spaced>
									<div>{t('major')}:</div>
									<InputNumber value={major} onChange={setMajor} widthType={INPUT_TYPE_WIDTH.FILL} />
								</Flex>
							</Flex>
							<Flex one spaced>
								<Flex column spaced>
									<div>{t('minor')}:</div>
									<InputNumber value={minor} onChange={setMinor} widthType={INPUT_TYPE_WIDTH.FILL} />
								</Flex>
							</Flex>
						</Flex>
					</Groupbox>
				</Flex>
			</Dialog>
			<Dialog
				isOpen={isWarningLocationOpen}
				title={t('warning')}
				footer={<FooterNoYes onNo={handleWarningLocationNo} onYes={handleWarningLocationYes} />}
				onClose={handleWarningLocationNo}
			>
				{t('warning.project.exist.overwrite', { path: getPathProject() })}
			</Dialog>
		</>
	);
}

export default DialogDeploy;
