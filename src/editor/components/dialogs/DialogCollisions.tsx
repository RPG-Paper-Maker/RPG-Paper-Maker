/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { Tileset } from '../../models';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import Tab from '../Tab';
import TextureCollisionsEditor from '../TextureCollisionsEditor';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
};

function DialogCollisions({ isOpen, setIsOpen }: Props) {
	const { t } = useTranslation();

	const [tilesets, setTilesets] = useState<Node[]>([]);
	const [selectedTileset, setSelectedTileset] = useState<Tileset | null>(null);

	const initialize = () => {
		setTilesets(Node.createList(Project.current!.tilesets.list, false));
	};

	const handleSelectTileset = (node: Node | null) => {
		const tileset = (node?.content as Tileset) ?? null;
		setSelectedTileset(tileset);
	};

	const handleAccept = async () => {
		await Project.current!.pictures.save();
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.pictures.load();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	const getTilesetsContent = () => (
		<Flex fillWidth fillHeight spacedLarge>
			<Groupbox title={t('tilesets')}>
				<Flex one fillHeight>
					<Tree
						constructorType={Tileset}
						list={tilesets}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectTileset}
						noScrollOnForce
						scrollable
						cannotAdd
						cannotDelete
						cannotDragDrop
						cannotEdit
					/>
				</Flex>
			</Groupbox>
			<Flex one fillWidth>
				{selectedTileset && (
					<TextureCollisionsEditor
						pictureID={selectedTileset.pictureID}
						pictureKind={PICTURE_KIND.TILESETS}
					/>
				)}
			</Flex>
		</Flex>
	);

	return (
		<Dialog
			title={`${t('collisions.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1100px'
			initialHeight='700px'
		>
			<Tab
				titles={Model.Base.mapListIndex([
					t('tilesets'),
					t('characters'),
					t('autotiles'),
					t('walls'),
					t('mountains'),
					t('threed.objects'),
				])}
				contents={[getTilesetsContent(), null, null, null, null, null]}
				padding
				lazyLoadingContent
				noScrollToSelectedElement
				hideScroll
			/>
		</Dialog>
	);
}

export default DialogCollisions;
