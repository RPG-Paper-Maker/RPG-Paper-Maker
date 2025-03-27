/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH, Paths } from '../../common';
import { Platform } from '../../common/Platform';
import { LocalFile, Node, Project } from '../../core';
import { Model } from '../../Editor';
import useStateBool from '../../hooks/useStateBool';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputText from '../InputText';
import PanelPluginDetails from '../panels/plugins/PanelPluginDetails';
import Tab from '../Tab';
import TextArea from '../TextArea';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog from './Dialog';
import FooterCancelSaveClose from './footers/FooterCancelSaveClose';

const TREES_STYLE_HEIGHT = { height: '100px' };

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
};

function DialogPlugins({ isOpen, setIsOpen }: Props) {
	const { t } = useTranslation();

	const importPictureInputRef = useRef<HTMLInputElement>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [plugins, setPlugins] = useState<Node[]>([]);
	const [selectedPlugin, setSelectedPlugin] = useState<Model.Plugin | null>(null);
	const [code, setCode] = useStateString();
	const [triggerUpdate, setTriggerUpdate] = useStateBool();
	const [pictureBase64, setPictureBase64] = useStateString();
	const [name, setName] = useStateString();
	const [author, setAuthor] = useStateString();
	const [description, setDescription] = useStateString();
	const [version, setVersion] = useStateString();
	const [website, setWebsite] = useStateString();
	const [tutorial, setTutorial] = useStateString();
	const [category, setCategory] = useStateNumber();
	const [defaultParameters, setDefaultParameters] = useState<Node[]>([]);
	const [commands, setCommands] = useState<Node[]>([]);
	const [triggerUpdateParameters, setTriggerUpdateParameters] = useStateBool();

	const initialize = async () => {
		setIsLoading(true);
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
		await Platform.copyFolder(
			Paths.join(Project.current!.getPath(), Paths.PLUGINS),
			Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP)
		);
		setPlugins(Node.createList(Project.current!.scripts.plugins, false));
		setIsLoading(false);
	};

	const reset = () => {
		setPlugins([]);
		setSelectedPlugin(null);
		setCode('');
		setPictureBase64('');
	};

	const updateParametersDefaults = (plugin: Model.Plugin) => {
		plugin.parameters.forEach((parameter, index) => {
			parameter.defaultParameter = plugin.defaultParameters[index];
		});
	};

	const handleSelectPlugin = (node: Node | null) => {
		if (node) {
			const plugin = node.content as Model.Plugin;
			if (plugin.id !== -1 && plugin.code === undefined) {
				setIsLoading(true);
				(async () => {
					const path = Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, plugin.name);
					const code = (await Platform.readFile(Paths.join(path, Paths.FILE_PLUGIN_CODE))) ?? '';
					setCode(code);
					plugin.code = code;
					const json = await Platform.readJSON(Paths.join(path, Paths.FILE_PLUGIN_DETAILS));
					if (json) {
						plugin.readDetails(json);
					}
					setName(plugin.name);
					setAuthor(plugin.author);
					setDescription(plugin.description);
					setVersion(plugin.version);
					setWebsite(plugin.website);
					setTutorial(plugin.tutorial);
					setCategory(plugin.category);
					setDefaultParameters(Node.createList(plugin.defaultParameters));
					updateParametersDefaults(plugin);
					setCommands(Node.createList(plugin.commands));
					plugin.pictureBase64 =
						(await LocalFile.readFile(Paths.join(path, Paths.FILE_PLUGIN_PICTURE))) ?? '';
					setPictureBase64(plugin.pictureBase64);
					setSelectedPlugin(plugin);
					setIsLoading(false);
				})();
			} else {
				setCode(plugin.code ?? '');
				setSelectedPlugin(plugin);
			}
		}
	};

	const handleListUpdated = () => {
		Project.current!.scripts.plugins = Node.createListFromNodes(plugins);
	};

	const handleOnChangeCode = (v?: string) => {
		if (selectedPlugin && v !== undefined) {
			selectedPlugin.code = v;
			selectedPlugin.saved = false;
			setTriggerUpdate((b) => !b);
		}
	};

	const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
		/* TODO: Add declaration file for global classes, should not contain exports */
		const dts = `
		  declare class Constants {

}
		`;
		monaco.languages.typescript.javascriptDefaults.addExtraLib(dts, 'filename/constants.d.ts');
	};

	const unsavePlugin = () => {
		selectedPlugin!.saved = false;
		setTriggerUpdate((b) => !b);
	};

	const handleClickSelectPicture = () => {
		importPictureInputRef.current?.click();
	};

	const handleImportPictureChange = async () => {
		if (!importPictureInputRef.current) {
			return;
		}
		const file = Array.from(importPictureInputRef.current.files || [])[0];
		if (file) {
			setIsLoading(true);
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = async () => {
				selectedPlugin!.pictureBase64 = reader.result as string;
				setPictureBase64(selectedPlugin!.pictureBase64);
				await LocalFile.createFile(
					Paths.join(
						Project.current!.getPath(),
						Paths.PLUGINS_TEMP,
						selectedPlugin!.name,
						Paths.FILE_PLUGIN_PICTURE
					),
					selectedPlugin!.pictureBase64
				);
				unsavePlugin();
				setIsLoading(false);
			};
			reader.onerror = (error) => {
				console.error('Error converting file to Base64:', error);
			};
		}
	};

	const handleChangeName = (s: string) => {
		setName(s);
		selectedPlugin!.name = s;
		unsavePlugin();
	};

	const handleChangeAuthor = (s: string) => {
		setAuthor(s);
		selectedPlugin!.author = s;
		unsavePlugin();
	};

	const handleChangeDescription = (s: string) => {
		setDescription(s);
		selectedPlugin!.description = s;
		unsavePlugin();
	};

	const handleChangeVersion = (s: string) => {
		setVersion(s);
		selectedPlugin!.version = s;
		unsavePlugin();
	};

	const handleChangeWebsite = (s: string) => {
		setWebsite(s);
		selectedPlugin!.website = s;
		unsavePlugin();
	};

	const handleChangeTutorial = (s: string) => {
		setTutorial(s);
		selectedPlugin!.tutorial = s;
		unsavePlugin();
	};

	const handleChangeCategory = (id: number) => {
		setCategory(id);
		selectedPlugin!.category = id;
		unsavePlugin();
	};

	const handleDefaultParametersUpdated = () => {
		selectedPlugin!.defaultParameters = Node.createListFromNodes(defaultParameters);
		selectedPlugin!.parameters = selectedPlugin!.defaultParameters.map(
			(parameter) => parameter.clone() as Model.PluginParameter
		);
		setTriggerUpdateParameters((b) => !b);
		updateParametersDefaults(selectedPlugin!);
		unsavePlugin();
	};

	const handleCommandsUpdated = () => {
		selectedPlugin!.commands = Node.createListFromNodes(commands);
		unsavePlugin();
	};

	const handleCancel = async () => {
		setIsLoading(true);
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
		await Project.current!.scripts.load();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleSave = async () => {
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS));
		await Platform.copyFolder(
			Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP),
			Paths.join(Project.current!.getPath(), Paths.PLUGINS)
		);
		await Project.current!.scripts.save();
		Project.current!.scripts.plugins.forEach((plugin) => {
			plugin.saved = true;
		});
		setTriggerUpdate((b) => !b);
	};

	const handleSaveAndClose = async () => {
		setIsLoading(true);
		await handleSave();
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
		setIsLoading(false);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleSaveShortcut = async (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 's') {
				event.preventDefault();
				await handleSave();
			}
		};
		document.addEventListener('keydown', handleSaveShortcut);
		return () => {
			document.removeEventListener('keydown', handleSaveShortcut);
		};
		// eslint-disable-next-line
	}, []);

	useLayoutEffect(() => {
		if (isOpen) {
			initialize().catch(console.error);
		} else {
			reset();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getPluginsContent = () => (
		<Flex key={0} spacedLarge fillWidth fillHeight>
			<Flex fillHeight>
				<Tree
					constructorType={Model.Plugin}
					list={plugins}
					minWidth={TREES_MIN_WIDTH}
					onSelectedItem={handleSelectPlugin}
					onListUpdated={handleListUpdated}
					triggerUpdate={triggerUpdate}
					noScrollOnForce
					scrollable
					applyDefault
				/>
			</Flex>
			<Flex one>
				{selectedPlugin && selectedPlugin.id !== -1 ? (
					<Tab
						titles={Model.Base.mapListIndex([t('details'), t('code'), t('edit'), t('export')])}
						contents={[getPluginsDetailsContent(), getPluginsDetailsCode(), getPluginsDetailsEdit(), null]}
						padding
						scrollableContent
						lazyLoadingContent
						hideScroll
					/>
				) : (
					<Flex one centerV centerH>
						{t('select.or.double.click.list')}...
					</Flex>
				)}
			</Flex>
		</Flex>
	);

	const getPluginsDetailsContent = () => (
		<Flex key={0} column spacedLarge fillWidth fillHeight>
			<PanelPluginDetails plugin={selectedPlugin} triggerUpdateParameters={triggerUpdateParameters} />
		</Flex>
	);

	const getPluginsDetailsCode = () => (
		<Flex key={1} column spacedLarge fillWidth fillHeight>
			<Editor
				defaultLanguage='javascript'
				value={code}
				theme='vs-dark'
				onChange={handleOnChangeCode}
				onMount={handleEditorDidMount}
			/>
		</Flex>
	);

	const getPluginsDetailsEdit = () => {
		return (
			<Flex key={2} column spacedLarge fillWidth fillHeight>
				<Form>
					<Label>{t('picture')}</Label>
					<Value>
						<Flex column spacedLarge>
							{pictureBase64 && (
								<Flex centerH>
									<img src={pictureBase64} style={{ width: 'fit-content' }} alt='plugin' />
								</Flex>
							)}
							<Button onClick={handleClickSelectPicture}>{t('select')}...</Button>
							<input
								ref={importPictureInputRef}
								type='file'
								hidden
								onChange={handleImportPictureChange}
								accept='.png'
							/>
						</Flex>
					</Value>
					<Label>{t('name')}</Label>
					<Value>
						<InputText value={name} onChange={handleChangeName} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Value>
					<Label>{t('author')}</Label>
					<Value>
						<InputText value={author} onChange={handleChangeAuthor} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Value>
					<Label>{t('description')}</Label>
					<Value>
						<TextArea text={description} onChange={handleChangeDescription} />
					</Value>
					<Label>{t('version')}</Label>
					<Value>
						<InputText value={version} onChange={handleChangeVersion} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Value>
					<Label>{t('website')}</Label>
					<Value>
						<InputText value={website} onChange={handleChangeWebsite} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Value>
					<Label>{t('tutorial')}</Label>
					<Value>
						<InputText value={tutorial} onChange={handleChangeTutorial} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Value>
					<Label>{t('category')}</Label>
					<Value>
						<Dropdown
							selectedID={category}
							onChange={handleChangeCategory}
							options={Model.Base.PLUGIN_CATEGORY_OPTIONS}
							translateOptions
						/>
					</Value>
				</Form>
				<Groupbox title={t('parameters')}>
					<Flex one style={TREES_STYLE_HEIGHT}>
						<Tree
							constructorType={Model.PluginDefaultParameter}
							list={defaultParameters}
							onListUpdated={handleDefaultParametersUpdated}
							noScrollOnForce
							byIndex
							doNotShowID
						/>
					</Flex>
				</Groupbox>
				<Groupbox title={t('commands')}>
					<Flex one style={TREES_STYLE_HEIGHT}>
						<Tree
							constructorType={Model.PluginCommand}
							list={commands}
							onListUpdated={handleCommandsUpdated}
							noScrollOnForce
						/>
					</Flex>
				</Groupbox>
			</Flex>
		);
	};

	return (
		<Dialog
			title={`${t('plugins.manager')}...`}
			isOpen={isOpen}
			footer={
				<FooterCancelSaveClose
					onCancel={handleCancel}
					onSave={handleSave}
					onSaveAndClose={handleSaveAndClose}
				/>
			}
			onClose={handleCancel}
			initialWidth='1000px'
			initialHeight='700px'
			isLoading={isLoading}
		>
			<Tab
				titles={Model.Base.mapListIndex(['Plugins', 'Source code'])}
				contents={[getPluginsContent(), null]}
				padding
				scrollableContent
				lazyLoadingContent
				hideScroll
			/>
		</Dialog>
	);
}

export default DialogPlugins;
