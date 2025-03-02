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
import { Node, Project } from '../../core';
import { Model } from '../../Editor';
import Flex from '../Flex';
import Tab from '../Tab';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
};

function DialogPlugins({ isOpen, setIsOpen }: Props) {
	const { t } = useTranslation();

	const [plugins, setPlugins] = useState<Node[]>([]);
	const [selectedPlugin, setSelectedPlugin] = useState<Model.Plugin | null>(null);

	const initialize = () => {
		setPlugins(Node.createList(Project.current!.scripts.plugins));
	};

	const handleSelectPlugin = (node: Node | null) => {
		if (node) {
			const plugin = node.content as Model.Plugin;
			setSelectedPlugin(plugin);
		}
	};

	const handleAccept = async () => {
		/*
		panelSystemRef.current?.accept();
		panelBattleSystemRef.current?.accept();
		panelTitleScreenGameOverRef.current?.accept();
		panelMainMenuRef.current?.accept();
		panelEventsStatesRef.current?.accept();
		panelCommonReactionsRef.current?.accept();
		panelModelsRef.current?.accept();
		await Project.current!.systems.save();
		await Project.current!.battleSystem.save();
		await Project.current!.titleScreenGameOver.save();
		await Project.current!.commonEvents.save();*/
		setIsOpen(false);
	};

	const handleReject = async () => {
		/*
		await Project.current!.systems.load();
		await Project.current!.battleSystem.load();
		await Project.current!.titleScreenGameOver.load();
		await Project.current!.commonEvents.load();*/
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
			<div>
				<b>{t('name')}:</b> {selectedPlugin?.name}
			</div>
		</Flex>
	);

	return (
		<Dialog
			title={`${t('plugins.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1000px'
			initialHeight='700px'
		>
			<Tab
				titles={Model.Base.mapListIndex(['Plugins', 'System', 'Libs', 'Shaders'])}
				contents={[getPluginsContent(), null, null, null]}
				padding
				scrollableContent
				lazyLoadingContent
			/>
		</Dialog>
	);
}

export default DialogPlugins;
