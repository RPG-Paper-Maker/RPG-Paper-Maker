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
import { Autotile, Picture, Tileset } from '../../models';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import Tab from '../Tab';
import TextureCollisionsEditor from '../TextureCollisionsEditor';
import Tree, { TREES_LARGE_MIN_WIDTH } from '../Tree';
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
	const [characters, setCharacters] = useState<Node[]>([]);
	const [selectedCharacter, setSelectedCharacter] = useState<Picture | null>(null);
	const [autotiles, setAutotiles] = useState<Node[]>([]);
	const [selectedAutotile, setSelectedAutotile] = useState<Autotile | null>(null);

	const initialize = () => {
		setTilesets(Node.createList(Project.current!.tilesets.list, false));
		const chars = Node.createList(Project.current!.pictures.getList(PICTURE_KIND.CHARACTERS), false);
		chars.shift();
		chars.shift();
		setCharacters(chars);
		setAutotiles(Node.createList(Project.current!.specialElements.autotiles, false));
	};

	const handleSelectTileset = (node: Node | null) => {
		setSelectedTileset((node?.content as Tileset) ?? null);
	};

	const handleSelectCharacter = (node: Node | null) => {
		setSelectedCharacter((node?.content as Picture) ?? null);
	};

	const handleSelectAutotile = (node: Node | null) => {
		setSelectedAutotile((node?.content as Autotile) ?? null);
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

	const getTabContent = (
		title: string,
		list: Node[],
		onSelectedItem: (node: Node | null) => void,
		pictureID: number,
		pictureKind: PICTURE_KIND,
		isAnimated = false
	) => (
		<Flex fillWidth fillHeight spacedLarge>
			<Groupbox title={t(title)}>
				<Flex one fillHeight>
					<Tree
						list={list}
						minWidth={TREES_LARGE_MIN_WIDTH}
						onSelectedItem={onSelectedItem}
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
				<TextureCollisionsEditor pictureID={pictureID} pictureKind={pictureKind} isAnimated={isAnimated} />
			</Flex>
		</Flex>
	);

	const getTilesetsContent = () =>
		getTabContent(
			'tilesets',
			tilesets,
			handleSelectTileset,
			selectedTileset?.pictureID ?? -1,
			PICTURE_KIND.TILESETS
		);

	const getCharactersContent = () =>
		getTabContent(
			'characters',
			characters,
			handleSelectCharacter,
			selectedCharacter?.id ?? -1,
			PICTURE_KIND.CHARACTERS
		);

	const getAutotilesContent = () =>
		getTabContent(
			'autotiles',
			autotiles,
			handleSelectAutotile,
			selectedAutotile?.pictureID ?? -1,
			PICTURE_KIND.AUTOTILES,
			selectedAutotile?.isAnimated ?? false
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
				contents={[getTilesetsContent(), getCharactersContent(), getAutotilesContent(), null, null, null]}
				padding
				lazyLoadingContent
				noScrollToSelectedElement
				hideScroll
			/>
		</Dialog>
	);
}

export default DialogCollisions;
