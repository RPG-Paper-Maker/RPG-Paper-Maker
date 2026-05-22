/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SONG_KIND } from '../../../common';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogTerrainSoundItem({ setIsOpen, model, onAccept, onReject }: Props) {
	const terrainSoundItem = model as Model.TerrainSoundItem;

	const { t } = useTranslation();

	const playSoundSelectorRef = useRef<PlaySongSelectorRef>(null);

	const initialize = () => {
		playSoundSelectorRef.current?.initialize(terrainSoundItem.sound);
	};

	const handleAccept = async () => {
		playSoundSelectorRef.current?.accept(terrainSoundItem.sound);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('sound')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex spaced centerV>
				<div>{t('sound')}:</div>
				<PlaySongSelector songKind={SONG_KIND.SOUND} ref={playSoundSelectorRef} />
			</Flex>
		</Dialog>
	);
}

export default DialogTerrainSoundItem;
