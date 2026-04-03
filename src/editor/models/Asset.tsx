/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class Asset extends Base {
	public isBR!: boolean;
	public dlc!: string;
	public base64!: string;

	public static readonly bindings: BindingType[] = [
		['isBR', 'br', undefined, BINDING.BOOLEAN],
		['dlc', 'd', '', BINDING.STRING],
		['base64', 'base64', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Asset.bindings, ...additionnalBinding];
	}

	getPath(_local?: boolean): string {
		return '';
	}

	async getPathOrBase64(): Promise<string> {
		return this.getPath();
	}

	applyDefault(additionnalBinding: BindingType[]): void {
		super.applyDefault(Asset.getBindings(additionnalBinding));
	}

	isFolder() {
		return false;
	}

	getIcon() {
		return (
			<img
				src={`./Pictures/bullet-${this.isBR ? 'br' : this.dlc ? 'dlc' : 'custom'}.png`}
				alt='bullet'
				style={{ width: '16px', height: '16px', imageRendering: 'auto' }}
			/>
		);
	}

	copy(asset: Asset, additionnalBinding: BindingType[] = []): void {
		super.copy(asset, Asset.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Asset.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Asset.getBindings(additionnalBinding));
	}
}

export { Asset };
