/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND, SONG_KIND, Utils } from '../../common';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import useStateNumber from '../../hooks/useStateNumber';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../AssetSelector';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import InputNumber from '../InputNumber';
import PanelCommandText from '../panels/PanelCommandText';
import PlaySongSelector, { PlaySongSelectorRef } from '../PlaySongSelector';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	credits: Model.Credits;
};

function DialogCredits({ setIsOpen, credits }: Props) {
	const { t } = useTranslation();

	const [texts, setTexts] = useState<Map<number, string>>(new Map());
	const [speed, setSpeed] = useStateNumber();
	const [backgroundColorID, setBackgroundColorID] = useStateNumber();
	const [backgroundImageID, setBackgroundImageID] = useStateNumber();
	const [backgroundVideoID, setBackgroundVideoID] = useStateNumber();
	const [canSkip, setCanSkip] = useState(true);
	const [skipKeyID, setSkipKeyID] = useStateNumber();
	const [maintainKey, setMaintainKey] = useState(true);
	const [maintainDuration, setMaintainDuration] = useState(3);
	const musicRef = useRef<PlaySongSelectorRef>(null);

	const initialize = () => {
		setTexts(
			new Map(
				Project.current!.languages.list.map((language) => [
					language.id,
					credits.texts.get(String(language.id)) ?? '',
				]),
			),
		);
		setSpeed(credits.speed);
		setBackgroundColorID(credits.backgroundColorID);
		setBackgroundImageID(credits.backgroundImageID);
		setBackgroundVideoID(credits.backgroundVideoID);
		setCanSkip(credits.canSkip);
		setSkipKeyID(credits.skipKeyID);
		setMaintainKey(credits.maintainKey);
		setMaintainDuration(credits.maintainDuration);
		musicRef.current!.initialize(credits.music);
	};

	const handleTextChange = (id: number, text: string) => {
		setTexts(new Map(texts).set(id, text));
	};

	const handleAccept = async () => {
		credits.texts = new Map(Array.from(texts, ([id, text]) => [String(id), text]));
		credits.speed = speed;
		credits.backgroundColorID = backgroundColorID;
		credits.backgroundImageID = backgroundImageID;
		credits.backgroundVideoID = backgroundVideoID;
		credits.canSkip = canSkip;
		credits.skipKeyID = skipKeyID;
		credits.maintainKey = maintainKey;
		credits.maintainDuration = maintainDuration > 0 ? maintainDuration : 3;
		musicRef.current!.accept(credits.music);
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('credits.options')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='850px'
			initialHeight='600px'
		>
			<Flex column spacedLarge fillWidth>
				<Form>
					<Label>{t('scroll.speed')}</Label>
					<Value>
						<InputNumber value={speed} onChange={setSpeed} min={1} />
					</Value>
					<Label>{t('back.color')}</Label>
					<Value>
						<Dropdown
							selectedID={backgroundColorID}
							onChange={setBackgroundColorID}
							options={Project.current!.systems.colors}
						/>
					</Value>
					<Label>{t('image')}</Label>
					<Value>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.PICTURES}
							kind={PICTURE_KIND.TITLE_SCREENS}
							selectedID={backgroundImageID}
							onChange={setBackgroundImageID}
						/>
					</Value>
					<Label>{t('video')}</Label>
					<Value>
						<AssetSelector
							selectionType={ASSET_SELECTOR_TYPE.VIDEOS}
							selectedID={backgroundVideoID}
							onChange={setBackgroundVideoID}
						/>
					</Value>
					<Label>{t('music')}</Label>
					<Value>
						<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={musicRef} noDynamic />
					</Value>
				</Form>
				<Flex spaced className='flexTopVertically'>
					<Checkbox isChecked={canSkip} onChange={setCanSkip}>
						{t('allow.skip')}:
					</Checkbox>
					<Flex column spacedLarge>
						<Flex spaced centerV>
							<div className={Utils.getClassName({ disabledLabel: !canSkip })}>{t('key.id')}:</div>
							<Dropdown
								selectedID={skipKeyID}
								onChange={setSkipKeyID}
								options={Project.current!.keyboard.list}
								displayIDs
								disabled={!canSkip}
							/>
						</Flex>
						<Flex spaced centerV>
							<Checkbox isChecked={maintainKey} onChange={setMaintainKey} disabled={!canSkip}>
								{t('maintain.key')}
							</Checkbox>
							<InputNumber
								value={maintainDuration}
								onChange={setMaintainDuration}
								min={0.1}
								disabled={!canSkip || !maintainKey}
							/>
							<div className={Utils.getClassName({ disabledLabel: !canSkip || !maintainKey })}>
								{t('seconds')}
							</div>
						</Flex>
					</Flex>
				</Flex>
				<PanelCommandText texts={texts} onChange={handleTextChange} showDynamicValues={false} />
			</Flex>
		</Dialog>
	);
}

export default DialogCredits;
