/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosSend } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { BUTTON_TYPE, Constants } from '../../common';
import { Project } from '../../core/Project';
import { RootState, setErrorDialog } from '../../store';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import InputText from '../InputText';
import TextArea from '../TextArea';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterOK from './footers/FooterOK';

function DialogError() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const errorDialog = useSelector((state: RootState) => state.projects.errorDialog);
	const [email, setEmail] = useState('');
	const [isDescription, setIsDescription] = useState(false);
	const [description, setDescription] = useState('');
	const [sendStatus, setSendStatus] = useState<{ ok: boolean; message: string } | null>(null);
	const [loading, setLoading] = useState(false);

	if (!errorDialog) {
		return null;
	}

	const sendErrorReport = async () => {
		setSendStatus(null);
		setLoading(true);
		try {
			const res = await fetch('https://rpg-paper-maker.com/wp-json/rpm/v1/report', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					version: Project.VERSION ?? 'Not loaded',
					os: Constants.IS_DESKTOP ? navigator?.userAgent : 'Web',
					message: errorDialog.message,
					stack: errorDialog.stack,
					email,
					description: isDescription ? description : undefined,
				}),
			});
			if (!res.ok) {
				throw new Error(`${res.status} ${res.statusText}`);
			}
			setSendStatus({ ok: true, message: t('error.dialog.sent') });
		} catch (e) {
			setSendStatus({ ok: false, message: t('error.dialog.send.error', { error: (e as Error).message }) });
		}
		setLoading(false);
	};

	const handleClose = () => {
		dispatch(setErrorDialog(null));
	};

	return (
		<Dialog
			isOpen
			title={t('error.dialog.title')}
			footer={
				<FooterOK
					onOK={handleClose}
					leftContent={
						<Checkbox isChecked={isDescription} onChange={setIsDescription}>
							{t('error.dialog.optional.description')}
						</Checkbox>
					}
				/>
			}
			onClose={handleClose}
			zIndex={Z_INDEX_LEVEL.LAYER_TOP}
			isLoading={loading}
			initialHeight='300px'
		>
			<Flex column spaced>
				<p>{t('error.dialog.intro')}</p>
				{sendStatus ? (
					<div
						style={{
							color: sendStatus.ok ? 'var(--green-color)' : 'var(--red-color)',
						}}
					>
						{sendStatus.message}
					</div>
				) : (
					<Flex column={isDescription} spaced fillWidth fillHeight centerV>
						<Flex one />
						<InputText
							value={email}
							onChange={setEmail}
							placeholder={t('error.dialog.optional.mail')}
							style={{ width: isDescription ? '100%' : undefined }}
						/>
						{isDescription && (
							<TextArea
								text={description}
								onChange={setDescription}
								placeholder={t('error.dialog.optional.description')}
								smallDefaultHeight
							/>
						)}
						<Button
							icon={<IoIosSend />}
							buttonType={BUTTON_TYPE.PRIMARY}
							onClick={sendErrorReport}
							disabled={!!sendStatus}
							fillWidth={isDescription}
						>
							{t('error.dialog.mail')}
						</Button>
						<Flex one />
					</Flex>
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogError;
