/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Monster } from '../../../models';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import PanelHeroContent from './PanelHeroContent';

type Props = {
	selectedMonster: Monster | null;
	disabled?: boolean;
};

function PanelMonsterContent({ selectedMonster, disabled = false }: Props) {
	const { t } = useTranslation();

	const update = async () => {
		if (selectedMonster) {
		} else {
		}
	};

	useLayoutEffect(() => {
		update();
		// eslint-disable-next-line
	}, [selectedMonster]);

	return (
		<Flex column one spacedLarge>
			<PanelHeroContent selectedHero={selectedMonster} disabled={disabled} />
			<Flex column spacedLarge>
				<Groupbox title={t('rewards')}>
					<Flex spaced>
						<Flex one column spaced>
							<div>{t('experience')}:</div>
						</Flex>
						<Flex one column spaced>
							<div>{t('currencies')}:</div>
						</Flex>
						<Flex one column spaced>
							<div>{t('loots')}:</div>
						</Flex>
					</Flex>
				</Groupbox>
				<Groupbox title={t('actions')}></Groupbox>
			</Flex>
		</Flex>
	);
}

export default PanelMonsterContent;
