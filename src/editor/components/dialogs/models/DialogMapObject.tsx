/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model, Scene } from '../../../Editor';
import { ELEMENT_MAP_KIND } from '../../../common';
import PanelMapObject, { PanelMapObjectRef, PlayCommandInfo } from '../../panels/PanelMapObject';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	object: Model.CommonObject;
	onAccept: () => Promise<void>;
	onPlayCommand?: (info: PlayCommandInfo, editedObject: Model.CommonObject) => void;
	onSelectCommand?: (info: PlayCommandInfo | null, editedObject: Model.CommonObject | null) => void;
	onLivePreviewCommand?: (
		info: PlayCommandInfo,
		editedObject: Model.CommonObject,
		command: Model.MapObjectCommand | null,
	) => void;
	onUpdateStateGraphics?: (state: Model.MapObjectState) => void;
};

function DialogMapObject({
	setIsOpen,
	object,
	onAccept,
	onPlayCommand,
	onSelectCommand,
	onLivePreviewCommand,
	onUpdateStateGraphics,
}: Props) {
	const { t } = useTranslation();
	const isBottomPreviewLayout = window.innerWidth <= 1000;
	const isNarrowDesktopLayout = window.innerWidth <= 1300;

	const panelMapObjectRef = useRef<PanelMapObjectRef>(null);

	const [isLoading, setIsLoading] = useState(false);

	const reset = () => {
		panelMapObjectRef.current?.reset();
	};

	const handleAccept = async () => {
		setIsLoading(true);
		panelMapObjectRef.current?.accept();
		await onAccept();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		reset();
		Scene.Map.previewOnly = true;
		const map = Scene.Map.current;
		if (map) {
			map.objectDialogActive = true;
			map.updateGridHeight(map.cursorObject.position);
			map.cursorObject.removeFromScene();
			if (map.isCursorObjectNew()) {
				map.previewObjectSquarePosition = map.cursorObject.position.clone();
				map.getMapPortionByPosition(map.previewObjectSquarePosition)?.updateObjectsGeometry();
			}
		}
		return () => {
			Scene.Map.previewOnly = false;
			const currentMap = Scene.Map.current;
			if (currentMap) {
				const previewObjectSquarePosition = currentMap.previewObjectSquarePosition;
				currentMap.previewObjectSquarePosition = null;
				if (previewObjectSquarePosition) {
					currentMap.getMapPortionByPosition(previewObjectSquarePosition)?.updateObjectsGeometry();
				}
				currentMap.heroPreviewPosition = null;
				currentMap.objectDialogActive = false;
				if (Scene.Map.currentSelectedMapElementKind === ELEMENT_MAP_KIND.OBJECT) {
					currentMap.cursorObject.addToScene();
				} else {
					currentMap.cursorObject.removeFromScene();
				}
				currentMap.syncCursorGrid();
			}
		};
	}, []);

	const handleSelectCommand = (info: PlayCommandInfo | null) => {
		if (info) {
			Scene.Map.current?.cursorObject.addToScene();
		} else {
			Scene.Map.current?.cursorObject.removeFromScene();
		}
		onSelectCommand?.(info, info ? panelMapObjectRef.current!.getEditedObject() : null);
	};

	return (
		<Dialog
			title={`${t('edit.object')}...`}
			isOpen
			className='dialogObjectEditor'
			movable={false}
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth={isBottomPreviewLayout ? '100%' : isNarrowDesktopLayout ? '66.6667%' : '50%'}
			initialHeight={isBottomPreviewLayout ? '66.6667vh' : '100%'}
			initialPlacement={isBottomPreviewLayout ? 'top' : 'right'}
			allowMapInteraction
		>
			<PanelMapObject
				object={object}
				ref={panelMapObjectRef}
				onPlayCommand={
					onPlayCommand
						? (info: PlayCommandInfo) => onPlayCommand(info, panelMapObjectRef.current!.getEditedObject())
						: undefined
				}
				onSelectCommand={onSelectCommand ? handleSelectCommand : undefined}
				onLivePreviewCommand={
					onLivePreviewCommand
						? (info: PlayCommandInfo, command: Model.MapObjectCommand | null) =>
								onLivePreviewCommand(info, panelMapObjectRef.current!.getEditedObject(), command)
						: undefined
				}
				onUpdateStateGraphics={onUpdateStateGraphics}
			/>
		</Dialog>
	);
}

export default DialogMapObject;
