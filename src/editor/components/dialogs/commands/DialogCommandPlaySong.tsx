/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, EVENT_COMMAND_KIND, SONG_KIND, Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import DialogSongsPreview from '../DialogSongsPreview';

type Props = {
	commandKind: EVENT_COMMAND_KIND;
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandPlaySong({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [songID, setSongID] = useStateNumber();
	const [dynamicSongID] = useStateDynamicValue();
	const [songOptions] = useState<Model.PlaySong>(new Model.PlaySong());
	const [isInitialized, setIsInitialized] = useState(false);

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			dynamicSongID.isActivated = Utils.initializeBoolCommand(list, iterator);
			dynamicSongID.updateCommand(list, iterator);
			setSongID(list[iterator.i++] as number);
			songOptions.volume = new DynamicValue();
			songOptions.volume.updateCommand(list, iterator);
			songOptions.isStart = Utils.initializeBoolCommand(list, iterator);
			songOptions.start = new DynamicValue();
			songOptions.start.updateCommand(list, iterator);
			songOptions.isEnd = Utils.initializeBoolCommand(list, iterator);
			songOptions.end = new DynamicValue();
			songOptions.end.updateCommand(list, iterator);
		} else {
			setSongID(-1);
			dynamicSongID.isActivated = false;
			dynamicSongID.updateToDefaultNumber(-1);
			songOptions.volume = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 100);
			songOptions.isStart = false;
			songOptions.start = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			songOptions.isEnd = false;
			songOptions.end = DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
		}
		setIsInitialized(true);
	};

	const getKind = () => {
		switch (commandKind) {
			case EVENT_COMMAND_KIND.PLAY_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_BATTLE_MUSIC:
			case EVENT_COMMAND_KIND.CHANGE_VICTORY_MUSIC:
				return SONG_KIND.MUSIC;
			case EVENT_COMMAND_KIND.PLAY_BACKGROUND_SOUND:
				return SONG_KIND.BACKGROUND_SOUND;
			case EVENT_COMMAND_KIND.PLAY_SOUND:
				return SONG_KIND.SOUND;
			case EVENT_COMMAND_KIND.PLAY_MUSIC_EFFECT:
				return SONG_KIND.MUSIC_EFFECT;
			default:
				return SONG_KIND.MUSIC;
		}
	};

	const handleAccept = async (song: Model.Song) => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(Utils.boolToNum(dynamicSongID.isActivated));
		dynamicSongID.getCommand(newList);
		newList.push(song.id);
		songOptions.volume.getCommand(newList);
		newList.push(Utils.boolToNum(songOptions.isStart));
		songOptions.start.getCommand(newList);
		newList.push(Utils.boolToNum(songOptions.isEnd));
		songOptions.end.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		} else {
			setIsInitialized(false);
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<DialogSongsPreview
			title={t(Model.MapObjectCommand.getCommandName(commandKind))}
			isOpen={isOpen && isInitialized}
			setIsOpen={setIsOpen}
			songID={songID}
			dynamicSongID={dynamicSongID}
			kind={getKind()}
			onAccept={handleAccept}
			onReject={handleReject}
			songOptions={songOptions}
			displayOptions
			active
		/>
	);
}

export default DialogCommandPlaySong;
