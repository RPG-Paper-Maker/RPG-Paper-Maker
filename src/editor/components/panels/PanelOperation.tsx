/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import RadioButton from '../RadioButton';
import RadioGroup from '../RadioGroup';

export enum SELECTION_OPERATION_TYPE {
	EQUALS,
	PLUS,
	MINUS,
	TIMES,
	DIVIDED_BY,
	MODULO,
}

type Props = {
	selectionType: number;
	setSelectionType: (v: number) => void;
};

function PanelOperation({ selectionType, setSelectionType }: Props) {
	const { t } = useTranslation();

	return (
		<Groupbox title={t('operation')}>
			<RadioGroup selected={selectionType} onChange={setSelectionType}>
				<Flex columnMobile spaced>
					<RadioButton value={SELECTION_OPERATION_TYPE.EQUALS}>(=) {t('equals')}</RadioButton>
					<RadioButton value={SELECTION_OPERATION_TYPE.PLUS}>(+) {t('plus')}</RadioButton>
					<RadioButton value={SELECTION_OPERATION_TYPE.MINUS}>(-) {t('minus')}</RadioButton>
					<RadioButton value={SELECTION_OPERATION_TYPE.TIMES}>(*) {t('times')}</RadioButton>
					<RadioButton value={SELECTION_OPERATION_TYPE.DIVIDED_BY}>(/) {t('divided.by')}</RadioButton>
					<RadioButton value={SELECTION_OPERATION_TYPE.MODULO}>(%) {t('modulo')}</RadioButton>
				</Flex>
			</RadioGroup>
		</Groupbox>
	);
}

export default PanelOperation;
