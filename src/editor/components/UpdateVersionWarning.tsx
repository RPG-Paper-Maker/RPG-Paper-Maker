/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { Project } from '../core/Project';
import '../styles/UpdateVersionWarning.css';
import Flex from './Flex';

function UpdateVersionWarning() {
	const { t } = useTranslation();

	const [latestVersion, setLatestVersion] = useState('');
	const [hidden, setHidden] = useState(false);

	const tryGetLatestVersion = async () => {
		try {
			const response = await fetch(
				'https://raw.githubusercontent.com/RPG-Paper-Maker/RPG-Paper-Maker/refs/heads/master/public/version',
			);
			if (response.ok) {
				const trimmed = (await response.text()).trim();
				if (trimmed !== Project.VERSION) {
					setLatestVersion(trimmed);
				}
			} else {
				setTimeout(tryGetLatestVersion, 1000 * 60);
			}
		} catch {
			setTimeout(tryGetLatestVersion, 1000 * 60);
		}
	};

	useEffect(() => {
		tryGetLatestVersion().catch(console.error);
	}, []);

	return latestVersion && !hidden ? (
		<div className='updateVersionWarning'>
			<Flex spaced centerV>
				<FaExclamationTriangle />
				{t('web.outdated.version.message', {
					currentVersion: Project.VERSION,
					latestVersion,
				})}
				<FaExclamationTriangle />
			</Flex>
			<FaTimes className='updateVersionWarningClose' onClick={() => setHidden(true)} />
		</div>
	) : null;
}

export default UpdateVersionWarning;
