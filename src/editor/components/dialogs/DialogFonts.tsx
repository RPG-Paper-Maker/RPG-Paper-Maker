/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { showWarning } from '../../store';
import Flex from '../Flex';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	manager?: boolean;
};

function DialogFonts({ isOpen, setIsOpen, manager }: Props) {
	const { t } = useTranslation();

	const [isInitiating, setIsInitiating] = useState(false);
	const [fonts, setFonts] = useState<Node[]>([]);
	const [fontsAvailable, setFontsAvailable] = useState<Node[]>([]);
	const [selectedFont, setSelectedFont] = useState<Model.Font | null>(null);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);

	const dispatch = useDispatch();

	const folders = useMemo(() => [Node.create(Model.TreeMapTag.create(-1, 'Fonts'))], []);

	const initialize = async () => {
		setIsInitiating(true);
		setIsSelectedLeftList(true);
		setFonts(Node.createList(Project.current!.fonts.list));
	};

	const reset = () => {
		setSelectedFont(null);
		setFonts([]);
		setFontsAvailable([]);
	};

	const handleChangeSelectedFont = (node: Node | null) => {
		setSelectedFont((node?.content ?? null) as Model.Font | null);
	};

	const getFolder = (isBR = true, dlc = '') => Model.Font.getFolder(isBR, dlc);

	const callBackCreateAsset = (id: number, name: string, isBR = true, dlc = '') =>
		Model.Font.createFont(id, name, isBR, dlc);

	const handleListUpdated = () => {
		Project.current!.fonts.list = Node.createListFromNodes(fonts);
	};

	const handleAccept = async () => {
		if (!manager) {
			if (selectedFont === null || !isSelectedLeftList) {
				dispatch(showWarning(t('warning.asset.selection')));
				return;
			}
		}
		await Project.current!.fonts.save();
		await Project.current!.systems.saveStyleCSS();
		setIsOpen(false);
		reset();
	};

	const handleReject = async () => {
		await Project.current!.fonts.load();
		setSelectedFont(null);
		setIsOpen(false);
		reset();
	};

	useEffect(() => {
		if (isOpen) {
			initialize().catch(console.error);
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('fonts.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			initialWidth='80%'
			initialHeight='calc(100% - 50px)'
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex spacedLarge fillWidth>
				<Flex>
					<Tree
						constructorType={Model.TreeMapTag}
						list={folders}
						minWidth={TREES_MIN_WIDTH}
						cannotAdd
						cannotEdit
						cannotDragDrop
						cannotDelete
					/>
				</Flex>
				<PanelAssetsPreviewer
					assetID={-1}
					list={fonts}
					itemsAvailable={fontsAvailable}
					setItemsAvailable={setFontsAvailable}
					selectedItem={selectedFont}
					isSelectedLeftList={isSelectedLeftList}
					setIsSelectedLeftList={setIsSelectedLeftList}
					isInitiating={isInitiating}
					setIsInitiating={setIsInitiating}
					onChangeSelectedItem={handleChangeSelectedFont}
					getFolder={getFolder}
					callBackCreateAsset={callBackCreateAsset}
					onListUpdated={handleListUpdated}
					basePath={Model.Font.getLocalFolder()}
					importTypes='.ttf, .otf, .woff, .woff2'
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogFonts;
