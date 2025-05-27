/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH, ITERATOR, JSONType, Paths, PLUGIN_TYPE_KIND } from '../../common';
import {
	copyFolder,
	exportFolder,
	Platform,
	readFile,
	readPublicFile,
	removeFolder,
	renameFile,
} from '../../common/Platform';
import { LocalFile } from '../../core/LocalFile';

import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import useStateBool from '../../hooks/useStateBool';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputText from '../InputText';
import PanelPluginDetails from '../panels/plugins/PanelPluginDetails';
import Tab from '../Tab';
import TextArea from '../TextArea';
import Tree, { TREES_LARGE_MIN_WIDTH, TREES_MIN_WIDTH } from '../Tree';
import Dialog from './Dialog';
import FooterCancelSaveClose from './footers/FooterCancelSaveClose';
const Editor = lazy(() => import('@monaco-editor/react'));

const TREES_STYLE_HEIGHT = { height: '100px' };

const manifestToTreeMapTag = (manifest: JSONType, foldersID: ITERATOR, filesID: ITERATOR, path: string): Node[] => {
	const nodes: Node[] = [];
	for (const key in manifest) {
		if (key === 'files') {
			nodes.push(
				...(manifest[key] as string[]).map((file) =>
					Node.create(Model.TreeMapTag.create(filesID.i++, file, true, Paths.join(path, file)))
				)
			);
		} else {
			const folder = Node.create(Model.TreeMapTag.create(foldersID.i--, key));
			folder.expanded = false;
			folder.children = manifestToTreeMapTag(
				manifest[key] as JSONType,
				foldersID,
				filesID,
				Paths.join(path, key)
			);
			nodes.push(folder);
		}
	}
	return nodes;
};

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
	const [sourceCode, setSourceCode] = useStateString();
	const [isSourceCodeJavascript, setIsSourceCodeJavascript] = useState(false);
	const [autoUpdate, setAutoUpdate] = useStateBool();

	const folders = useMemo(
		() => [
			Node.create(
				Model.TreeMapTag.create(-1, 'Scripts'),
				manifestToTreeMapTag(Platform.manifest.Scripts as JSONType, { i: -2 }, { i: 1 }, '/Scripts')
			),
		],
		[]
	);

	const initialize = async () => {
		setIsLoading(true);
		await removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
		await copyFolder(
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
			if (plugin.id !== -1) {
				setIsLoading(true);
				(async () => {
					if (plugin.code === undefined) {
						const path = Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, plugin.name);
						plugin.code = (await readFile(Paths.join(path, Paths.FILE_PLUGIN_CODE))) ?? '';
						plugin.pictureBase64 =
							(await LocalFile.readFile(Paths.join(path, Paths.FILE_PLUGIN_PICTURE))) ?? '';
					}
					setCode(plugin.code);
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
					setAutoUpdate(plugin.autoUpdate);
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

	const handleDeletePlugin = async (node: Node) => {
		await removeFolder(
			Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, (node.content as Model.Plugin).name)
		);
	};

	const handleOnChangeCode = (v?: string) => {
		if (selectedPlugin && v !== undefined) {
			selectedPlugin.code = v;
			selectedPlugin.saved = false;
			setTriggerUpdate((b) => !b);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleEditorDidMount = (editor: unknown, monaco: any) => {
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

	const handleChangeName = async (s: string) => {
		if (s.length === 0 || Project.current!.scripts.plugins.some((p) => p.name === s)) {
			return;
		}
		setName(s);
		await renameFile(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP), selectedPlugin!.name, s);
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

	const handleChangeAutoUpdate = (b: boolean) => {
		setAutoUpdate(b);
		selectedPlugin!.autoUpdate = b;
		unsavePlugin();
	};

	const handleClickCheckUpdate = async () => {
		setIsLoading(true);
		await selectedPlugin!.checkUpdate(undefined, true);
		unsavePlugin();
		setIsLoading(false);
	};

	const handleClickExport = async () => {
		setIsLoading(true);
		await exportFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP, selectedPlugin!.name));
		setIsLoading(false);
	};

	const handleSelectSourceCode = async (node: Node | null) => {
		if (node) {
			const tag = node.content as Model.TreeMapTag;
			if (tag.path) {
				setSourceCode(await readPublicFile(tag.path));
				setIsSourceCodeJavascript(tag.name.endsWith('.js'));
				return;
			}
		}
		setSourceCode('');
		setIsSourceCodeJavascript(false);
	};

	const handleCancel = async () => {
		setIsLoading(true);
		await removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
		await Project.current!.scripts.load();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleSave = async () => {
		await removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS));
		await copyFolder(
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
		await removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
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
					onDeleteItem={handleDeletePlugin}
					triggerUpdate={triggerUpdate}
					noScrollOnForce
					scrollable
					applyDefault
				/>
			</Flex>
			<Flex one>
				{selectedPlugin && selectedPlugin.id !== -1 ? (
					<Flex column spacedLarge fillWidth>
						<Tab
							titles={Model.Base.mapListIndex([t('details'), t('code'), t('edit'), t('export')])}
							contents={[
								getPluginsDetailsContent(),
								getPluginsDetailsCode(),
								getPluginsDetailsEdit(),
								getPluginsDetailsExport(),
							]}
							padding
							scrollableContent
							lazyLoadingContent
							hideScroll
						/>
						{selectedPlugin.type === PLUGIN_TYPE_KIND.ONLINE && (
							<Flex spacedLarge>
								<Flex one />
								<Checkbox isChecked={autoUpdate} onChange={handleChangeAutoUpdate}>
									{t('auto.update')}
								</Checkbox>
								<Button onClick={handleClickCheckUpdate}>{t('check.update')}</Button>
							</Flex>
						)}
					</Flex>
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
			<PanelPluginDetails
				plugin={selectedPlugin}
				triggerUpdateParameters={triggerUpdateParameters}
				onParametersUpdated={unsavePlugin}
			/>
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
						<InputText
							value={name}
							onChange={handleChangeName}
							widthType={INPUT_TYPE_WIDTH.FILL}
							isAsyncChange
						/>
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

	const getPluginsDetailsExport = () => (
		<Flex key={3} column spacedLarge fillWidth fillHeight>
			<b>{t('export.this.plugin.locally')}:</b>
			<Flex>
				<Button onClick={handleClickExport}>{t('export')}...</Button>
			</Flex>
			<b>{t('export.to.online.database')}:</b>
			<a
				href={'https://github.com/RPG-Paper-Maker/RPG-Paper-Maker/wiki/Online-plugins-submission'}
				target='_blank'
				rel='noreferrer'
			>
				https://github.com/RPG-Paper-Maker/RPG-Paper-Maker/wiki/Online-plugins-submission
			</a>
		</Flex>
	);

	const getPluginsSourceCode = () => (
		<Flex key={1} spacedLarge fillWidth fillHeight>
			<Flex fillHeight>
				<Tree
					constructorType={Model.TreeMapTag}
					list={folders}
					minWidth={TREES_LARGE_MIN_WIDTH}
					onSelectedItem={handleSelectSourceCode}
					noScrollOnForce
					scrollable
					cannotAdd
					cannotDelete
					cannotDragDrop
					cannotEdit
				/>
			</Flex>
			<Flex one>
				{sourceCode && (
					<Editor
						defaultLanguage={isSourceCodeJavascript ? 'javascript' : 'typescript'}
						value={sourceCode}
						theme='vs-dark'
					/>
				)}
			</Flex>
		</Flex>
	);

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
				contents={[getPluginsContent(), getPluginsSourceCode()]}
				padding
				scrollableContent
				lazyLoadingContent
				hideScroll
			/>
		</Dialog>
	);
}

export default DialogPlugins;
