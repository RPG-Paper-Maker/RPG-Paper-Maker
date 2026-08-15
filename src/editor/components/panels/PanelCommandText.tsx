/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaItalic } from 'react-icons/fa';
import { BUTTON_TYPE, PICTURE_KIND } from '../../common';
import { Project } from '../../core/Project';
import { Rectangle } from '../../core/Rectangle';
import { Model } from '../../Editor';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import { LocalVariablesContext } from '../LocalVariablesContext';
import Tab from '../Tab';
import TextArea from '../TextArea';
import DialogPictures from '../dialogs/DialogPictures';

type Props = {
	texts: Map<number, string>;
	onChange: (id: number, text: string) => void;
};

function PanelCommandText({ texts, onChange }: Props) {
	const { t } = useTranslation();
	const localVariables = useContext(LocalVariablesContext);
	const [triggerInsertText, setTriggerInsertText] = useState<string[] | null>(null);
	const [isOpenDialogIcon, setIsOpenDialogIcon] = useState(false);
	const insert = (open: string, close?: string) => setTriggerInsertText(close ? [open, close] : [open]);
	const getContents = () =>
		Project.current!.languages.list.map((language) => (
			<Flex key={language.id} column spaced>
				<Flex column>
					<Flex columnMobile>
						<Flex>
							<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={() => insert('[b]', '[/b]')}>
								<FaBold />
							</Button>
							<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={() => insert('[i]', '[/i]')}>
								<FaItalic />
							</Button>
							<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={() => insert('[l]', '[/l]')}>
								<FaAlignLeft />
							</Button>
							<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={() => insert('[c]', '[/c]')}>
								<FaAlignCenter />
							</Button>
							<Button buttonType={BUTTON_TYPE.PRIMARY_TEXT} onClick={() => insert('[r]', '[/r]')}>
								<FaAlignRight />
							</Button>
						</Flex>
						<Flex>
							<Dropdown
								selectedID={-1}
								onChange={(id) => insert(`[size=${id}]`, '[/size]')}
								options={Project.current!.systems.fontSizes}
								noSelectionName={t('font.size')}
								displayIDs
								noWidthChange
							/>
							<Dropdown
								selectedID={-1}
								onChange={(id) => insert(`[font=${id}]`, '[/font]')}
								options={Project.current!.systems.fontNames}
								noSelectionName={t('font.name')}
								displayIDs
								noWidthChange
							/>
							<Dropdown
								selectedID={-1}
								onChange={(id) => insert(`[textcolor=${id}]`, '[/textcolor]')}
								options={Project.current!.systems.colors}
								noSelectionName={t('text.color')}
								displayIDs
								noWidthChange
							/>
							<Dropdown
								selectedID={-1}
								onChange={(id) => insert(`[backcolor=${id}]`, '[/backcolor]')}
								options={Project.current!.systems.colors}
								noSelectionName={t('back.color')}
								displayIDs
								noWidthChange
							/>
							<Dropdown
								selectedID={-1}
								onChange={(id) => insert(`[strokecolor=${id}]`, '[/strokecolor]')}
								options={Project.current!.systems.colors}
								noSelectionName={t('outline.color')}
								displayIDs
								noWidthChange
							/>
						</Flex>
					</Flex>
					<Flex>
						<Dropdown
							selectedID={-1}
							onChange={(id) => insert(`[var=${id}]`)}
							options={Project.current!.variables.getVariables()}
							noSelectionName={t('variable')}
							displayIDs
							noWidthChange
						/>
						{localVariables.length > 0 && (
							<Dropdown
								selectedID={-1}
								onChange={(id) => insert(`[lvar=${localVariables[id]}]`)}
								options={localVariables.map((name, index) => Model.Base.create(index, name))}
								noSelectionName={t('local.variable')}
								noWidthChange
							/>
						)}
						<Dropdown
							selectedID={-1}
							onChange={(id) => insert(`[par=${id}]`)}
							options={Project.current!.currentMapObjectParameters}
							noSelectionName={t('parameter')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={(id) => insert(`[pro=${id}]`)}
							options={Project.current!.currentMapObjectProperties.map((node) => node.content)}
							noSelectionName={t('property')}
							displayIDs
							noWidthChange
						/>
						<Dropdown
							selectedID={-1}
							onChange={(id) => insert(`[hname=${id}]`)}
							options={Project.current!.variables.getVariables()}
							noSelectionName={t('hero.name')}
							displayIDs
							noWidthChange
						/>
						<Button onClick={() => setIsOpenDialogIcon(true)}>{t('icon')}...</Button>
					</Flex>
				</Flex>
				<TextArea
					text={texts.get(language.id)}
					onChange={(text) => onChange(language.id, text)}
					triggerInsertText={triggerInsertText}
					setTriggerInsertText={setTriggerInsertText}
				/>
			</Flex>
		));
	return (
		<>
			<Tab titles={Project.current!.languages.list} contents={getContents()} />
			{isOpenDialogIcon && (
				<DialogPictures
					setIsOpen={setIsOpenDialogIcon}
					pictureID={-1}
					indexX={0}
					indexY={0}
					kind={PICTURE_KIND.ICONS}
					onAccept={(picture: Model.Picture, rect: Rectangle) =>
						insert(`[ico=${picture.id};${rect.x};${rect.y}]`)
					}
				/>
			)}
		</>
	);
}

export default PanelCommandText;
