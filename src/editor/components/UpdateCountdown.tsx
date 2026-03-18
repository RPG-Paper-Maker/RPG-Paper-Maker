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
import { FaWrench } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { LocalFile } from '../core/LocalFile';
import { setNeedsReloadPageUpdate } from '../store';
import '../styles/UpdateCountdown.css';
import Flex from './Flex';

function UpdateCountdown() {
	const { t } = useTranslation();

	const [targetDate, setTargetDate] = useState('');
	const [timeLeft, setTimeLeft] = useState('');

	const dispatch = useDispatch();

	const tryGetDate = async () => {
		try {
			const date = await LocalFile.readPublicFile('date');
			if (date) {
				setTargetDate(date);
				setTimeLeft(calculateTimeLeft(date));
				setInterval(() => {
					setTimeLeft(calculateTimeLeft(date));
				}, 1000);
			} else {
				setTimeout(tryGetDate, 1000 * 60);
			}
		} catch {
			setTimeout(tryGetDate, 1000 * 60);
		}
	};

	const calculateTimeLeft = (targetDateStr: string) => {
		const [datePart, timePart] = targetDateStr.split(' ');
		const [day, month, year] = datePart.split('/');
		const [h, m] = timePart.split(':');
		const localString = `${year}-${month}-${day}T${h}:${m}:00`;
		const targetTimestamp = new Date(
			new Date(localString).toLocaleString('en-US', { timeZone: 'Europe/Paris' }),
		).getTime();
		const now = Date.now();
		let diff = targetTimestamp - now;
		if (diff <= 0) {
			diff = 0;
		}
		if (diff === 0) {
			dispatch(setNeedsReloadPageUpdate());
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
