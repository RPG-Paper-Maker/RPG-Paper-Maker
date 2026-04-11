/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INPUT_TYPE_WIDTH } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import Flex from '../Flex';
import InputLocalization from '../InputLocalization';
import Tab from '../Tab';
import Tree from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogLanguages({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const [languages, setLanguages] = useState<Node[]>([]);

	const extraWords = useMemo(() => Object.entries(Project.current!.languages.getTranslationsMapping()), []);

	const initialize = async () => {
		setLanguages(Node.createList(Project.current!.languages.list, false));
	};

	const handleListUpdated = () => {
		Project.current!.languages.list = Node.createListFromNodes(languages);
	};

	const handleAccept = async () => {
		const project = Project.current!;
		await Promise.all([
			project.languages.save(),
			project.titleScreenGameOver.save(),
			project.systems.save(),
			project.battleSystem.save(),
			project.skills.save(),
			project.items.save(),
			project.weapons.save(),
			project.armors.save(),
			project.status.save(),
			project.heroes.save(),
			project.classes.save(),
			project.monsters.save(),
			project.keyboard.save(),
		]);
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.languages.load();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize().catch(console.error);
	}, []);

	const getLanguagesContent = () => {
		return (
			<Tree
				constructorType={Model.Language}
				list={languages}
				onListUpdated={handleListUpdated}
				scrollable
				applyDefault
			/>
		);
	};

	const getExtraWordsContent = () => {
		return (
			<Flex column spacedLarge>
				{extraWords.map(([key, value]) => (
					<Flex column spaced key={key}>
						<div>{t(key)}:</div>
						<InputLocalization localization={value} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Flex>
				))}
			</Flex>
		);
	};

	return (
		<Dialog
			title={`${t('languages.manager')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='500px'
			initialHeight='calc(100% - 50px)'
		>
			<Tab
				titles={Model.Base.mapListIndex([t('languages'), t('extra.words')])}
				contents={[getLanguagesContent(), getExtraWordsContent()]}
				padding
				scrollableContent
				lazyLoadingContent
				hideScroll
			/>
		</Dialog>
	);
}

export default DialogLanguages;
