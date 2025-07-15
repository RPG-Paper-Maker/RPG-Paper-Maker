/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SONG_KIND } from '../../../common';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_TYPE {
	SOUND_EFFECT,
	FLASH,
}

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogAnimationFrameEffect({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const effect = model as Model.AnimationFrameEffect;

	const { t } = useTranslation();

	const playSoundSelectorRef = useRef<PlaySongSelectorRef>(null);

	const [selection, setSelection] = useStateNumber();
	const [condition, setCondition] = useStateNumber();

	const initialize = () => {
		setSelection(effect.isSE ? SELECTION_TYPE.SOUND_EFFECT : SELECTION_TYPE.FLASH);
		playSoundSelectorRef.current?.initialize(effect.se);
		setCondition(effect.condition);
	};

	const handleAccept = async () => {
		effect.isSE = selection === SELECTION_TYPE.SOUND_EFFECT;
		playSoundSelectorRef.current?.accept(effect.se);
		effect.condition = condition;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.animation.effect')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Groupbox title={t('effect')}>
					<RadioGroup selected={selection} onChange={setSelection}>
						<Form>
							<Label>
								<RadioButton value={SELECTION_TYPE.SOUND_EFFECT}>{t('sound.effect')}:</RadioButton>
							</Label>
							<Value>
								<PlaySongSelector songKind={SONG_KIND.SOUND} ref={playSoundSelectorRef} />
							</Value>
							<Label>
								<RadioButton value={SELECTION_TYPE.FLASH} disabled>
									{t('flash')}:
								</RadioButton>
							</Label>
							<Value>
								<Button disabled>{t('edit')}...</Button>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
				<Flex spaced centerV>
					<div>{t('condition')}:</div>
					<Dropdown
						selectedID={condition}
						onChange={setCondition}
						options={Model.Base.ANIMATION_EFFECT_CONDITION_OPTIONS}
						translateOptions
					/>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogAnimationFrameEffect;
