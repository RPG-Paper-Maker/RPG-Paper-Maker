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
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paths } from '../../common';
import { Platform } from '../../common/Platform';
import { Node, Project } from '../../core';
import { Model } from '../../Editor';
import useStateBool from '../../hooks/useStateBool';
import useStateString from '../../hooks/useStateString';
import Flex from '../Flex';
import PanelPluginDetails from '../panels/plugins/PanelPluginDetails';
import Tab from '../Tab';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog from './Dialog';
import FooterCancelSaveClose from './footers/FooterCancelSaveClose';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
};

function DialogPlugins({ isOpen, setIsOpen }: Props) {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);
	const [plugins, setPlugins] = useState<Node[]>([]);
	const [selectedPlugin, setSelectedPlugin] = useState<Model.Plugin | null>(null);
	const [code, setCode] = useStateString();
	const [triggerUpdate, setTriggerUpdate] = useStateBool();

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
	};

	const handleSelectPlugin = (node: Node | null) => {
		if (node) {
			const plugin = node.content as Model.Plugin;
			setSelectedPlugin(plugin);
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
					setIsLoading(false);
				})();
			} else {
				setCode(plugin.code ?? '');
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
						contents={[getPluginsDetailsContent(), getPluginsDetailsCode(), null, null]}
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
			<PanelPluginDetails plugin={selectedPlugin} />
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
