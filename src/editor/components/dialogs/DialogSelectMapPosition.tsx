/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { initializeAcceptRef } from '../../common';
import PanelSelectMapPosition from '../panels/PanelSelectMapPosition';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	defaultMapID: number;
	defaultX: number;
	defaultY: number;
	defaultYp: number;
	defaultZ: number;
	onAccept: (newMapID: number, newX: number, newY: number, newYp: number, newZ: number) => void;
};

function DialogSelectMapPosition({
	setIsOpen,
	defaultMapID,
	defaultX,
	defaultY,
	defaultYp,
	defaultZ,
	onAccept,
}: Props) {
	const { t } = useTranslation();

	const panelSelectMapPositionRef = useRef<initializeAcceptRef>(null);

	const initialize = () => {
		panelSelectMapPositionRef.current!.initialize();
	};

	const handleAccept = () => {
		if (panelSelectMapPositionRef.current!.accept()) {
			setIsOpen(false);
		}
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<>
			<Dialog
				title={`${t('select.map.position')}...`}
				isOpen
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				initialWidth='70%'
				initialHeight='70%'
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
				<PanelSelectMapPosition
					ref={panelSelectMapPositionRef}
					defaultMapID={defaultMapID}
					defaultX={defaultX}
					defaultY={defaultY}
					defaultYp={defaultYp}
					defaultZ={defaultZ}
					onAccept={onAccept}
				/>
			</Dialog>
		</>
	);
}

export default DialogSelectMapPosition;
