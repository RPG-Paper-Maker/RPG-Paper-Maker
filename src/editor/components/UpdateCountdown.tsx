/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWrench } from 'react-icons/fa';
import { LocalFile } from '../core/LocalFile';
import '../styles/UpdateCountdown.css';
import Flex from './Flex';

function UpdateCountdown({}) {
	const { t } = useTranslation();

	const [targetDate, setTargetDate] = useState('');
	const [timeLeft, setTimeLeft] = useState('');

	const tryGetDate = async () => {
		const date = await LocalFile.readPublicFile('date');
		if (date) {
			setTargetDate(date);
			setTimeLeft(calculateTimeLeft(date));
			setInterval(() => {
				setTimeLeft(calculateTimeLeft(date));
			}, 1000);
		} else {
			setTimeout(tryGetDate, 1000 * 60 * 30);
		}
	};

	const calculateTimeLeft = (targetDateStr: string) => {
		const [datePart, timePart] = targetDateStr.split(' ');
		const [day, month, year] = datePart.split('/');
		const isoString = `${year}-${month}-${day}T${timePart}:00.000+02:00`;
		const targetDate = new Date(isoString);
		const now = new Date();
		let diff = targetDate.getTime() - now.getTime();
		if (diff <= 0) {
			diff = 0;
		}
		const totalSeconds = Math.floor(diff / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return `${hours}h ${minutes}m ${seconds}s`;
	};

	useEffect(() => {
		tryGetDate().catch(console.error);
	}, []);

	return targetDate ? (
		<div className='updateCountdown'>
			<Flex spaced centerV>
				<FaWrench />
				{t('web.update.countdown.message', {
					date: targetDate,
					timeLeft,
				})}
				<FaWrench />
			</Flex>
		</div>
	) : null;
}

export default UpdateCountdown;
