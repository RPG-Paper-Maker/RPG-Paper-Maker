/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../common/Utils';
import '../styles/Loader.css';

type Props = {
	isLoading: boolean;
	large?: boolean;
};

function Loader({ isLoading, large = false }: Props) {
	return (
		<>
			{isLoading && (
				<div className={Utils.getClassName([[large, 'loader-large']], ['loader'])}>
					<div className='loader-spinner'></div>
					<div className='loader-text'>Loading...</div>
				</div>
			)}
		</>
	);
}

export default Loader;
