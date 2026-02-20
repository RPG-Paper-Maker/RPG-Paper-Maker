/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import PanelSelectionHero, { PanelSelectionHeroRef } from '../../panels/PanelSelectionHero';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandChangeBattlerGraphics({
	commandKind,

	setIsOpen,
	list,
	onAccept,
	onReject,
}: CommandProps) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>(null);

	const [isFaceset, setIsFaceset] = useStateBool();
	const [facesetID] = useStateDynamicValue();
	const [facesetIndexX, setFacesetIndexX] = useStateNumber();
	const [facesetIndexY, setFacesetIndexY] = useStateNumber();
	const [isBattler, setIsBattler] = useStateBool();
	const [battlerID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		facesetID.updateToNone();
		let fx = 0;
		let fy = 0;
		battlerID.updateToNone();
		if (list) {
			const iterator = Utils.generateIterator();
			panelSelectionHeroRef.current?.initialize(list, iterator);
			let checked = Utils.initializeBoolCommand(list, iterator);
			setIsFaceset(checked);
			if (checked) {
				facesetID.updateCommand(list, iterator, true);
				fx = list[iterator.i++] as number;
				fy = list[iterator.i++] as number;
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsBattler(checked);
			if (checked) {
				battlerID.updateCommand(list, iterator, true);
			}
		} else {
			panelSelectionHeroRef.current?.initialize();
		}
		setFacesetIndexX(fx);
		setFacesetIndexY(fy);
		setTrigger((v) => !v);
	};

	const handleChangeFaceset = (id: number, indexX: number, indexY: number) => {
		setFacesetIndexX(indexX);
		setFacesetIndexY(indexY);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		panelSelectionHeroRef.current?.getCommand(newList);
		newList.push(Utils.boolToNum(isFaceset));
		if (isFaceset) {
			facesetID.getCommand(newList, true);
			newList.push(facesetIndexX);
			newList.push(facesetIndexY);
		}
		newList.push(Utils.boolToNum(isBattler));
		if (isBattler) {
			battlerID.getCommand(newList, true);
		}
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('change.battler.graphics')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<PanelSelectionHero ref={panelSelectionHeroRef} isEnemy />
				<Form>
					<Label>
						<Checkbox isChecked={isFaceset} onChange={setIsFaceset}>
							{t('faceset')}
						</Checkbox>
					</Label>
					<Value>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.FACESETS}
							selectedDynamic={facesetID}
							indexX={facesetIndexX}
							indexY={facesetIndexY}
							onChange={handleChangeFaceset}
							disabled={!isFaceset}
							active
						/>
					</Value>
					<Label>
						<Checkbox isChecked={isBattler} onChange={setIsBattler}>
							{t('battler')}
						</Checkbox>
					</Label>
					<Value>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.BATTLERS}
							selectedDynamic={battlerID}
							disabled={!isBattler}
							active
						/>
					</Value>
				</Form>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeBattlerGraphics;
