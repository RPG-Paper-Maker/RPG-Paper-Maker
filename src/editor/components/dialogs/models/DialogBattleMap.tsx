/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { initializeAcceptRef } from '../../../common';
import { Model } from '../../../Editor';
import PanelSelectMapPosition from '../../panels/PanelSelectMapPosition';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogBattleMap({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const battleMap = model as Model.BattleMap;

	const { t } = useTranslation();

	const panelSelectMapPositionRef = useRef<initializeAcceptRef>(null);

	const initialize = () => {
		panelSelectMapPositionRef.current!.initialize();
	};

	const handleAcceptPanel = (newMapID: number, newX: number, newY: number, newYp: number, newZ: number) => {
		battleMap.idMap = newMapID;
		battleMap.position.x = newX;
		battleMap.position.y = newY;
		battleMap.position.yPixels = newYp;
		battleMap.position.z = newZ;
	};

	const handleAccept = async () => {
		if (panelSelectMapPositionRef.current!.accept()) {
			onAccept();
			setIsOpen(false);
		}
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.battle.map')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='70%'
			initialHeight='70%'
		>
			<PanelSelectMapPosition
				ref={panelSelectMapPositionRef}
				defaultMapID={battleMap.idMap}
				defaultX={battleMap.position?.x}
				defaultY={battleMap.position?.y}
				defaultYp={battleMap.position?.yPixels}
				defaultZ={battleMap.position?.z}
				onAccept={handleAcceptPanel}
			/>
		</Dialog>
	);
}

export default DialogBattleMap;
