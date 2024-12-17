/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useState } from 'react';
import { DYNAMIC_VALUE_KIND, SONG_KIND } from '../common';
import { Model } from '../Editor';
import useStateDynamicValue from '../hooks/useStateDynamicValue';
import useStateNumber from '../hooks/useStateNumber';
import AssetSelector, { ASSET_SELECTOR_TYPE } from './AssetSelector';

export interface PlaySongSelectorRef {
	initialize: (song: Model.PlaySong) => void;
	accept: (song: Model.PlaySong) => void;
}

type Props = {
	songKind: SONG_KIND;
};

const PlaySongSelector = forwardRef(({ songKind }: Props, ref) => {
	const [id, setID] = useStateNumber();
	const [dynamicID] = useStateDynamicValue();
	const [songOptions] = useState(Model.PlaySong.createPlaySong(songKind));

	const initialize = (song: Model.PlaySong) => {
		setID(song.id);
		dynamicID.copy(song.songID);
		songOptions.copy(song);
	};

	const accept = (song: Model.PlaySong) => {
		song.copy(songOptions);
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

	return (
		<AssetSelector
			selectionType={ASSET_SELECTOR_TYPE.SONGS}
			kind={songKind}
			selectedID={id}
			onChange={setID}
			selectedDynamic={dynamicID}
			songOptions={songOptions}
			active
		/>
	);
});

export default PlaySongSelector;
