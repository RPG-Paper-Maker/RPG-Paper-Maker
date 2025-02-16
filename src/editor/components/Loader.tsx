/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import { Utils } from '../common';
import '../styles/Loader.css';

type Props = {
	isLoading: boolean;
	isHidding?: boolean;
	large?: boolean;
	alone?: boolean;
};

function Loader({ isLoading, isHidding = false, large = false, alone = false }: Props) {
	const { t } = useTranslation();

	return (
		<>
			{isLoading && (
				<>
					<div className={Utils.getClassName({ large, alone }, 'loader')}>
						<div className='spinner'></div>
						{large && <div className='text'>{t('loading')}...</div>}
					</div>
					{isHidding && <div className={'loaderHidder'} />}
				</>
			)}
		</>
	);
}

export default Loader;
