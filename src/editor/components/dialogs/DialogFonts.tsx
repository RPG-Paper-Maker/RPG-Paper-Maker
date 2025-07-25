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
import { getAllFilesFromFolder, getFiles } from '../../common/Platform';
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

	const initialize = () => {
		setIsInitiating(true);
		setIsSelectedLeftList(true);
		setFonts(Node.createList(Project.current!.fonts.list));
		handleRefresh();
	};

	const reset = () => {
		setSelectedFont(null);
		setFonts([]);
		setFontsAvailable([]);
	};

	const handleChangeSelectedFont = (node: Node | null) => {
		setSelectedFont((node?.content ?? null) as Model.Font | null);
	};

	const handleRefresh = async () => {
		const files = await getAllFilesFromFolder(Model.Font.getFolder(true, ''));
		const customNames = await getFiles(Model.Font.getFolder(false, ''));
		setFontsAvailable([
			...Node.createList(
				files.map((name, index) => {
					const font = new Model.Font();
					font.id = index + 1;
					font.name = name;
					font.isBR = true;
					font.dlc = '';
					return font;
				}),
				false
			),
			...Node.createList(
				customNames.map((name, index) => {
					const font = new Model.Font();
					font.id = files.length + index + 1;
					font.name = name;
					font.isBR = false;
					font.dlc = '';
					return font;
				}),
				false
			),
		]);
	};

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
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('fonts.manager')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			initialWidth='70%'
			initialHeight='70%'
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex spacedLarge fillWidth>
				<Flex>
					<Tree
						list={folders}
						minWidth={TREES_MIN_WIDTH}
						cannotAdd
						cannotEdit
						cannotDragDrop
						cannotDelete
						doNotShowID
					/>
				</Flex>
				<PanelAssetsPreviewer
					assetID={-1}
					list={fonts}
					itemsAvailable={fontsAvailable}
					selectedItem={selectedFont}
					isSelectedLeftList={isSelectedLeftList}
					setIsSelectedLeftList={setIsSelectedLeftList}
					isInitiating={isInitiating}
					setIsInitiating={setIsInitiating}
					onChangeSelectedItem={handleChangeSelectedFont}
					onRefresh={handleRefresh}
					onListUpdated={handleListUpdated}
					basePath={Model.Font.getFolder(false, '')}
					importTypes='.ttf, .otf, .woff, .woff2'
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogFonts;
