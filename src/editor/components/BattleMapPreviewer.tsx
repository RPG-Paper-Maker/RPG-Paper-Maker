/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import * as THREE from 'three/webgpu';
import { Constants, Paths } from '../common';
import { readJSON } from '../common/Platform';
import { Battler } from '../core/Battler';
import { Project } from '../core/Project';
import { Manager, Model, Scene } from '../Editor';
import Loader from './Loader';

const WIDTH = 640;
const HEIGHT = 480;

const createOverlayLine = (x1: number, y1: number, x2: number, y2: number, color = 0xffffff) => {
	const material = new THREE.LineBasicMaterial({ color });
	const points = [new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)];
	const geometry = new THREE.BufferGeometry().setFromPoints(points);
	return new THREE.Line(geometry, material);
};

type Props = {
	monsters: Model.TroopMonster[];
	triggerUpdate?: boolean;
	disabled?: boolean;
};

function BattleMapPreviewer({ monsters, triggerUpdate, disabled = false }: Props) {
	const [firstLoading, setFirstLoading] = useState(false);
	const [dataURL, setDataURL] = useState('');

	const clearMap = () => {
		if (Scene.Map.currentBattle) {
			Scene.Map.currentBattle.needsClose = true;
			Scene.Map.currentBattle.close();
			Scene.Map.currentBattle = null;
			setDataURL('');
		}
	};

	const initializeMap = async () => {
		setFirstLoading(true);
		await Manager.GL.initStaticRender();
		Manager.GL.staticRender.shadowMap.enabled = true;
		Manager.GL.staticRender.setSize(WIDTH, HEIGHT);
		const battleMap = Project.current!.battleSystem.battleMaps[0];
		const tag = Model.TreeMapTag.create(battleMap.idMap, '');
		tag.cursorPosition = battleMap.position.clone();
		const mapProperties = new Model.Map();
		const json = await readJSON(
			Paths.join(Project.current!.getPathMaps(), Model.Map.generateMapName(tag.id), Paths.FILE_MAP_INFOS),
		);
		if (json) {
			mapProperties.read(json);
			const cameraProperties = Model.Base.getByID(
				Project.current!.systems.cameraProperties,
				mapProperties.cameraPropertiesID.getFixNumberValue(),
			) as Model.CameraProperty | null;
			if (cameraProperties) {
				tag.cameraDistance =
					cameraProperties.distance.getFixNumberValue() * (Project.SQUARE_SIZE / Constants.BASE_SQUARE_SIZE);
				tag.cameraHorizontalAngle = cameraProperties.horizontalAngle.getFixNumberValue();
				tag.cameraVerticalAngle = cameraProperties.verticalAngle.getFixNumberValue();
			}
		}
		Scene.Map.currentBattle = new Scene.Map(tag, false, false, true);
		Scene.Map.currentBattle.loading = true;
		await Scene.Map.currentBattle.load();
		await Scene.Map.currentBattle.loadBattlers();
		Scene.Map.currentBattle.camera.perspectiveCamera.aspect = WIDTH / HEIGHT;
		Scene.Map.currentBattle.camera.perspectiveCamera.updateProjectionMatrix();
		Scene.Map.currentBattle.update(true);
		render();
		setFirstLoading(false);
	};

	const update = async () => {
		if (Scene.Map.currentBattle) {
			Battler.clearScene();
			await Scene.Map.currentBattle.loadMonstersBattlers();
			render();
		}
	};

	const render = () => {
		Scene.Map.currentBattle!.update();
		Manager.GL.staticRender.render(
			Scene.Map.currentBattle!.scene,
			Scene.Map.currentBattle!.camera.perspectiveCamera,
		);
		const overlayScene = new THREE.Scene();
		const overlayCamera = new THREE.OrthographicCamera(-WIDTH / 2, WIDTH / 2, HEIGHT / 2, -HEIGHT / 2, 0, 10);
		const hLine = createOverlayLine(-WIDTH / 2, 0, WIDTH / 2, 0, 0xff0000);
		const vLine = createOverlayLine(0, -HEIGHT / 2, 0, HEIGHT / 2, 0x00ff00);
		overlayScene.add(hLine);
		overlayScene.add(vLine);
		Manager.GL.staticRender.autoClear = false;
		Manager.GL.staticRender.clearDepth();
		Manager.GL.staticRender.render(overlayScene, overlayCamera);
		Manager.GL.staticRender.autoClear = true;
		setDataURL(Manager.GL.staticRender.domElement.toDataURL('image/png'));
	};

	useEffect(() => {
		initializeMap().catch(console.error);
		return () => {
			clearMap();
		};
	}, []);

	useEffect(() => {
		Battler.monsters = monsters;
		update().catch(console.error);
	}, [monsters, triggerUpdate]);

	return (
		<>
			<Loader isLoading={firstLoading} />
			{dataURL && !disabled && (
				<img src={dataURL} style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }} alt='trooppreview' />
			)}
			{disabled && <div style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }} />}
		</>
	);
}

export default BattleMapPreviewer;
