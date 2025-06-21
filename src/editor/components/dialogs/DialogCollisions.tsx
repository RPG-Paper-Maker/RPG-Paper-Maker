/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	CUSTOM_SHAPE_KIND,
	MOUNTAIN_COLLISION_KIND,
	OBJECT_COLLISION_KIND,
	PICTURE_KIND,
	SHAPE_KIND,
} from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { Autotile, Base, Mountain, Object3D, Picture, SpecialElement, Tileset } from '../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../AssetSelector';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import PreviewerObject3D from '../PreviewerObject3D';
import Tab from '../Tab';
import TextureCollisionsEditor from '../TextureCollisionsEditor';
import TexturePreviewer from '../TexturePreviewer';
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
	const [walls, setWalls] = useState<Node[]>([]);
	const [selectedWall, setSelectedWall] = useState<SpecialElement | null>(null);
	const [mountains, setMountains] = useState<Node[]>([]);
	const [selectedMountain, setSelectedMountain] = useState<Mountain | null>(null);
	const [mountainCollisionKind, setMountainCollisionKind] = useState(MOUNTAIN_COLLISION_KIND.DEFAULT);
	const [objects, setObjects] = useState<Node[]>([]);
	const [selectedObject, setSelectedObject] = useState<Object3D | null>(null);
	const [objectCollisionKind, setObjectCollisionKind] = useState(OBJECT_COLLISION_KIND.NONE);

	const mountainPicture = useMemo(
		() => Project.current!.pictures.getByID(PICTURE_KIND.MOUNTAINS, selectedMountain?.pictureID ?? -1),
		[selectedMountain]
	);

	const initialize = () => {
		setTilesets(Node.createList(Project.current!.tilesets.list, false));
		const chars = Node.createList(Project.current!.pictures.getList(PICTURE_KIND.CHARACTERS), false);
		chars.shift();
		chars.shift();
		setCharacters(chars);
		setAutotiles(Node.createList(Project.current!.specialElements.autotiles, false));
		setWalls(Node.createList(Project.current!.specialElements.walls, false));
		setMountains(Node.createList(Project.current!.specialElements.mountains, false));
		setObjects(Node.createList(Project.current!.specialElements.objects3D, false));
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

	const handleSelectWall = (node: Node | null) => {
		setSelectedWall((node?.content as SpecialElement) ?? null);
	};

	const handleSelectMountain = async (node: Node | null) => {
		const mountain = (node?.content as Mountain) ?? null;
		setSelectedMountain(mountain);
		if (mountain) {
			setMountainCollisionKind(mountain.collisionKind);
		}
	};

	const handleChangeMountainCollisionKind = (n: number) => {
		if (selectedMountain) {
			setMountainCollisionKind(n);
			selectedMountain.collisionKind = n;
		}
	};

	const handleSelectObject = (node: Node | null) => {
		const obj = (node?.content as Object3D) ?? null;
		setSelectedObject(obj);
		if (obj) {
			setObjectCollisionKind(obj.collisionKind);
		}
	};

	const handleChangeObjectCollisionKind = (n: number) => {
		if (selectedObject) {
			selectedObject.collisionKind = n;
			setObjectCollisionKind(n);
		}
	};

	const handleChangeObjectCollisionCustomID = (id: number) => {
		if (selectedObject) {
			selectedObject.collisionCustomID = id;
		}
	};

	const handleAccept = async () => {
		await Project.current!.pictures.save();
		if (selectedMountain !== null || selectedObject !== null) {
			await Project.current!.specialElements.save();
		}
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.pictures.load();
		if (selectedMountain !== null || selectedObject !== null) {
			await Project.current!.specialElements.load();
		}
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	const getTabContentWithChildren = (
		title: string,
		list: Node[],
		onSelectedItem: (node: Node | null) => void,
		children: ReactNode | ReactNode[]
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
				{children}
			</Flex>
		</Flex>
	);

	const getTabContent = (
		title: string,
		list: Node[],
		onSelectedItem: (node: Node | null) => void,
		pictureID: number,
		pictureKind: PICTURE_KIND,
		isAnimated = false
	) =>
		getTabContentWithChildren(
			title,
			list,
			onSelectedItem,
			<TextureCollisionsEditor pictureID={pictureID} pictureKind={pictureKind} isAnimated={isAnimated} />
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

	const getWallsContent = () =>
		getTabContent('walls', walls, handleSelectWall, selectedWall?.pictureID ?? -1, PICTURE_KIND.WALLS);

	const getMountainsContent = () =>
		getTabContentWithChildren(
			'mountains',
			mountains,
			handleSelectMountain,
			mountainPicture ? (
				<Flex column fillWidth fillHeight spacedLarge>
					<Flex spaced centerV>
						<div>{t('collisions')}:</div>
						<Dropdown
							selectedID={mountainCollisionKind}
							onChange={handleChangeMountainCollisionKind}
							options={Base.MOUNTAIN_COLLISION_OPTIONS}
							translateOptions
						/>
					</Flex>
					<TexturePreviewer texture={mountainPicture.getPath()} base64={!mountainPicture.isBR} />
				</Flex>
			) : null
		);

	const getObjectsContent = () =>
		getTabContentWithChildren(
			'threed.objects',
			objects,
			handleSelectObject,
			selectedObject ? (
				<Flex column fillWidth fillHeight spacedLarge>
					<Flex spaced centerV>
						<div>{t('collisions')}:</div>
						<Dropdown
							selectedID={objectCollisionKind}
							disabledIds={
								selectedObject.shapeKind === SHAPE_KIND.BOX
									? [OBJECT_COLLISION_KIND.SIMPLIFIED, OBJECT_COLLISION_KIND.CUSTOM]
									: [OBJECT_COLLISION_KIND.PERFECT]
							}
							onChange={handleChangeObjectCollisionKind}
							options={Model.Base.OBJECT_COLLISION_KIND_OPTIONS}
							translateOptions
						/>
						{selectedObject.collisionKind === OBJECT_COLLISION_KIND.CUSTOM && (
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.SHAPES}
								kind={CUSTOM_SHAPE_KIND.COLLISIONS}
								selectedID={selectedObject.collisionCustomID}
								onChange={handleChangeObjectCollisionCustomID}
							/>
						)}
					</Flex>
					<PreviewerObject3D sceneID='dialog-object-3D-preview' objectID={selectedObject.id} />
				</Flex>
			) : null
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
				contents={[
					getTilesetsContent(),
					getCharactersContent(),
					getAutotilesContent(),
					getWallsContent(),
					getMountainsContent(),
					getObjectsContent(),
				]}
				padding
				lazyLoadingContent
				noScrollToSelectedElement
				hideScroll
			/>
		</Dialog>
	);
}

export default DialogCollisions;
