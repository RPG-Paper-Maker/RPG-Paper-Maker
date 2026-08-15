/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useLivePreview from '../../../hooks/useLivePreview';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import PanelCommandText from '../../panels/PanelCommandText';
import TooltipInformation from '../../TooltipInformation';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandShowText({ commandKind, setIsOpen, list, onAccept, onReject, onLivePreview }: CommandProps) {
	const { t } = useTranslation();

	const [interlocutor] = useStateDynamicValue();
	const [facesetID, setFacesetID] = useStateNumber();
	const [facesetIndexX, setFacesetIndexX] = useStateNumber();
	const [facesetIndexY, setFacesetIndexY] = useStateNumber();
	const [texts, setTexts] = useState<Map<number, string>>(new Map());
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		const allTexts = new Map<number, string>();
		for (const language of Project.current!.languages.list) {
			allTexts.set(language.id, '');
		}
		if (list) {
			const iterator = Utils.generateIterator();
			interlocutor.updateCommand(list, iterator);
			setFacesetID(list[iterator.i++] as number);
			setFacesetIndexX(list[iterator.i++] as number);
			setFacesetIndexY(list[iterator.i++] as number);
			while (iterator.i < list.length) {
				const id = list[iterator.i++] as number;
				const text = list[iterator.i++] as string;
				allTexts.set(id, text);
			}
		} else {
			interlocutor.updateToDefaultText();
			setFacesetID(-1);
			setFacesetIndexX(0);
			setFacesetIndexY(0);
		}
		setTexts(allTexts);
	};

	const handleChangeFaceset = (id: number, indexX: number, indexY: number) => {
		setFacesetID(id);
		setFacesetIndexX(indexX);
		setFacesetIndexY(indexY);
	};

	const handleChangeTextArea = (id: number, text: string) => {
		texts.set(id, text);
		setTexts(new Map(texts));
	};

	const buildCommand = () => {
		const newList: MapObjectCommandType[] = [];
		interlocutor.getCommand(newList);
		newList.push(facesetID);
		newList.push(facesetIndexX);
		newList.push(facesetIndexY);
		for (const [id, text] of texts) {
			newList.push(id);
			newList.push(text);
		}
		return Model.MapObjectCommand.createCommand(commandKind, newList);
	};

	useLivePreview(onLivePreview, buildCommand, 500);

	const handleAccept = async () => {
		setIsOpen(false);
		onAccept(buildCommand());
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<>
			<Dialog
				title={`${t('show.text')}...`}
				isOpen
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
				<Flex column spaced>
					<Form>
						<Label>
							<Flex spaced centerV>
								{t('interlocutor')}
								<TooltipInformation text={t('tooltip.interlocutor')} />
							</Flex>
						</Label>
						<Value>
							<DynamicValueSelector
								value={interlocutor}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
								onChangeKind={() => setTrigger((v) => !v)}
								onChangeValue={() => setTrigger((v) => !v)}
							/>
						</Value>
						<Label>
							<Flex spaced centerV>
								{t('faceset')}
								<TooltipInformation text={t('tooltip.faceset')} />
							</Flex>
						</Label>
						<Value>
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.PICTURES}
								kind={PICTURE_KIND.FACESETS}
								selectedID={facesetID}
								indexX={facesetIndexX}
								indexY={facesetIndexY}
								onChange={handleChangeFaceset}
							/>
						</Value>
					</Form>
					<PanelCommandText texts={texts} onChange={handleChangeTextArea} />
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogCommandShowText;
