/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND, SONG_KIND, TITLE_COMMAND_KIND, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputLocalization from '../../InputLocalization';
import InputNumber from '../../InputNumber';
import PanelCommandText from '../../panels/PanelCommandText';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import TextArea from '../../TextArea';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogTitleCommand({ setIsOpen, model, onAccept, onReject }: Props) {
	const titleCommand = model as Model.TitleCommand;

	const { t } = useTranslation();

	const [localization, setLocalization] = useState(titleCommand);
	const [kind, setKind] = useStateNumber();
	const [script, setScript] = useStateString();
	const [creditsTexts, setCreditsTexts] = useState<Map<number, string>>(new Map());
	const [creditsSpeed, setCreditsSpeed] = useStateNumber();
	const [backgroundColorID, setBackgroundColorID] = useStateNumber();
	const [backgroundImageID, setBackgroundImageID] = useStateNumber();
	const [backgroundVideoID, setBackgroundVideoID] = useStateNumber();
	const [canSkip, setCanSkip] = useState(true);
	const [skipKeyID, setSkipKeyID] = useStateNumber();
	const [maintainKey, setMaintainKey] = useState(true);
	const [maintainDuration, setMaintainDuration] = useState(3);
	const musicRef = useRef<PlaySongSelectorRef>(null);

	const initialize = () => {
		setLocalization(titleCommand);
		setKind(titleCommand.kind);
		setScript(titleCommand.script);
		setCreditsTexts(
			new Map(
				Project.current!.languages.list.map((language) => [
					language.id,
					titleCommand.creditsTexts?.get(String(language.id)) ?? '',
				]),
			),
		);
		setCreditsSpeed(titleCommand.creditsSpeed);
		setBackgroundColorID(titleCommand.creditsBackgroundColorID);
		setBackgroundImageID(titleCommand.creditsBackgroundImageID);
		setBackgroundVideoID(titleCommand.creditsBackgroundVideoID);
		setCanSkip(titleCommand.creditsCanSkip ?? true);
		setSkipKeyID(titleCommand.creditsSkipKeyID ?? Project.current!.keyboard.keyAction);
		setMaintainKey(titleCommand.creditsMaintainKey ?? true);
		setMaintainDuration(titleCommand.creditsMaintainDuration > 0 ? titleCommand.creditsMaintainDuration : 3);
	};

	const handleCreditsTextChange = (id: number, text: string) => {
		setCreditsTexts(new Map(creditsTexts).set(id, text));
	};

	const handleAccept = async () => {
		titleCommand.copy(localization);
		titleCommand.kind = kind;
		titleCommand.script = kind === TITLE_COMMAND_KIND.SCRIPT ? script : '';
		if (kind === TITLE_COMMAND_KIND.CREDITS) {
			titleCommand.creditsTexts = new Map(Array.from(creditsTexts, ([id, text]) => [String(id), text]));
			titleCommand.creditsSpeed = creditsSpeed;
			titleCommand.creditsBackgroundColorID = backgroundColorID;
			titleCommand.creditsBackgroundImageID = backgroundImageID;
			titleCommand.creditsBackgroundVideoID = backgroundVideoID;
			titleCommand.creditsCanSkip = canSkip;
			titleCommand.creditsSkipKeyID = skipKeyID;
			titleCommand.creditsMaintainKey = maintainKey;
			titleCommand.creditsMaintainDuration = maintainDuration > 0 ? maintainDuration : 3;
			musicRef.current?.accept(titleCommand.creditsMusic);
		}
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	useEffect(() => {
		if (kind === TITLE_COMMAND_KIND.CREDITS) {
			musicRef.current?.initialize(titleCommand.creditsMusic);
		}
	}, [kind]);

	return (
		<Dialog
			title={`${t('set.title.command')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='850px'
			initialHeight='650px'
		>
			<Flex column spacedLarge fillWidth>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						<InputLocalization localization={localization} />
					</Value>
					<Label>{t('type.of.command')}</Label>
					<Value>
						<Dropdown
							selectedID={kind}
							onChange={setKind}
							options={Model.Base.TITLE_COMMAND_OPTIONS}
							translateOptions
						/>
					</Value>
				</Form>
				{kind === TITLE_COMMAND_KIND.SCRIPT && (
					<Flex one>
						<TextArea text={script} onChange={setScript} fillHeight />
					</Flex>
				)}
				{kind === TITLE_COMMAND_KIND.CREDITS && (
					<Flex column spacedLarge>
						<Form>
							<Label>{t('scroll.speed')}</Label>
							<Value>
								<InputNumber value={creditsSpeed} onChange={setCreditsSpeed} min={1} />
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
									<div className={Utils.getClassName({ disabledLabel: !canSkip })}>
										{t('key.id')}:
									</div>
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
						<PanelCommandText
							texts={creditsTexts}
							onChange={handleCreditsTextChange}
							showDynamicValues={false}
						/>
					</Flex>
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogTitleCommand;
