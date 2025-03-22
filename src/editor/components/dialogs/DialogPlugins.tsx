/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paths } from '../../common';
import { Platform } from '../../common/Platform';
import { Node, Project } from '../../core';
import { Model } from '../../Editor';
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

	const initialize = async () => {
		setIsLoading(true);
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
		await Platform.copyFolder(
			Paths.join(Project.current!.getPath(), Paths.PLUGINS),
			Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP)
		);
		setPlugins(Node.createList(Project.current!.scripts.plugins));
		setIsLoading(false);
	};

	const handleSelectPlugin = (node: Node | null) => {
		if (node) {
			const plugin = node.content as Model.Plugin;
			setSelectedPlugin(plugin);
		}
	};

	const handleCancel = async () => {
		setIsLoading(true);
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
		await Project.current!.scripts.load();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleSave = async () => {
		setIsLoading(true);
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS));
		await Platform.copyFolder(
			Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP),
			Paths.join(Project.current!.getPath(), Paths.PLUGINS)
		);
		setIsLoading(false);
	};

	const handleSaveAndClose = async () => {
		setIsLoading(true);
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS));
		await Platform.copyFolder(
			Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP),
			Paths.join(Project.current!.getPath(), Paths.PLUGINS)
		);
		await Platform.removeFolder(Paths.join(Project.current!.getPath(), Paths.PLUGINS_TEMP));
		setIsLoading(false);
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
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
					noScrollOnForce
					scrollable
					applyDefault
				/>
			</Flex>
			<Flex one>
				{selectedPlugin && selectedPlugin.id !== -1 ? (
					<Tab
						titles={Model.Base.mapListIndex([t('details'), t('code'), t('edit'), t('export')])}
						contents={[getPluginsDetailsContent(), null, null, null]}
						padding
						scrollableContent
						lazyLoadingContent
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
			/>
		</Dialog>
	);
}

export default DialogPlugins;
