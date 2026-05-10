/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND } from '../../../common';
import { Project } from '../../../core/Project';
import { Rectangle } from '../../../core/Rectangle';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import { Hero, Localization, ProgressionTable } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import InputLocalization from '../../InputLocalization';
import TexturePreviewer from '../../TexturePreviewer';
import PanelClassContent from './PanelClassContent';

type Props = {
	selectedHero: Hero | null;
	disabled?: boolean;
};

function PanelHeroContent({ selectedHero, disabled = false }: Props) {
	const { t } = useTranslation();

	const [classID, setClassID] = useStateNumber();
	const [description, setDescription] = useState<Localization>(Localization.create(-1, ''));
	const [facesetID, setFacesetID] = useStateNumber();
	const [facesetIndexX, setFacesetIndexX] = useStateNumber();
	const [facesetIndexY, setFacesetIndexY] = useStateNumber();
	const [facesetTexture, setFacesetTexture] = useStateString();
	const [characterID, setCharacterID] = useStateNumber();
	const [characterTexture, setCharacterTexture] = useStateString();
	const [battlerID, setBattlerID] = useStateNumber();
	const [battlerTexture, setBattlerTexture] = useStateString();

	const upperClass = useMemo(() => Project.current!.classes.getByID(selectedHero?.class ?? 1), [selectedHero]);

	const update = () => {
		if (selectedHero) {
			setClassID(selectedHero.class);
			setDescription(selectedHero.description);
			setFacesetID(selectedHero.idFaceset);
			setFacesetIndexX(selectedHero.indexXFaceset);
			setFacesetIndexY(selectedHero.indexYFaceset);
			setFacesetTexture(
				Project.current!.pictures.getByID(PICTURE_KIND.FACESETS, selectedHero.idFaceset)?.getPath() ?? '',
			);
			setCharacterID(selectedHero.idCharacter);
			setCharacterTexture(
				Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, selectedHero.idCharacter)?.getPath() ?? '',
			);
			setBattlerID(selectedHero.idBattler);
			setBattlerTexture(
				Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, selectedHero.idBattler)?.getPath() ?? '',
			);
			ProgressionTable.selectedClassInitialLevel =
				selectedHero.classInherit.initialLevel === -1
					? (upperClass?.initialLevel ?? 1)
					: selectedHero.classInherit.initialLevel;
			ProgressionTable.selectedClassFinalLevel =
				selectedHero.classInherit.finalLevel === -1
					? (upperClass?.finalLevel ?? 100)
					: selectedHero.classInherit.finalLevel;
		} else {
			setClassID(1);
			setDescription(Localization.create(-1, ''));
			setFacesetID(-1);
			setFacesetIndexX(0);
			setFacesetIndexY(0);
			setFacesetTexture('');
			setCharacterID(-1);
			setCharacterTexture('');
			setBattlerID(-1);
			setBattlerTexture('');
		}
	};

	const handleChangeClass = (id: number) => {
		if (selectedHero) {
			selectedHero.class = id;
		}
		setClassID(id);
	};

	const handleFacesetChange = (id: number, indexX: number, indexY: number) => {
		if (selectedHero) {
			selectedHero.idFaceset = id;
			selectedHero.indexXFaceset = indexX;
			selectedHero.indexYFaceset = indexY;
		}
		setFacesetID(id);
		setFacesetIndexX(indexX);
		setFacesetIndexY(indexY);
		setFacesetTexture('');
		setFacesetTexture(Project.current!.pictures.getByID(PICTURE_KIND.FACESETS, id)?.getPath() ?? '');
	};

	const handleCharacterChange = (id: number) => {
		if (selectedHero) {
			selectedHero.idCharacter = id;
		}
		setCharacterID(id);
		setCharacterTexture('');
		setCharacterTexture(Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, id)?.getPath() ?? '');
	};

	const handleBattlerChange = (id: number) => {
		if (selectedHero) {
			selectedHero.idBattler = id;
		}
		setBattlerID(id);
		setBattlerTexture('');
		setBattlerTexture(Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, id)?.getPath() ?? '');
	};

	useLayoutEffect(() => {
		update();
	}, [selectedHero]);

	return (
		<Flex columnMobile one spacedLarge fillWidth>
			<Flex column spacedLarge fillHeight>
				<Flex column spaced>
					<Flex disabledLabel={disabled}>{t('class')}:</Flex>
					<Dropdown
						selectedID={classID}
						onChange={handleChangeClass}
						disabled={disabled}
						options={Project.current!.classes.list}
					/>
				</Flex>
				<Flex column spaced>
					<Flex disabledLabel={disabled}>{t('description')}:</Flex>
					<InputLocalization localization={description} disabled={disabled} />
				</Flex>
				<Flex one>
					<Groupbox title={t('faceset')} disabled={disabled} fillWidth>
						<AssetSelector
							selectedID={facesetID}
							indexX={facesetIndexX}
							indexY={facesetIndexY}
							onChange={handleFacesetChange}
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.FACESETS}
							disabled={disabled}
						/>
						{facesetTexture && (
							<Flex centerH>
								<TexturePreviewer
									texture={facesetTexture}
									base64={!Project.current!.pictures.getByID(PICTURE_KIND.FACESETS, facesetID)?.isBR}
									sourceRectangle={
										new Rectangle(
											Project.current!.systems.facesetsSizeWidth * facesetIndexX,
											Project.current!.systems.facesetsSizeHeight * facesetIndexY,
											Project.current!.systems.facesetsSizeWidth,
											Project.current!.systems.facesetsSizeHeight,
										)
									}
									scale={1}
								/>
							</Flex>
						)}
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('character')} disabled={disabled} fillWidth>
						<Flex column spaced fillHeight>
							<Flex>
								<AssetSelector
									selectedID={characterID}
									onChange={handleCharacterChange}
									selectionType={ASSET_SELECTOR_TYPE.PICTURES}
									kind={PICTURE_KIND.CHARACTERS}
									disabled={disabled}
								/>
							</Flex>
							{characterTexture && (
								<Flex one scrollable style={{ minHeight: '200px' }}>
									<Flex one zeroWidth centerH>
										<TexturePreviewer
											texture={characterTexture}
											base64={
												!Project.current!.pictures.getByID(PICTURE_KIND.CHARACTERS, characterID)
													?.isBR
											}
											scale={1}
										/>
									</Flex>
								</Flex>
							)}
						</Flex>
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('battler')} disabled={disabled} fillWidth>
						<Flex column spaced fillHeight>
							<Flex>
								<AssetSelector
									selectedID={battlerID}
									onChange={handleBattlerChange}
									selectionType={ASSET_SELECTOR_TYPE.PICTURES}
									kind={PICTURE_KIND.BATTLERS}
									disabled={disabled}
								/>
							</Flex>
							{battlerTexture && (
								<Flex one scrollable style={{ minHeight: '200px' }}>
									<Flex one zeroWidth centerH>
										<TexturePreviewer
											texture={battlerTexture}
											base64={
												!Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, battlerID)
													?.isBR
											}
											scale={1}
										/>
									</Flex>
								</Flex>
							)}
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
			<PanelClassContent
				selectedClass={selectedHero?.classInherit ?? null}
				upperClass={upperClass}
				disabled={disabled}
			/>
		</Flex>
	);
}

export default PanelHeroContent;
