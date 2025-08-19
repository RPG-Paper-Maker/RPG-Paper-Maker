/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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

	public static readonly bindings: BindingType[] = [
		['isBR', 'br', undefined, BINDING.BOOLEAN],
		['dlc', 'd', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Asset.bindings, ...additionnalBinding];
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
				src={`./Pictures/bullet-${this.isBR ? 'br' : 'custom'}.png`}
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
