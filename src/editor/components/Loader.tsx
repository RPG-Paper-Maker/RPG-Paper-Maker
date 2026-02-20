/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import { Utils } from '../common';
import '../styles/Loader.css';
import Flex from './Flex';

type Props = {
	isLoading: boolean;
	isHidding?: boolean;
	large?: boolean;
	alone?: boolean;
	percent?: number | null;
	label?: string | null;
};

function Loader({ isLoading, isHidding = false, large = false, alone = false, percent, label }: Props) {
	const { t } = useTranslation();

	return (
		<>
			{isLoading && (
				<>
					<Flex column spacedLarge>
						<div className={Utils.getClassName({ large, alone }, 'loader')}>
							<div className='spinner'></div>
							{large && (
								<div className='text'>
									{t('loading')}
									{percent !== undefined && percent !== null && ` ${percent}%`}...
								</div>
							)}
							{label}
						</div>
					</Flex>
					{isHidding && <div className={'loaderHidder'} />}
				</>
			)}
		</>
	);
}

export default Loader;
