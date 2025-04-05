/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineWifiOff } from 'react-icons/md';
import { INPUT_TYPE_WIDTH, JSONType, Paths, PLUGIN_TYPE_KIND, Utils } from '../../../common';
import { Platform } from '../../../common/Platform';
import { Node, Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Button from '../../Button';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputText from '../../InputText';
import Loader from '../../Loader';
import PanelPluginDetails from '../../panels/plugins/PanelPluginDetails';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Tab from '../../Tab';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import FooterOK from '../footers/FooterOK';

const BASE_GIT_URL = 'https://raw.githubusercontent.com/RPG-Paper-Maker/RPG-Paper-Maker/refs/heads/web-3.0.0/plugins';

const getGitURL = (path: string) => Paths.join(BASE_GIT_URL, path.replaceAll(' ', '%20'));

type ManifestType = {
	name: string;
	files?: string[];
	folders?: ManifestType[];
};

const copyFolder = async (path: string, pluginName: string, folder: ManifestType) => {
	path = Paths.join(path, folder.name);
	const projectPath = Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, path);
	await Platform.createFolder(projectPath);
	if (folder.files) {
		for (const file of folder.files) {
			const ext = file.split('.').pop()?.toLowerCase();
			let content = '';
			const mimeType = Platform.MIME_TYPES[ext || ''];
			if (mimeType) {
				const binaryData = await Platform.readOnlineFileUint8Array(getGitURL(Paths.join(path, file)));
				if (binaryData) {
					content = `data:${mimeType};base64,${Utils.uint8ArrayToBase64(binaryData)}`;
				}
			} else {
				content = (await Platform.readOnlineFile(getGitURL(Paths.join(path, file)))) ?? '';
			}
			await Platform.createFile(Paths.join(projectPath, file), content);
		}
	}
	if (folder.folders) {
		for (const f of folder.folders) {
			await copyFolder(path, pluginName, f);
		}
	}
};

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogPlugin({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const plugin = model as Model.Plugin;

	const { t } = useTranslation();

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [warning, setWarning] = useStateString();
	const [type, setType] = useStateNumber();
	const [name, setName] = useStateString();
	const [importFile, setImportFile] = useState<File>();
	const [plugins, setPlugins] = useState<Node[]>([]);
	const [loadingPlugins, setLoadingPlugins] = useState(true);
	const [allPluginsJSON, setAllPluginsJSON] = useState<JSONType[][]>([]);
	const [loadingPlugin, setLoadingPlugin] = useState(false);
	const [selectedPlugin, setSelectedPlugin] = useState<Model.Plugin | null>(null);
	const [connexionIssue, setConnexionIssue] = useState(false);

	const pluginOnlineDisabled = useMemo(
		() => connexionIssue || loadingPlugin || loadingPlugins || type !== PLUGIN_TYPE_KIND.ONLINE,
		[connexionIssue, loadingPlugin, loadingPlugins, type]
	);

	const initialize = () => {
		setType(PLUGIN_TYPE_KIND.EMPTY);
		setName('');
		setImportFile(undefined);
		setSelectedPlugin(null);
		setConnexionIssue(false);
		setLoadingPlugins(true);
		loadOnlinePlugins().catch(console.error);
	};

	const handleChangeName = (name: string) => {
		setName(Utils.sanitizeFilename(name));
	};

	const handleClickImport = () => {
		importFileInputRef.current?.click();
	};

	const handleImportFileChange = async () => {
		if (!importFileInputRef.current) {
			return;
		}
		setImportFile(Array.from(importFileInputRef.current.files || [])[0]);
		importFileInputRef.current.value = '';
	};

	const loadOnlinePlugins = async () => {
		const file = await Platform.readOnlineFile(`${BASE_GIT_URL}/manifest.json`);
		if (file) {
			const manifest: JSONType[][] = JSON.parse(file);
			setAllPluginsJSON(manifest);
			setLoadingPlugins(false);
		} else {
			setConnexionIssue(true);
			setType(0);
			setSelectedPlugin(null);
		}
	};

	const handleClickRefresh = async () => {
		setLoadingPlugins(true);
		await loadOnlinePlugins();
	};

	const handleSelectPlugin = async (node: Node | null) => {
		if (node && node.content.id > -1) {
			const plugin = node.content as Model.Plugin;
			if (plugin.description === undefined) {
				setSelectedPlugin(null);
				setLoadingPlugin(true);
				const file = await Platform.readOnlineFile(
					getGitURL(Paths.join(plugin.name, Paths.FILE_PLUGIN_DETAILS))
				);
				if (file) {
					const json: JSONType = JSON.parse(file);
					plugin.readDetails(json);
					plugin.parameters.forEach((parameter, index) => {
						parameter.defaultParameter = plugin.defaultParameters[index];
					});
					const picture = await Platform.readOnlineFileUint8Array(
						getGitURL(Paths.join(plugin.name, Paths.FILE_PLUGIN_PICTURE))
					);
					if (picture) {
						plugin.pictureBase64 = `data:image/png;base64,${Utils.uint8ArrayToBase64(picture)}`;
					}
					setLoadingPlugin(false);
				} else {
					setConnexionIssue(true);
					setType(0);
					setSelectedPlugin(null);
					return;
				}
			}
			setSelectedPlugin(plugin);
		}
	};

	const handleOnlineTabChanged = (index: number) => {
		if (!loadingPlugins && allPluginsJSON.length > 0) {
			setPlugins(
				Node.createList(
					allPluginsJSON[index].map((json, index) => Model.Plugin.create(index, json.name as string)),
					false
				)
			);
		}
	};

	const handleCloseWarning = () => {
		setWarning('');
	};

	const handleAccept = async () => {
		switch (type) {
			case PLUGIN_TYPE_KIND.EMPTY: {
				if (name.length === 0) {
					setWarning(t('plugin.name.cannot.be.empty'));
					return;
				}
				if (Project.current!.scripts.plugins.some((plugin) => plugin.name === name)) {
					setWarning(t('plugin.name.already.exists'));
					return;
				}
				setIsLoading(true);
				plugin.name = name;
				const pluginFolder = Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, name);
				if (isNew) {
					await Platform.createFolder(pluginFolder);
					plugin.code = `const pluginName = "${plugin.name}";
const inject = Manager.Plugins.inject;

// Start code here`;
					await Platform.createFile(Paths.join(pluginFolder, Paths.FILE_PLUGIN_CODE), plugin.code);
					const json = {};
					plugin.write(json);
					await Platform.createFile(
						Paths.join(pluginFolder, Paths.FILE_PLUGIN_DETAILS),
						JSON.stringify(json)
					);
				}
				const json = {};
				plugin.write(json);
				await Platform.createFile(Paths.join(pluginFolder, Paths.FILE_PLUGIN_DETAILS), JSON.stringify(json));
				setIsLoading(false);
				break;
			}
			case PLUGIN_TYPE_KIND.LOCAL: {
				if (!importFile) {
					setWarning(t('you.need.select.plugin.import'));
					return;
				}
				const folderName = importFile.name.substring(0, importFile.name.length - 4);
				if (Project.current!.scripts.plugins.some((plugin) => plugin.name === folderName)) {
					setWarning(t('plugin.name.already.exists'));
					return;
				}
				setIsLoading(true);
				const path = Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, folderName);
				await Platform.loadZip(importFile, path);
				plugin.code = (await Platform.readFile(Paths.join(path, Paths.FILE_PLUGIN_CODE))) ?? '';
				const json = await Platform.readJSON(Paths.join(path, Paths.FILE_PLUGIN_DETAILS));
				if (json) {
					plugin.readDetails(json);
				}
				setIsLoading(false);
				break;
			}
			case PLUGIN_TYPE_KIND.ONLINE: {
				if (selectedPlugin) {
					setIsLoading(true);
					plugin.copy(selectedPlugin);
					plugin.code =
						(await Platform.readOnlineFile(getGitURL(Paths.join(plugin.name, Paths.FILE_PLUGIN_CODE)))) ??
						'';
					plugin.pictureBase64 = selectedPlugin.pictureBase64;
					plugin.checked = true;
					const pluginManifest = allPluginsJSON[plugin.category].find((p) => p.name === plugin.name);
					if (pluginManifest) {
						copyFolder('', plugin.name, pluginManifest as ManifestType);
					}
					setIsLoading(false);
					break;
				} else {
					setWarning(t('you.need.select.plugin.import'));
					return;
				}
			}
		}
		plugin.saved = false;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (!loadingPlugins) {
			handleOnlineTabChanged(0);
		}
		// eslint-disable-next-line
	}, [loadingPlugins]);

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<>
			<Dialog
				title={`${t('set.plugin')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				initialWidth='800px'
				initialHeight='600px'
				isLoading={isLoading}
			>
				<RadioGroup selected={type} onChange={setType}>
					<Flex column spacedLarge fillWidth>
						<Form>
							<Label>
								<RadioButton value={PLUGIN_TYPE_KIND.EMPTY}>{t('create.empty')}</RadioButton>
							</Label>
							<Value>
								<InputText
									value={name}
									onChange={handleChangeName}
									widthType={INPUT_TYPE_WIDTH.FILL}
									disabled={type !== PLUGIN_TYPE_KIND.EMPTY}
								/>
							</Value>
							<Label>
								<RadioButton value={PLUGIN_TYPE_KIND.LOCAL}>
									{t('import.from.local.plugin')}
								</RadioButton>
							</Label>
							<Value>
								<Flex spaced centerV>
									<Button disabled={type !== PLUGIN_TYPE_KIND.LOCAL} onClick={handleClickImport}>
										...
									</Button>
									<Flex disabledLabel={type !== PLUGIN_TYPE_KIND.LOCAL} className='textSmallDetail'>
										{importFile ? importFile.name : t('no.plugin.selected')}
									</Flex>
									<input
										ref={importFileInputRef}
										type='file'
										hidden
										onChange={handleImportFileChange}
										accept='.zip'
									/>
								</Flex>
							</Value>
						</Form>
						<div className='horizontalSeparator' />
						<RadioButton value={PLUGIN_TYPE_KIND.ONLINE} disabled={connexionIssue}>
							{t('add.from.online.plugins.list')}:
						</RadioButton>
						{connexionIssue ? (
							<Flex spaced fillWidth fillHeight centerH centerV>
								<MdOutlineWifiOff />
								{t('no.connexion')}
							</Flex>
						) : (
							<>
								<Tab
									titles={Model.Base.mapListIndex([t('battle'), t('menus'), t('map'), t('others')])}
									contents={[null, null, null, null]}
									disabled={pluginOnlineDisabled}
									onCurrentIndexChanged={handleOnlineTabChanged}
									padding
									scrollableContent
								/>
								<Flex spacedLarge fillWidth fillHeight centerH={loadingPlugins}>
									{loadingPlugins ? (
										<Loader isLoading alone />
									) : (
										<>
											<Flex column spacedLarge>
												<Flex fillHeight>
													<Tree
														list={plugins}
														minWidth={TREES_MIN_WIDTH}
														onSelectedItem={handleSelectPlugin}
														disabled={pluginOnlineDisabled}
														noScrollOnForce
														scrollable
														cannotAdd
														cannotDelete
														cannotDragDrop
														cannotEdit
														doNotShowID
														hideCheck
													/>
												</Flex>
												<Button disabled={pluginOnlineDisabled} onClick={handleClickRefresh}>
													{t('refresh')}
												</Button>
											</Flex>
											<PanelPluginDetails
												plugin={selectedPlugin}
												disabled={pluginOnlineDisabled}
											/>
										</>
									)}
								</Flex>
							</>
						)}
					</Flex>
				</RadioGroup>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={!!warning}
				footer={<FooterOK onOK={handleCloseWarning} />}
				onClose={handleCloseWarning}
			>
				<p>{warning}</p>
			</Dialog>
		</>
	);
}

export default DialogPlugin;
