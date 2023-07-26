import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Game() {
	const { projectName } = useParams();

	useEffect(() => {
		// eslint-disable-next-line
	}, []);

	return (
		<div id='canvas' className='fill-space'>
			{projectName}
		</div>
	);
}

export default Game;
