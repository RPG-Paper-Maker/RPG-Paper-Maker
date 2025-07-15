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
import useStateBool from '../../hooks/useStateBool';
import useStateNumber from '../../hooks/useStateNumber';
import { Autotile, Base, Mountain, Object3D, Picture, SpecialElement, Tileset } from '../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../AssetSelector';
import Checkbox from '../Checkbox';
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
	kind?: PICTURE_KIND;
};

function DialogCollisions({ isOpen, setIsOpen, kind }: Props) {
	const { t } = useTranslation();

	const [tilesets, setTilesets] = useState<Node[]>([]);
	const [selectedTileset, setSelectedTileset] = useState<Tileset | null>(null);
	const [characters, setCharacters] = useState<Node[]>([]);
	const [selectedCharacter, setSelectedCharacter] = useState<Picture | null>(null);
	const [autotiles, setAutotiles] = useState<Node[]>([]);
	const [selectedAutotile, setSelectedAutotile] = useState<Autotile | null>(null);
	const [autotilePictureID, setAutotilePictureID] = useStateNumber();
	const [autotileIsAnimated, setAutotileIsAnimated] = useStateBool();
	const [walls, setWalls] = useState<Node[]>([]);
	const [selectedWall, setSelectedWall] = useState<SpecialElement | null>(null);
	const [wallPictureID, setWallPictureID] = useStateNumber();
	const [mountains, setMountains] = useState<Node[]>([]);
	const [selectedMountain, setSelectedMountain] = useState<Mountain | null>(null);
	const [mountainCollisionKind, setMountainCollisionKind] = useState(MOUNTAIN_COLLISION_KIND.DEFAULT);
	const [objects, setObjects] = useState<Node[]>([]);
	const [selectedObject, setSelectedObject] = useState<Object3D | null>(null);
	const [objectCollisionKind, setObjectCollisionKind] = useState(OBJECT_COLLISION_KIND.NONE);

	const title = useMemo(() => {
		switch (kind) {
			case PICTURE_KIND.AUTOTILES:
				return 'autotiles';
			case PICTURE_KIND.WALLS:
				return 'walls';
			case PICTURE_KIND.OBJECTS_3D:
				return 'threed.objects';
			default:
				return 'collisions.manager';
		}
	}, [kind]);
	const mountainPicture = useMemo(
		() => Project.current!.pictures.getByID(PICTURE_KIND.MOUNTAINS, selectedMountain?.pictureID ?? -1),
		[selectedMountain]
	);
	const isAutotileDisabled = useMemo(
		() => selectedAutotile === null || selectedAutotile.id === -1,
		[selectedAutotile]
	);
	const isWallDisabled = useMemo(() => selectedWall === null || selectedWall.id === -1, [selectedWall]);

	const initialize = () => {
		if (kind === undefined) {
			setTilesets(Node.createList(Project.current!.tilesets.list, false));
			const chars = Node.createList(Project.current!.pictures.getList(PICTURE_KIND.CHARACTERS), false);
			chars.shift();
			chars.shift();
			setCharacters(chars);
		}
		if (kind === undefined || kind === PICTURE_KIND.AUTOTILES) {
			setAutotiles(Node.createList(Project.current!.specialElements.autotiles, false));
		}
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
		const autotile = (node?.content as Autotile) ?? null;
		setSelectedAutotile(autotile);
		if (kind === PICTURE_KIND.AUTOTILES) {
			setAutotilePictureID(autotile?.pictureID ?? -1);
			setAutotileIsAnimated(autotile?.isAnimated ?? false);
		}
	};

	const handleChangeAutotilePictureID = (id: number) => {
		if (selectedAutotile) {
			selectedAutotile.pictureID = id;
			setAutotilePictureID(id);
		}
	};

	const handleChangeAutotileIsAnimated = (b: boolean) => {
		if (selectedAutotile) {
			selectedAutotile.isAnimated = b;
			setAutotileIsAnimated(b);
		}
	};

	const handleUpdateAutotiles = () => {
		Project.current!.specialElements.autotiles = Node.createListFromNodes(autotiles);
	};

	const handleSelectWall = (node: Node | null) => {
		const wall = (node?.content as SpecialElement) ?? null;
		setSelectedWall(wall);
		if (kind === PICTURE_KIND.WALLS) {
			setWallPictureID(wall?.pictureID ?? -1);
		}
	};

	const handleChangeWallPictureID = (id: number) => {
		if (selectedWall) {
			selectedWall.pictureID = id;
			setWallPictureID(id);
		}
	};

	const handleUpdateWalls = () => {
		Project.current!.specialElements.walls = Node.createListFromNodes(walls);
	};

	const handleSelectMountain = async (node: Node | null) => {
		const mountain = (node?.content as Mountain) ?? null;
		setSelectedMountain(mountain);
		if (mountain) {
			setMountainCollisionKind(mountain.collisionKind);
		}
	};

	const handleUpdateMountains = () => {
		Project.current!.specialElements.mountains = Node.createListFromNodes(mountains);
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

	const handleUpdateObjects = () => {
		Project.current!.specialElements.objects3D = Node.createListFromNodes(objects);
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
		if (
			kind !== undefined ||
			selectedAutotile !== null ||
			selectedWall !== null ||
			selectedMountain !== null ||
			selectedObject !== null
		) {
			await Project.current!.specialElements.save();
		}
		setIsOpen(false);
	};

	const handleReject = async () => {
		await Project.current!.pictures.load();
		if (
			kind !== undefined ||
			selectedAutotile !== null ||
			selectedWall !== null ||
			selectedMountain !== null ||
			selectedObject !== null
		) {
			await Project.current!.specialElements.load();
		}
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	const getTabContentWithChildren = (
		title: string,
		list: Node[],
		onSelectedItem: (node: Node | null) => void,
		onListUpdated: () => void,
		children: ReactNode | ReactNode[],
		constructorType = Model.Base
	) => (
		<Flex fillWidth fillHeight spacedLarge>
			<Groupbox title={t(title)}>
				<Flex one fillHeight>
					<Tree
						constructorType={constructorType}
						list={list}
						minWidth={TREES_LARGE_MIN_WIDTH}
						onSelectedItem={onSelectedItem}
						onListUpdated={kind === undefined ? undefined : onListUpdated}
						noScrollOnForce
						scrollable
						cannotAdd={kind === undefined}
						cannotDelete={kind === undefined}
						cannotDragDrop={kind === undefined}
						cannotEdit={kind === undefined}
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
		onListUpdated: () => void,
		pictureID: number,
		pictureKind: PICTURE_KIND,
		constructorType = Model.Base
	) =>
		getTabContentWithChildren(
			title,
			list,
			onSelectedItem,
			onListUpdated,
			<TextureCollisionsEditor pictureID={pictureID} pictureKind={pictureKind} />,
			constructorType
		);

	const getTilesetsContent = () =>
		getTabContent(
			'tilesets',
			tilesets,
			handleSelectTileset,
			() => {},
			selectedTileset?.pictureID ?? -1,
			PICTURE_KIND.TILESETS
		);

	const getCharactersContent = () =>
		getTabContent(
			'characters',
			characters,
			handleSelectCharacter,
			() => {},
			selectedCharacter?.id ?? -1,
			PICTURE_KIND.CHARACTERS
		);

	const getAutotilesContent = () =>
		getTabContentWithChildren(
			'autotiles',
			autotiles,
			handleSelectAutotile,
			handleUpdateAutotiles,
			selectedAutotile ? (
				kind === PICTURE_KIND.AUTOTILES ? (
					<Flex column fillWidth fillHeight spacedLarge>
						<Flex spaced centerV>
							<Flex disabledLabel={isAutotileDisabled}>{t('texture')}:</Flex>
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.PICTURES}
								kind={PICTURE_KIND.AUTOTILES}
								selectedID={autotilePictureID}
								onChange={handleChangeAutotilePictureID}
								disabled={isAutotileDisabled}
							/>
						</Flex>
						<Flex one>
							<TextureCollisionsEditor
								pictureID={autotilePictureID}
								pictureKind={PICTURE_KIND.AUTOTILES}
								isAnimated={autotileIsAnimated}
								disabled={isAutotileDisabled}
							/>
						</Flex>
						<Checkbox
							isChecked={autotileIsAnimated}
							onChange={handleChangeAutotileIsAnimated}
							disabled={isAutotileDisabled}
						>
							{t('animated')}
						</Checkbox>
					</Flex>
				) : (
					<TextureCollisionsEditor
						pictureID={selectedAutotile.pictureID}
						pictureKind={PICTURE_KIND.AUTOTILES}
						isAnimated={selectedAutotile.isAnimated}
					/>
				)
			) : null,
			Model.Autotile
		);

	const getWallsContent = () =>
		getTabContentWithChildren(
			'walls',
			walls,
			handleSelectWall,
			handleUpdateWalls,
			selectedWall ? (
				kind === PICTURE_KIND.WALLS ? (
					<Flex column fillWidth fillHeight spacedLarge>
						<Flex spaced centerV>
							<Flex disabledLabel={isWallDisabled}>{t('texture')}:</Flex>
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.PICTURES}
								kind={PICTURE_KIND.WALLS}
								selectedID={wallPictureID}
								onChange={handleChangeWallPictureID}
								disabled={isWallDisabled}
							/>
						</Flex>
						<Flex one>
							<TextureCollisionsEditor
								pictureID={wallPictureID}
								pictureKind={PICTURE_KIND.WALLS}
								disabled={isWallDisabled}
							/>
						</Flex>
					</Flex>
				) : (
					<TextureCollisionsEditor pictureID={selectedWall.pictureID} pictureKind={PICTURE_KIND.WALLS} />
				)
			) : null,
			Model.SpecialElement
		);

	const getMountainsContent = () =>
		getTabContentWithChildren(
			'mountains',
			mountains,
			handleSelectMountain,
			handleUpdateMountains,
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
			handleUpdateObjects,
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

	const getContent = () => {
		switch (kind) {
			case PICTURE_KIND.AUTOTILES:
				return getAutotilesContent();
			case PICTURE_KIND.WALLS:
				return getWallsContent();
			default:
				return (
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
				);
		}
	};

	return (
		<Dialog
			title={`${t(title)}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1100px'
			initialHeight='700px'
		>
			{getContent()}
		</Dialog>
	);
}

export default DialogCollisions;
