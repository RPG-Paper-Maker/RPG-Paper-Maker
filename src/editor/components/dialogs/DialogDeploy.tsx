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
import { useDispatch } from 'react-redux';
import { Constants, INPUT_TYPE_WIDTH, IO, OS_KIND, Paths } from '../../common';
import {
	checkFileExists,
	copyFolder,
	copyPublicFile,
	copyPublicFolder,
	createFile,
	createFolder,
	exportFolder,
	getFolders,
	removeFile,
	removeFolder,
	writeJSON,
} from '../../common/Platform';
import { LocalFile } from '../../core/LocalFile';
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
		dispatch(setLoadingBar({ percent: 0, label: 'Copy dependencies...' }));
		const path = getPathProject();
		const os = Constants.IS_DESKTOP ? await IO.getOS() : OS_KIND.WEB;
		await createFolder(path);
		const localAppPath =
			exportType === EXPORT_TYPE.APPLICATION
				? os === OS_KIND.DARWIN
					? Paths.join('Game.app', 'Contents', Paths.RESOURCES_DARWIN, Paths.APP)
					: Paths.join(Paths.RESOURCES, Paths.APP)
				: null;
		const appPath = localAppPath === null ? path : Paths.join(path, localAppPath);
		await copyDependencies(path, appPath, localAppPath, os);
		dispatch(setLoadingBar({ percent: 20, label: 'Copy project...' }));
		await copyAllProject(appPath);
		dispatch(setLoadingBar({ percent: 40, label: 'Copying BR...' }));
		await copyBRDLC(appPath);
		dispatch(setLoadingBar({ percent: 80, label: 'Removing useless content...' }));
		await removeUselessContent(appPath);
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

	const copyDependencies = async (path: string, appPath: string, localAppPath: string | null, os: OS_KIND) => {
		if (exportType === EXPORT_TYPE.APPLICATION) {
			const enginePath = await IO.getEngineFolder();
			await IO.copyAndExclude(enginePath, path, Paths.join(enginePath, localAppPath!));
			let extension = '';
			switch (os) {
				case OS_KIND.WIN32:
					extension = '.exe';
					break;
				case OS_KIND.DARWIN:
					extension = '.app';
					break;
				default:
					break;
			}
			await IO.renameFile(path, `RPG Paper Maker${extension}`, `Game${extension}`);
			await IO.createFolder(appPath);
			await copyPublicDeploy(appPath, 'main.js');
			await copyPublicDeploy(appPath, 'preload.js');
			await copyPublicDeploy(appPath, 'package.json');
		}
		await copyPublicDeploy(appPath, 'index.html');
	};

	const copyPublicDeploy = async (appPath: string, fileName: string) => {
		await copyPublicFile(Paths.join(Paths.DEPLOY, fileName), Paths.join(appPath, fileName));
	};

	const copyAllProject = async (path: string) => {
		await copyFolder(Project.current!.getPath(), Paths.join(path, Paths.BUILD));
		await copyPublicFolder([Paths.SCRIPTS], Paths.join(path, Paths.BUILD, Paths.SCRIPTS));
		await createFile(
			Paths.join(path, Paths.BUILD, Paths.STYLES, Paths.FILE_FONTS_CSS),
			await Project.current!.systems.getStyleCSS(true),
		);
		if (exportType === EXPORT_TYPE.APPLICATION) {
			await copyPublicFile(
				Paths.join(Paths.DEPLOY, 'Platform.js'),
				Paths.join(path, Paths.BUILD, Paths.SCRIPTS, 'Common', 'Platform.js'),
			);
		}
		if (protectData) {
			await IO.createFile(Paths.join(path, '.protect'), '');
		}
	};

	const removeUselessContent = async (path: string) => {
		await removeFile(Paths.join(path, Paths.BUILD, Paths.FILE_TREE_MAPS));
		await removeFile(Paths.join(path, Paths.BUILD, Paths.FILE_GAME_RPMG));
		await removeFile(Paths.join(path, Paths.BUILD, Paths.FILE_FONTS));
		await removeFolder(Paths.join(path, Paths.BUILD, Paths.BACKUPS));
		await removeFolder(Paths.join(path, Paths.BUILD, Paths.TEST));
		await removeFolder(Paths.join(path, Paths.BUILD, Paths.SAVES));
		await createFolder(Paths.join(path, Paths.BUILD, Paths.SAVES));
		await removeFolder(Paths.join(path, Paths.BUILD, Paths.MAPS, Paths.TEMP));
		const maps = await getFolders(Paths.join(path, Paths.BUILD, Paths.MAPS));
		for (const mapFolder of maps) {
			await removeFolder(Paths.join(path, Paths.BUILD, Paths.MAPS, mapFolder, Paths.TEMP));
			await removeFolder(Paths.join(path, Paths.BUILD, Paths.MAPS, mapFolder, Paths.TEMP_UNDO_REDO));
		}
		if (protectData) {
			await removeFolder(Paths.join(path, Paths.BUILD, Paths.PICTURES));
			await removeFolder(Paths.join(path, Paths.BUILD, Paths.SONGS));
			await removeFolder(Paths.join(path, Paths.BUILD, Paths.SHAPES));
		}
	};

	const copyBRDLC = async (path: string) => {
		const promises: Promise<void>[] = [];
		const pictures = Project.current!.pictures.clone();
		await copyBRDLCKind(path, pictures.list, promises, pictures, Paths.FILE_PICTURES, true);
		const songs = Project.current!.songs.clone();
		await copyBRDLCKind(path, songs.list, promises, songs, Paths.FILE_SONGS, true);
		const shapes = Project.current!.shapes.clone();
		await copyBRDLCKind(path, shapes.list, promises, shapes, Paths.FILE_SHAPES, false);
		const videos = Project.current!.videos.clone();
		await copyBRDLCKind(path, new Map([[0, videos.list]]), promises, videos, Paths.FILE_VIDEOS, true, false);
		const fonts = Project.current!.fonts.clone();
		await copyBRDLCKind(path, new Map([[0, fonts.list]]), promises, fonts, Paths.FILE_FONTS, true, false);
		await Promise.all(promises);
	};

	const copyBRDLCKind = async (
		path: string,
		assets: Map<number, Asset[]>,
		promises: Promise<void>[],
		data: Serializable,
		fileName: string,
		isBlob: boolean,
		shouldProtect = true,
	) => {
		for (const list of assets.values()) {
			for (const asset of list) {
				if (protectData && shouldProtect) {
					asset.base64 = (await IO.readFile(asset.getPath(), false, true)) ?? '';
				} else {
					if ((asset.isBR || !!asset.dlc) && asset.id >= 1) {
						promises.push(
							Constants.IS_DESKTOP
								? IO.copyFile(asset.getPath(), Paths.join(path, Paths.BUILD, asset.getPath(true)))
								: LocalFile.copyPublicFile(
										asset.getPath(),
										Paths.join(path, Paths.BUILD, asset.getPath(true)),
										isBlob,
									)
										.then(() => {
											dispatch(
												setLoadingBar({ percent: 30, label: `Copying BR (${asset.getPath()}` }),
											);
										})
										.catch(console.error),
						);
						asset.isBR = false;
						asset.dlc = '';
					}
				}
			}
		}
		const json = {};
		data.write(json);
		promises.push(writeJSON(Paths.join(path, Paths.BUILD, fileName), json));
	};

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
									<Flex column spacedLarge>
										<RadioButton value={EXPORT_TYPE.APPLICATION}>{t('deploy.desktop')}</RadioButton>
										<Flex>
											<Flex fillSmallSpace />{' '}
											<Checkbox
												isChecked={protectData}
												onChange={setProtectData}
												disabled={exportType !== EXPORT_TYPE.APPLICATION}
											>
												{t('protect.data')}
											</Checkbox>
										</Flex>
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
