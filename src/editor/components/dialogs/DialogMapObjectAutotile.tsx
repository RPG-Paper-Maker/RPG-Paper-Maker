/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND } from '../../common';
import { Rectangle } from '../../core/Rectangle';
import Flex from '../Flex';
import PanelSpecialElementsSelection from '../panels/PanelSpecialElementsSelection';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	autotileID: number;
	rectangle: Rectangle;
	onAccept: (autotileID: number, rectangle: Rectangle) => void;
};

function DialogMapObjectAutotile({ setIsOpen, autotileID, rectangle, onAccept }: Props) {
	const { t } = useTranslation();
	const [selectedID, setSelectedID] = useState(autotileID);
	const [selectedRectangle, setSelectedRectangle] = useState(rectangle.clone());

	const handleSelect = (id: number) => {
		if (id !== selectedID) {
			setSelectedID(id);
			setSelectedRectangle(new Rectangle());
		}
	};

	const handleAccept = () => {
		onAccept(selectedID, selectedRectangle);
		setIsOpen(false);
	};
	return (
		<Dialog
			title={`${t('autotile')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={() => setIsOpen(false)} onOK={handleAccept} />}
			onClose={() => setIsOpen(false)}
			initialWidth='500px'
			initialHeight='500px'
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex one>
				<PanelSpecialElementsSelection
					kind={PICTURE_KIND.AUTOTILES}
					onSelect={handleSelect}
					selectedID={selectedID}
					onUpdateAutotileRect={setSelectedRectangle}
					defaultAutotileRect={selectedRectangle}
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogMapObjectAutotile;
