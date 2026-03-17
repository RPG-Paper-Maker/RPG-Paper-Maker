/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineWifiOff } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import {
	Constants,
	INPUT_TYPE_WIDTH,
	IO,
	JSONType,
	Paths,
	PLUGIN_TYPE_KIND,
	PluginsManifestType,
	Utils,
} from '../../../common';
import {
	createFile,
	createFolder,
	loadZip,
	readFile,
	readJSON,
	readOnlineFile,
	readOnlineFileArrayBuffer,
} from '../../../common/Platform';

import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import { showWarning } from '../../../store';
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

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogPlugin({ setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const plugin = model as Model.Plugin;

	const { t } = useTranslation();

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [type, setType] = useStateNumber();
	const [name, setName] = useStateString();
	const [importFile, setImportFile] = useState<File>();
	const [importFolder, setImportFolder] = useState<string>();
	const [plugins, setPlugins] = useState<Node[]>([]);
	const [loadingPlugins, setLoadingPlugins] = useState(true);
	const [allPluginsJSON, setAllPluginsJSON] = useState<JSONType[][]>([]);
	const [loadingPlugin, setLoadingPlugin] = useState(false);
	const [selectedPlugin, setSelectedPlugin] = useState<Model.Plugin | null>(null);
	const [connexionIssue, setConnexionIssue] = useState(false);

	const dispatch = useDispatch();

	const pluginOnlineDisabled = useMemo(
		() => connexionIssue || loadingPlugin || loadingPlugins || type !== PLUGIN_TYPE_KIND.ONLINE,
		[connexionIssue, loadingPlugin, loadingPlugins, type],
	);

	const initialize = () => {
		setType(PLUGIN_TYPE_KIND.EMPTY);
		setName('');
		setImportFile(undefined);
		setImportFolder(undefined);
		setSelectedPlugin(null);
		setConnexionIssue(false);
		setLoadingPlugins(true);
		loadOnlinePlugins().catch(console.error);
	};

	const handleChangeName = (name: string) => {
		setName(Utils.sanitizeFilename(name));
	};

	const handleClickImport = async () => {
		if (Constants.IS_DESKTOP) {
			setImportFolder(await IO.openFolderDialog());
		} else {
			importFileInputRef.current?.click();
		}
	};

	const handleImportFileChange = async () => {
		if (!importFileInputRef.current) {
			return;
		}
		setImportFile(Array.from(importFileInputRef.current.files || [])[0]);
		importFileInputRef.current.value = '';
	};

	const loadOnlinePlugins = async () => {
		const manifest = await Model.Plugin.getManifest();
		if (manifest) {
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
				const file = await readOnlineFile(
					Model.Plugin.getGitURL(Paths.join(plugin.name, Paths.FILE_PLUGIN_DETAILS)),
				);
				if (file) {
					const json: JSONType = JSON.parse(file);
					plugin.readDetails(json);
					plugin.parameters.forEach((parameter, index) => {
						parameter.defaultParameter = plugin.defaultParameters[index];
					});
					const picture = await readOnlineFileArrayBuffer(
						Model.Plugin.getGitURL(Paths.join(plugin.name, Paths.FILE_PLUGIN_PICTURE)),
					);
					if (picture) {
						plugin.pictureBase64 = `data:image/png;base64,${Utils.uint8ArrayToBase64(
							new Uint8Array(picture),
						)}`;
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
					false,
				),
			);
		}
	};

	const handleAccept = async () => {
		switch (type) {
			case PLUGIN_TYPE_KIND.EMPTY: {
				if (name.length === 0) {
					dispatch(showWarning(t('plugin.name.cannot.be.empty')));
					return;
				}
				if (Project.current!.scripts.plugins.some((plugin) => plugin.name === name)) {
					dispatch(showWarning(t('plugin.name.already.exists')));
					return;
				}
				setIsLoading(true);
				plugin.name = name;
				plugin.type = type;
				const pluginFolder = Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, name);
				if (isNew) {
					await createFolder(pluginFolder);
					plugin.code = `const pluginName = "${plugin.name}";
const inject = Manager.Plugins.inject;

// Start code here`;
					await createFile(Paths.join(pluginFolder, Paths.FILE_PLUGIN_CODE), plugin.code);
					const json = {};
					plugin.write(json);
					await createFile(Paths.join(pluginFolder, Paths.FILE_PLUGIN_DETAILS), JSON.stringify(json));
				}
				const json = {};
				plugin.write(json);
				await createFile(Paths.join(pluginFolder, Paths.FILE_PLUGIN_DETAILS), JSON.stringify(json));
				setIsLoading(false);
				break;
			}
			case PLUGIN_TYPE_KIND.LOCAL: {
				if ((Constants.IS_DESKTOP && !importFolder) || (!Constants.IS_DESKTOP && !importFile)) {
					dispatch(showWarning(t('you.need.select.plugin.import')));
					return;
				}
				const folderName = Constants.IS_DESKTOP
					? Paths.getFileName(importFolder!)
					: importFile!.name.substring(0, importFile!.name.length - 4);
				if (Project.current!.scripts.plugins.some((plugin) => plugin.name === folderName)) {
					dispatch(showWarning(t('plugin.name.already.exists')));
					return;
				}
				setIsLoading(true);
				const path = Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, folderName);
				if (Constants.IS_DESKTOP) {
					await IO.createFolder(path);
					await IO.copyFolder(importFolder!, path);
				} else {
					await loadZip(importFile!, path);
				}
				plugin.code = (await readFile(Paths.join(path, Paths.FILE_PLUGIN_CODE))) ?? '';
				plugin.type = type;
				const json = await readJSON(Paths.join(path, Paths.FILE_PLUGIN_DETAILS));
				if (json) {
					plugin.readDetails(json);
				}
				setIsLoading(false);
				break;
			}
			case PLUGIN_TYPE_KIND.ONLINE: {
				if (selectedPlugin) {
					if (Project.current!.scripts.plugins.some((plugin) => plugin.name === selectedPlugin.name)) {
						dispatch(showWarning(t('plugin.name.already.exists')));
						return;
					}
					setIsLoading(true);
					const id = plugin.id;
					plugin.copy(selectedPlugin);
					plugin.id = id;
					plugin.type = type;
					plugin.code =
						(await readOnlineFile(
							Model.Plugin.getGitURL(Paths.join(plugin.name, Paths.FILE_PLUGIN_CODE)),
						)) ?? '';
					plugin.pictureBase64 = selectedPlugin.pictureBase64;
					plugin.checked = true;
					const pluginManifest = allPluginsJSON[plugin.category].find((p) => p.name === plugin.name);
					if (pluginManifest) {
						await Model.Plugin.copyOnlineFolder(
							'',
							plugin.name,
							pluginManifest as PluginsManifestType,
							true,
						);
					}
					setIsLoading(false);
					break;
				} else {
					dispatch(showWarning(t('you.need.select.plugin.import')));
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
	}, [loadingPlugins]);

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('set.plugin')}...`}
			isOpen
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
							<RadioButton value={PLUGIN_TYPE_KIND.LOCAL}>{t('import.from.local.plugin')}</RadioButton>
						</Label>
						<Value>
							<Flex spaced centerV>
								<Button disabled={type !== PLUGIN_TYPE_KIND.LOCAL} onClick={handleClickImport}>
									...
								</Button>
								<Flex disabledLabel={type !== PLUGIN_TYPE_KIND.LOCAL} className='textSmallDetail'>
									{importFile?.name ?? importFolder ?? t('no.plugin.selected')}
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
							<Flex columnMobile spacedLarge fillWidth fillHeight centerH={loadingPlugins}>
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
										<PanelPluginDetails plugin={selectedPlugin} disabled={pluginOnlineDisabled} />
									</>
								)}
							</Flex>
						</>
					)}
				</Flex>
			</RadioGroup>
		</Dialog>
	);
}

export default DialogPlugin;
