/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { Tileset } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import TextureCollisionsEditor from '../../TextureCollisionsEditor';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';

const PanelTilesets = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [tilesets, setTilesets] = useState<Node[]>([]);
	const [selectedTileset, setSelectedTileset] = useState<Tileset | null>(null);
	const [pictureID, setPictureID] = useStateNumber();
	const [battleMap, setBattleMap] = useStateDynamicValue();

	const isTilesetDisabled = useMemo(() => selectedTileset === null || selectedTileset.id === -1, [selectedTileset]);

	const initialize = () => {
		setTilesets(Node.createList(Project.current!.tilesets.list, false));
	};

	const handleSelectTileset = (node: Node | null) => {
		const tileset = (node?.content as Tileset) ?? null;
		setSelectedTileset(tileset);
		if (tileset) {
			setPictureID(tileset.pictureID);
			setBattleMap(tileset.battleMap);
		}
	};

	const handleListUpdated = () => {
		Project.current!.tilesets.list = Node.createListFromNodes(tilesets);
	};

	const handleChangePictureID = (id: number) => {
		setPictureID(id);
		if (selectedTileset) {
			selectedTileset.pictureID = id;
		}
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('tilesets')}>
				<Tree
					constructorType={Tileset}
					list={tilesets}
					minWidth={TREES_MIN_WIDTH}
					onSelectedItem={handleSelectTileset}
					onListUpdated={handleListUpdated}
					scrollable
					showEditName
					isLocalization
					applyDefault
					doNotOpenDialog
				/>
			</Groupbox>
			<Flex one column spacedLarge>
				<Flex spacedLarge>
					<Flex spaced>
						<Flex disabledLabel={isTilesetDisabled}>{t('picture')}:</Flex>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.TILESETS}
							selectedID={pictureID}
							onChange={handleChangePictureID}
							disabled={isTilesetDisabled}
						/>
					</Flex>
					<Flex spaced>
						<Flex disabledLabel={isTilesetDisabled}>{t('battle.map')}:</Flex>
						<DynamicValueSelector
							value={battleMap}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.battleSystem.battleMaps}
						/>
					</Flex>
				</Flex>
				<Flex one fillWidth>
					<TextureCollisionsEditor pictureID={pictureID} pictureKind={PICTURE_KIND.TILESETS} />
				</Flex>
			</Flex>
		</Flex>
	);
});

PanelTilesets.displayName = 'PanelTilesets';

export default PanelTilesets;
