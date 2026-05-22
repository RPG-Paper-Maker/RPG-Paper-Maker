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
import DialogTerrainSound from '../components/dialogs/models/DialogTerrainSound';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { PlaySong } from './PlaySong';
import { TerrainSoundItem } from './TerrainSoundItem';

class TerrainSound extends Base {
	public static type = 'TerrainSound';
	public terrain!: number;
	public sounds!: TerrainSoundItem[];

	public static bindings: BindingType[] = [
		['terrain', 'ter', 0, BINDING.NUMBER],
		['sounds', 'sl', [], BINDING.LIST, TerrainSoundItem],
	];

	static getTreeHeader(): string[] {
		return ['terrain', 'sounds'];
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(TerrainSound.getBindings(additionnalBinding));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogTerrainSound {...options} />;
	}

	toStrings(): string[] {
		return [Base.STRING_START + this.terrain, this.sounds.map((sound) => sound.toStrings().join(' ')).join(', ')];
	}

	copy(terrainSound: TerrainSound): void {
		super.copy(terrainSound, TerrainSound.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TerrainSound.getBindings(additionnalBinding));
		const legacySound = json.s as JSONType | undefined;
		if (legacySound && this.sounds.length === 0) {
			const item = new TerrainSoundItem();
			item.applyDefault();
			item.sound = new PlaySong();
			item.sound.read(legacySound);
			item.sound.kind = SONG_KIND.SOUND;
			this.sounds.push(item);
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TerrainSound.getBindings(additionnalBinding));
	}
}

export { TerrainSound };
