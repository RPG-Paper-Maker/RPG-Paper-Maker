/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, SONG_KIND } from '../common';
import { Model } from '../Editor';
import useStateDynamicValue from '../hooks/useStateDynamicValue';
import useStateNumber from '../hooks/useStateNumber';
import AssetSelector, { ASSET_SELECTOR_TYPE } from './AssetSelector';
import Flex from './Flex';
import RadioButton from './RadioButton';
import RadioGroup from './RadioGroup';
import TooltipInformation from './TooltipInformation';

const SELECTION_SONG = { ASSET: 0, KEEP_CURRENT: 1 };

export interface PlaySongSelectorRef {
	initialize: (song: Model.PlaySong) => void;
	accept: (song: Model.PlaySong) => void;
}

type Props = {
	songKind: SONG_KIND;
	disabled?: boolean;
	dynamicUpdate?: boolean;
	showKeepCurrent?: boolean;
};

const PlaySongSelector = forwardRef(
	({ songKind, disabled = false, dynamicUpdate = false, showKeepCurrent = false }: Props, ref) => {
		const { t } = useTranslation();

		const [id, setID] = useStateNumber();
		const [dynamicID, setDynamicID] = useStateDynamicValue();
		const [songOptions, setSongOptions] = useState(Model.PlaySong.createPlaySong(songKind));
		const [songSelection, setSongSelection] = useState(SELECTION_SONG.ASSET);

		const initialize = (song: Model.PlaySong) => {
			setSongSelection(song.isKeepCurrent ? SELECTION_SONG.KEEP_CURRENT : SELECTION_SONG.ASSET);
			setID(song.id);
			if (dynamicUpdate) {
				setDynamicID(song.songID);
				setSongOptions(song);
			} else {
				dynamicID.copy(song.songID);
				songOptions.copy(song);
			}
		};

		const accept = (song: Model.PlaySong) => {
			song.copy(songOptions);
			song.isKeepCurrent = songSelection === SELECTION_SONG.KEEP_CURRENT;
			song.id = dynamicID.isActivated ? -1 : id;
			if (dynamicID.isActivated) {
				song.songID.copy(dynamicID);
			} else {
				song.songID.kind = DYNAMIC_VALUE_KIND.NUMBER;
				song.songID.value = id;
				song.songID.isActivated = false;
			}
		};

		useImperativeHandle(ref, () => ({
			initialize,
			accept,
		}));

		const assetSelector = (
			<AssetSelector
				selectionType={ASSET_SELECTOR_TYPE.SONGS}
				kind={songKind}
				selectedID={id}
				onChange={setID}
				selectedDynamic={dynamicID}
				songOptions={songOptions}
				disabled={disabled || (showKeepCurrent && songSelection === SELECTION_SONG.KEEP_CURRENT)}
				active
				disableParametersProperties
			/>
		);

		if (!showKeepCurrent) {
			return assetSelector;
		}

		return (
			<RadioGroup selected={songSelection} onChange={setSongSelection}>
				<Flex column spaced>
					<RadioButton value={SELECTION_SONG.KEEP_CURRENT}>
					<Flex spaced centerV>
						{t('keep.current')}
						<TooltipInformation text={t('keep.current.description')} />
					</Flex>
				</RadioButton>
					<Flex spaced centerV>
						<RadioButton value={SELECTION_SONG.ASSET} />
						{assetSelector}
					</Flex>
				</Flex>
			</RadioGroup>
		);
	},
);

PlaySongSelector.displayName = 'PlaySongSelector';

export default PlaySongSelector;
