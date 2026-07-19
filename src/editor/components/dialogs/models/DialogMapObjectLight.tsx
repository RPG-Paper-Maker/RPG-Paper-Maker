/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Base } from '../../../models/Base';
import type { MapObjectLight } from '../../../models/MapObjectLight';
import PanelMapObjectLight from '../../panels/PanelMapObjectLight';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Base;
	onAccept: () => void;
	onReject?: () => void;
	onModelLivePreview?: (model: Base | null) => void;
};

function DialogMapObjectLight({ setIsOpen, model, onAccept, onReject, onModelLivePreview }: Props) {
	const light = model as MapObjectLight;
	const { t } = useTranslation();
	const originalLight = useRef(light.clone() as MapObjectLight);
	const [, setRevision] = useState(0);
	const preview = () => {
		setRevision((value) => value + 1);
		onModelLivePreview?.(light);
	};

	useEffect(() => {
		preview();
	}, []);

	const accept = () => {
		onAccept();
		setIsOpen(false);
	};

	const reject = () => {
		light.copy(originalLight.current);
		onModelLivePreview?.(null);
		onReject?.();
		setIsOpen(false);
	};

	return (
		<Dialog
			title={`${t('light')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={reject} onOK={accept} />}
			onClose={reject}
			initialHeight='400px'
		>
			<PanelMapObjectLight light={light} onChange={preview} />
		</Dialog>
	);
}

export default DialogMapObjectLight;
