/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaItalic } from 'react-icons/fa';
import { BUTTON_TYPE, DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Rectangle } from '../../../core/Rectangle';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Tab from '../../Tab';
import TextArea from '../../TextArea';
import Dialog from '../Dialog';
import DialogPictures from '../DialogPictures';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandShowText({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [isOpenDialogIcon, setIsOpenDialogIcon] = useState(false);
	const [interlocutor] = useStateDynamicValue();
	const [facesetID, setFacesetID] = useStateNumber();
	const [facesetIndexX, setFacesetIndexX] = useStateNumber();
	const [facesetIndexY, setFacesetIndexY] = useStateNumber();
	const [tabTitles, setTabTitles] = useState<Model.Base[]>([]);
	const [texts, setTexts] = useState<Map<number, string>>(new Map());
	const [triggerInsertText, setTriggerInsertText] = useState<string[] | null>(null);

	const initialize = () => {
		setTabTitles(Project.current!.languages.list);
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

	const handleClickBold = () => {
		setTriggerInsertText(['[b]', '[/b]']);
	};

	const handleClickItalic = () => {
		setTriggerInsertText(['[i]', '[/i]']);
	};

	const handleClickLeft = () => {
		setTriggerInsertText(['[l]', '[/l]']);
	};

	const handleClickCenter = () => {
		setTriggerInsertText(['[c]', '[/c]']);
	};

	const handleClickRight = () => {
		setTriggerInsertText(['[r]', '[/r]']);
	};

	const handleChangeFontSize = (id: number) => {
		setTriggerInsertText([`[size=${id}]`, '[/size]']);
	};

	const handleChangeFontName = (id: number) => {
		setTriggerInsertText([`[font=${id}]`, '[/font]']);
	};

	const handleChangeTextColor = (id: number) => {
		setTriggerInsertText([`[textcolor=${id}]`, '[/textcolor]']);
	};

	const handleChangeBackColor = (id: number) => {
		setTriggerInsertText([`[backcolor=${id}]`, '[/backcolor]']);
	};

	const handleChangeOutlineColor = (id: number) => {
		setTriggerInsertText([`[strokecolor=${id}]`, '[/strokecolor]']);
	};

	const handleChangeVariable = (id: number) => {
		setTriggerInsertText([`[var=${id}]`]);
	};

	const handleChangeParameter = (id: number) => {
		setTriggerInsertText([`[par=${id}]`]);
	};

	const handleChangeProperty = (id: number) => {
		setTriggerInsertText([`[pro=${id}]`]);
	};

	const handleChangeHeroName = (id: number) => {
		setTriggerInsertText([`[hname=${id}]`]);
	};

	const handleClickIcon = () => {
		setIsOpenDialogIcon(true);
	};

	const handleAcceptIcon = (picture: Model.Picture, rect: Rectangle) => {
		setTriggerInsertText([`[ico=${picture.id};${rect.x};${rect.y}]`]);
	};

	const handleChangeTextArea = (id: number, text: string) => {
		texts.set(id, text);
		setTexts(new Map(texts));
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		interlocutor.getCommand(newList);
		newList.push(facesetID);
		newList.push(facesetIndexX);
		newList.push(facesetIndexY);
		for (const [id, text] of texts) {
			newList.push(id);
			newList.push(text);
		}
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getTabContents = () =>
		Project.current!.languages.list.map((language) => (
			<Flex key={language.id} column spaced>
				<Flex column>
					<Flex>
						<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={handleClickBold}>
							<FaBold />
						</Button>
						<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={handleClickItalic}>
							<FaItalic />
						</Button>
						<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={handleClickLeft}>
							<FaAlignLeft />
						</Button>
						<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={handleClickCenter}>
							<FaAlignCenter />
						</Button>
						<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={handleClickRight}>
							<FaAlignRight />
						</Button>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeFontSize}
							options={Project.current!.systems.fontSizes}
							noSelectionName={t('font.size')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeFontName}
							options={Project.current!.systems.fontNames}
							noSelectionName={t('font.name')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeTextColor}
							options={Project.current!.systems.colors}
							noSelectionName={t('text.color')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeBackColor}
							options={Project.current!.systems.colors}
							noSelectionName={t('back.color')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeOutlineColor}
							options={Project.current!.systems.colors}
							noSelectionName={t('outline.color')}
							displayIDs
							noWidthChange
						/>
					</Flex>
					<Flex>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeVariable}
							options={Project.current!.variables.getVariables()}
							noSelectionName={t('variable')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeParameter}
							options={Project.current!.currentMapObjectParameters}
							noSelectionName={t('parameter')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeProperty}
							options={Project.current!.currentMapObjectProperties.map((node) => node.content)}
							noSelectionName={t('property')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={handleChangeHeroName}
							options={Project.current!.variables.getVariables()}
							noSelectionName={t('hero.name')}
							displayIDs
							noWidthChange
						/>
						<Button onClick={handleClickIcon}>{t('icon')}...</Button>
					</Flex>
				</Flex>
				<TextArea
					text={texts.get(language.id)}
					onChange={(text) => handleChangeTextArea(language.id, text)}
					triggerInsertText={triggerInsertText}
					setTriggerInsertText={setTriggerInsertText}
				/>
			</Flex>
		));

	return (
		<>
			<Dialog
				title={`${t('show.text')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<Flex column spaced>
					<Form>
						<Label>{t('interlocutor')}</Label>
						<Value>
							<DynamicValueSelector value={interlocutor} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT} />
						</Value>
						<Label>{t('faceset')}</Label>
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
					<Tab titles={tabTitles} contents={getTabContents()} />
				</Flex>
			</Dialog>
			<DialogPictures
				isOpen={isOpenDialogIcon}
				setIsOpen={setIsOpenDialogIcon}
				pictureID={-1}
				indexX={0}
				indexY={0}
				kind={PICTURE_KIND.ICONS}
				onAccept={handleAcceptIcon}
			/>
		</>
	);
}

export default DialogCommandShowText;
