/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, JSONType, SONG_KIND } from '../common';
import DialogTerrainSoundItem from '../components/dialogs/models/DialogTerrainSoundItem';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { PlaySong } from './PlaySong';

class TerrainSoundItem extends Base {
	public static type = 'TerrainSoundItem';
	public sound!: PlaySong;

	public static bindings: BindingType[] = [['sound', 's', undefined, BINDING.OBJECT, PlaySong]];

	static getTreeHeader(): string[] {
		return ['sound'];
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(TerrainSoundItem.getBindings(additionnalBinding));
		this.sound = PlaySong.createPlaySong(SONG_KIND.SOUND);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogTerrainSoundItem {...options} />;
	}

	toStrings(): string[] {
		return [
			this.sound?.songID.isActivated
				? Base.STRING_START + this.sound.songID.toString(Project.current!.songs.getList(SONG_KIND.SOUND))
				: Project.current!.songs.getByID(SONG_KIND.SOUND, this.sound?.id ?? -1).toStringNameID(),
		];
	}

	copy(terrainSoundItem: TerrainSoundItem): void {
		super.copy(terrainSoundItem, TerrainSoundItem.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TerrainSoundItem.getBindings(additionnalBinding));
		if (!this.sound) {
			this.sound = PlaySong.createPlaySong(SONG_KIND.SOUND);
		}
		this.sound.kind = SONG_KIND.SOUND;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TerrainSoundItem.getBindings(additionnalBinding));
	}
}

export { TerrainSoundItem };
