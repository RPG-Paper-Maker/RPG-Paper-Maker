/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Model } from '../Editor';
import { BINDING, JSONType, Paths } from '../common';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

const { t } = i18next;

class SpecialElements extends Serializable {
	public autotiles!: Model.Autotile[];
	public walls!: Model.SpecialElement[];
	public mountains!: Model.Mountain[];
	public objects3D!: Model.Object3D[];

	public static readonly bindings: BindingType[] = [
		['autotiles', 'autotiles', undefined, BINDING.LIST, Model.Autotile],
		['walls', 'walls', undefined, BINDING.LIST, Model.SpecialElement],
		['mountains', 'm', undefined, BINDING.LIST, Model.Mountain],
		['objects3D', 'o', undefined, BINDING.LIST, Model.Object3D],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...SpecialElements.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SPECIAL_ELEMENTS);
	}

	getAutotileByID(id: number): Model.Autotile {
		return this.autotiles.find((autotile) => autotile.id === id)!;
	}

	getWallByID(id: number): Model.SpecialElement {
		return this.walls.find((wall) => wall.id === id)!;
	}

	getMountainByID(id: number): Model.Mountain {
		return this.mountains.find((mountain) => mountain.id === id)!;
	}

	getObject3DByID(id: number): Model.Object3D {
		return this.objects3D.find((object) => object.id === id)!;
	}

	translateDefaults(): void {
		this.autotiles[0].name = t('general');
		this.autotiles[1].name = t('water');
		this.autotiles[2].name = t('haunted');
		this.autotiles[3].name = t('snow');
		this.autotiles[4].name = t('lava');
		this.walls[0].name = t('woods.wall');
		this.walls[1].name = t('bush');
		this.walls[2].name = t('bush.haunted');
		this.walls[3].name = t('bush.snow');
		this.walls[4].name = t('bridge.string');
		this.walls[5].name = t('brick');
		this.walls[6].name = t('hedge');
		this.walls[7].name = t('sandstone');
		this.walls[8].name = t('big.sandstone');
		this.walls[9].name = t('hedge.snow');
		this.walls[10].name = t('inside.door.opened');
		this.walls[11].name = t('inside.1');
		this.walls[12].name = t('inside.2');
		this.walls[13].name = t('inside.3');
		this.walls[14].name = t('wood');
		this.walls[15].name = t('sewers');
		this.walls[16].name = t('cave');
		this.objects3D[0].name = t('tent');
		this.objects3D[1].name = t('small.chest');
		this.objects3D[2].name = t('small.chest.opened');
		this.objects3D[3].name = t('small.chest.blue');
		this.objects3D[4].name = t('small.chest.blue.opened');
		this.objects3D[5].name = t('small.chest.green');
		this.objects3D[6].name = t('small.chest.green.opened');
		this.objects3D[7].name = t('small.chest.red');
		this.objects3D[8].name = t('small.chest.red.opened');
		this.objects3D[9].name = t('chest.box');
		this.objects3D[10].name = t('chest.opened.1');
		this.objects3D[11].name = t('chest.opened.2');
		this.objects3D[12].name = t('small.log');
		this.objects3D[13].name = t('log');
		this.objects3D[14].name = t('big.log');
		this.objects3D[15].name = t('picnic.table.stone');
		this.objects3D[16].name = t('picnic.table.wood');
		this.objects3D[17].name = t('woodfence.1');
		this.objects3D[18].name = t('woodfence.2');
		this.objects3D[19].name = t('woodfence.3');
		this.objects3D[20].name = t('woodfence.snow.1');
		this.objects3D[21].name = t('woodfence.snow.2');
		this.objects3D[22].name = t('woodfence.snow.3');
		this.objects3D[23].name = t('brick.building');
		this.objects3D[24].name = t('big.brick.building');
		this.objects3D[25].name = t('stone.building');
		this.objects3D[26].name = t('big.stone.building');
		this.objects3D[27].name = t('wood.building');
		this.objects3D[28].name = t('big.wood.building');
		this.objects3D[29].name = t('brick.chimney');
		this.objects3D[30].name = t('stone.chimney');
		this.objects3D[31].name = t('brick.blue.house');
		this.objects3D[32].name = t('brick.blue.house.snow');
		this.objects3D[33].name = t('brick.green.house');
		this.objects3D[34].name = t('brick.green.house.snow');
		this.objects3D[35].name = t('brick.red.house');
		this.objects3D[36].name = t('brick.red.house.snow');
		this.objects3D[37].name = t('stone.blue.house');
		this.objects3D[38].name = t('stone.blue.house.snow');
		this.objects3D[39].name = t('stone.green.house');
		this.objects3D[40].name = t('stone.green.house.snow');
		this.objects3D[41].name = t('stone.red.house');
		this.objects3D[42].name = t('stone.red.house.snow');
		this.objects3D[43].name = t('wood.blue.house');
		this.objects3D[44].name = t('wood.blue.house.snow');
		this.objects3D[45].name = t('wood.green.house');
		this.objects3D[46].name = t('wood.green.house.snow');
		this.objects3D[47].name = t('wood.red.house');
		this.objects3D[48].name = t('wood.red.house.snow');
		this.objects3D[49].name = t('small.shop.stand.black');
		this.objects3D[50].name = t('small.shop.stand.blue');
		this.objects3D[51].name = t('small.shop.stand.green');
		this.objects3D[52].name = t('small.shop.stand.red');
		this.objects3D[53].name = t('small.shop.stand.white');
		this.objects3D[54].name = t('shop.stand.black');
		this.objects3D[55].name = t('shop.stand.black.snow');
		this.objects3D[56].name = t('shop.stand.blue');
		this.objects3D[57].name = t('shop.stand.blue.snow');
		this.objects3D[58].name = t('shop.stand.green');
		this.objects3D[59].name = t('shop.stand.green.snow');
		this.objects3D[60].name = t('shop.stand.red');
		this.objects3D[61].name = t('shop.stand.red.snow');
		this.objects3D[62].name = t('shop.stand.white');
		this.objects3D[63].name = t('shop.stand.white.snow');
		this.objects3D[64].name = t('bench.stone');
		this.objects3D[65].name = t('bench.wood');
		this.objects3D[66].name = t('bus');
		this.objects3D[67].name = t('car.black');
		this.objects3D[68].name = t('car.blue');
		this.objects3D[69].name = t('car.green');
		this.objects3D[70].name = t('car.red');
		this.objects3D[71].name = t('car.white');
		this.objects3D[72].name = t('bed.black');
		this.objects3D[73].name = t('bed.blue');
		this.objects3D[74].name = t('bed.green');
		this.objects3D[75].name = t('bed.red');
		this.objects3D[76].name = t('bed.white');
		this.objects3D[77].name = t('big.bed.black');
		this.objects3D[78].name = t('big.bed.blue');
		this.objects3D[79].name = t('big.bed.green');
		this.objects3D[80].name = t('big.bed.red');
		this.objects3D[81].name = t('big.bed.white');
		this.objects3D[82].name = t('dresser');
		this.objects3D[83].name = t('sofa.black');
		this.objects3D[84].name = t('sofa.blue');
		this.objects3D[85].name = t('sofa.green');
		this.objects3D[86].name = t('sofa.red');
		this.objects3D[87].name = t('sofa.white');
		this.objects3D[88].name = t('small.tv');
		this.objects3D[89].name = t('tv');
		this.objects3D[90].name = t('small.table');
		this.objects3D[91].name = t('table');
		this.objects3D[92].name = t('big.table');
		this.objects3D[93].name = t('chair.blue');
		this.objects3D[94].name = t('chair.green');
		this.objects3D[95].name = t('chair.red');
		this.objects3D[96].name = t('chair.white');
		this.objects3D[97].name = t('small.bookshelf');
		this.objects3D[98].name = t('bookshelf');
		this.objects3D[99].name = t('fridge');
		this.objects3D[100].name = t('cabinet.1');
		this.objects3D[101].name = t('cabinet.2');
		this.objects3D[102].name = t('cabinet.3');
		this.objects3D[103].name = t('sink');
		this.objects3D[104].name = t('bath');
		this.objects3D[105].name = t('toilet');
		this.objects3D[106].name = t('crate');
		this.objects3D[107].name = t('barrel');
		this.objects3D[108].name = t('barrel.closed');
		this.objects3D[109].name = t('barrel.fruits');
		this.objects3D[110].name = t('barrel.vegetables');
		this.objects3D[111].name = t('cube.cobblestone');
		this.objects3D[112].name = t('minecart');
		this.mountains[0].name = t('grass');
		this.mountains[1].name = t('haunted');
		this.mountains[2].name = t('snow');
		this.mountains[3].name = t('desert');
		this.mountains[4].name = t('cave');
		this.mountains[5].name = t('sidewalk');
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, SpecialElements.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, SpecialElements.getBindings(additionnalBinding));
	}
}

export { SpecialElements };
