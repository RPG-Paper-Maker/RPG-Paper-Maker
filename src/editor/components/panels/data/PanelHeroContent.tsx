/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND } from '../../../common';
import { Project, Rectangle } from '../../../core';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import { Hero, Localization } from '../../../models';
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
	const [battlerID, setBattlerID] = useStateNumber();
	const [battlerTexture, setBattlerTexture] = useStateString();

	const upperClass = useMemo(() => Project.current!.classes.getByID(selectedHero?.class ?? 1), [selectedHero]);

	const update = async () => {
		if (selectedHero) {
			setClassID(selectedHero.class);
			setDescription(selectedHero.description);
			setFacesetID(selectedHero.idFaceset);
			setFacesetIndexX(selectedHero.indexXFaceset);
			setFacesetIndexY(selectedHero.indexYFaceset);
			setFacesetTexture(
				(await Project.current!.pictures.getByID(
					PICTURE_KIND.FACESETS,
					selectedHero.idFaceset
				)?.getPathOrBase64()) ?? ''
			);
			setBattlerID(selectedHero.idBattler);
			setBattlerTexture(
				(await Project.current!.pictures.getByID(
					PICTURE_KIND.BATTLERS,
					selectedHero.idBattler
				)?.getPathOrBase64()) ?? ''
			);
		} else {
			setClassID(1);
			setDescription(Localization.create(-1, ''));
			setFacesetID(-1);
			setFacesetIndexX(0);
			setFacesetIndexY(0);
			setFacesetTexture(
				(await Project.current!.pictures.getByID(PICTURE_KIND.FACESETS, -1)?.getPathOrBase64()) ?? ''
			);
			setBattlerID(-1);
			setBattlerTexture(
				(await Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, -1)?.getPathOrBase64()) ?? ''
			);
		}
	};

	const handleChangeClass = (id: number) => {
		if (selectedHero) {
			selectedHero.class = id;
		}
		setClassID(id);
	};

	const handleFacesetChange = async (id: number, indexX: number, indexY: number) => {
		if (selectedHero) {
			selectedHero.idFaceset = id;
			selectedHero.indexXFaceset = indexX;
			selectedHero.indexYFaceset = indexY;
		}
		setFacesetID(id);
		setFacesetIndexX(indexX);
		setFacesetIndexY(indexY);
		setFacesetTexture('');
		setFacesetTexture(
			(await Project.current!.pictures.getByID(PICTURE_KIND.FACESETS, id)?.getPathOrBase64()) ?? ''
		);
	};

	const handleBattlerChange = async (id: number) => {
		if (selectedHero) {
			selectedHero.idBattler = id;
		}
		setBattlerID(id);
		setBattlerTexture('');
		setBattlerTexture(
			(await Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, id)?.getPathOrBase64()) ?? ''
		);
	};

	useLayoutEffect(() => {
		update();
		// eslint-disable-next-line
	}, [selectedHero]);

	return (
		<Flex one spacedLarge>
			<Flex column spacedLarge fillHeight zeroHeight>
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
					<Groupbox title={t('faceset')} disabled={disabled}>
						<AssetSelector
							selectedID={facesetID}
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
											Project.current!.systems.facesetsSize * facesetIndexX,
											Project.current!.systems.facesetsSize * facesetIndexY,
											Project.current!.systems.facesetsSize,
											Project.current!.systems.facesetsSize
										)
									}
									scale={1}
								/>
							</Flex>
						)}
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('battler')} disabled={disabled}>
						<AssetSelector
							selectedID={battlerID}
							onChange={handleBattlerChange}
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.BATTLERS}
							disabled={disabled}
						/>
						{facesetTexture && (
							<Flex centerH>
								<TexturePreviewer
									texture={battlerTexture}
									base64={!Project.current!.pictures.getByID(PICTURE_KIND.BATTLERS, battlerID)?.isBR}
									scale={1}
								/>
							</Flex>
						)}
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
