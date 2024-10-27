/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, PICTURE_KIND, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandSwitchTexture({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isTilesetID, setIsTilesetID] = useStateBool();
	const [tilesetID] = useStateDynamicValue();
	const [newTilesetID] = useStateDynamicValue();
	const [isAutotileID, setIsAutotileID] = useStateBool();
	const [autotileID] = useStateDynamicValue();
	const [newAutotileID] = useStateDynamicValue();
	const [iswallID, setIsWallID] = useStateBool();
	const [wallID] = useStateDynamicValue();
	const [newWallID] = useStateDynamicValue();
	const [isObject3DID, setIsObject3DID] = useStateBool();
	const [object3DID] = useStateDynamicValue();
	const [newObject3DID] = useStateDynamicValue();
	const [isMountainID, setIsMountainID] = useStateBool();
	const [mountainID] = useStateDynamicValue();
	const [newMountainID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		tilesetID.updateToDefaultDatabase();
		newTilesetID.updateToDefaultNumber(-1);
		autotileID.updateToDefaultDatabase();
		newAutotileID.updateToDefaultNumber(-1);
		wallID.updateToDefaultDatabase();
		newWallID.updateToDefaultNumber(-1);
		object3DID.updateToDefaultDatabase();
		newObject3DID.updateToDefaultNumber(-1);
		mountainID.updateToDefaultDatabase();
		newMountainID.updateToDefaultNumber(-1);
		if (list) {
			const iterator = Utils.generateIterator();
			let checked = Utils.initializeBoolCommand(list, iterator);
			setIsTilesetID(checked);
			if (checked) {
				tilesetID.updateCommand(list, iterator);
				newTilesetID.updateCommand(list, iterator, true);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsAutotileID(checked);
			if (checked) {
				autotileID.updateCommand(list, iterator);
				newAutotileID.updateCommand(list, iterator, true);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsWallID(checked);
			if (checked) {
				wallID.updateCommand(list, iterator);
				newWallID.updateCommand(list, iterator, true);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsObject3DID(checked);
			if (checked) {
				object3DID.updateCommand(list, iterator);
				newObject3DID.updateCommand(list, iterator, true);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsMountainID(checked);
			if (checked) {
				mountainID.updateCommand(list, iterator);
				newMountainID.updateCommand(list, iterator, true);
			}
		} else {
			setIsTilesetID(false);
			setIsAutotileID(false);
			setIsWallID(false);
			setIsObject3DID(false);
			setIsMountainID(false);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(Utils.boolToNum(isTilesetID));
		if (isTilesetID) {
			tilesetID.getCommand(newList);
			newTilesetID.getCommand(newList, true);
		}
		newList.push(Utils.boolToNum(isAutotileID));
		if (isAutotileID) {
			autotileID.getCommand(newList);
			newAutotileID.getCommand(newList, true);
		}
		newList.push(Utils.boolToNum(iswallID));
		if (iswallID) {
			wallID.getCommand(newList);
			newWallID.getCommand(newList, true);
		}
		newList.push(Utils.boolToNum(isObject3DID));
		if (isObject3DID) {
			object3DID.getCommand(newList);
			newObject3DID.getCommand(newList, true);
		}
		newList.push(Utils.boolToNum(isMountainID));
		if (isMountainID) {
			mountainID.getCommand(newList);
			newMountainID.getCommand(newList, true);
		}
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.SWITCH_TEXTURE, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('switch.texture')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>
					<Checkbox isChecked={isTilesetID} onChange={setIsTilesetID}>
						{t('tileset.id')}
					</Checkbox>
				</Label>
				<Value>
					<Flex spaced>
						<DynamicValueSelector
							value={tilesetID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.tilesets.list}
							disabled={!isTilesetID}
						/>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.TILESETS}
							selectedDynamic={newTilesetID}
							disabled={!isTilesetID}
							active
						/>
					</Flex>
				</Value>
				<Label>
					<Checkbox isChecked={isAutotileID} onChange={setIsAutotileID}>
						{t('autotile.id')}
					</Checkbox>
				</Label>
				<Value>
					<Flex spaced>
						<DynamicValueSelector
							value={autotileID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.specialElements.autotiles}
							disabled={!isAutotileID}
						/>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.AUTOTILES}
							selectedDynamic={newAutotileID}
							disabled={!isAutotileID}
							active
						/>
					</Flex>
				</Value>
				<Label>
					<Checkbox isChecked={iswallID} onChange={setIsWallID}>
						{t('wall.id')}
					</Checkbox>
				</Label>
				<Value>
					<Flex spaced>
						<DynamicValueSelector
							value={wallID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.specialElements.walls}
							disabled={!iswallID}
						/>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.WALLS}
							selectedDynamic={newWallID}
							disabled={!iswallID}
							active
						/>
					</Flex>
				</Value>
				<Label>
					<Checkbox isChecked={isObject3DID} onChange={setIsObject3DID}>
						{t('object.3d.id')}
					</Checkbox>
				</Label>
				<Value>
					<Flex spaced>
						<DynamicValueSelector
							value={object3DID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.specialElements.objects3D}
							disabled={!isObject3DID}
						/>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.OBJECTS_3D}
							selectedDynamic={newObject3DID}
							disabled={!isObject3DID}
							active
						/>
					</Flex>
				</Value>
				<Label>
					<Checkbox isChecked={isMountainID} onChange={setIsMountainID}>
						{t('mountain.id')}
					</Checkbox>
				</Label>
				<Value>
					<Flex spaced>
						<DynamicValueSelector
							value={mountainID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.specialElements.mountains}
							disabled={!isMountainID}
						/>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.MOUNTAINS}
							selectedDynamic={newMountainID}
							disabled={!isMountainID}
							active
						/>
					</Flex>
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogCommandSwitchTexture;
